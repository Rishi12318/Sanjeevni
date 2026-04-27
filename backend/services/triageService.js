const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');
const { evaluateSymptoms } = require('../utils/ruleEngine');

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function safeJsonParse(raw) {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (_) {
    const match = String(raw || '').match(/\{[\s\S]*\}/);
    if (!match) return { ok: false };
    try {
      return { ok: true, value: JSON.parse(match[0]) };
    } catch (_) {
      return { ok: false };
    }
  }
}

function normalizeResult(maybeJson) {
  const severity = String(maybeJson?.severity || '').trim().toLowerCase();
  const possible_conditions = Array.isArray(maybeJson?.possible_conditions) ? maybeJson.possible_conditions : [];
  const advice = String(maybeJson?.advice || '').trim();

  return {
    severity: severity || 'unknown',
    possible_conditions,
    advice: advice || 'No advice available.'
  };
}

async function saveLog({ id, inputText, response }) {
  try {
    await db.query(
      `insert into symptom_logs (id, input_text, response)
       values ($1, $2, $3::jsonb)`,
      [id, inputText, JSON.stringify(response)]
    );
  } catch (err) {
    console.warn('symptom_logs insert failed:', err?.message || err);
  }
}

async function triage(inputText) {
  const id = uuidv4();

  const ruleHit = evaluateSymptoms(inputText);
  if (ruleHit) {
    const response = normalizeResult(ruleHit);
    await saveLog({ id, inputText, response });
    return { id, response, source: 'rules' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const response = normalizeResult({
      severity: 'unknown',
      possible_conditions: [],
      advice: 'AI service is not configured. Set OPENAI_API_KEY.'
    });
    await saveLog({ id, inputText, response });
    return { id, response, source: 'fallback' };
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  let contentText = '';
  try {
    const completion = await axios.post(
      OPENAI_URL,
      {
        model,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You are a medical triage assistant. Return ONLY valid JSON matching this schema exactly: ' +
              '{"severity":"","possible_conditions":[],"advice":""}. ' +
              'No markdown, no backticks, no extra keys.'
          },
          { role: 'user', content: `Symptoms: ${String(inputText || '').trim()}` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20_000
      }
    );

    contentText = completion?.data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    const status = err?.response?.status;
    const body = err?.response?.data;
    console.error('OpenAI request failed:', status || '', body || err?.message || err);
    const response = normalizeResult({
      severity: 'unknown',
      possible_conditions: [],
      advice: 'AI service is currently unavailable. Please try again shortly.'
    });
    await saveLog({ id, inputText, response });
    return { id, response, source: 'error' };
  }

  const parsed = safeJsonParse(contentText);
  const response = parsed.ok
    ? normalizeResult(parsed.value)
    : normalizeResult({
        severity: 'unknown',
        possible_conditions: [],
        advice: 'AI returned an unreadable response. Please rephrase your symptoms and try again.'
      });

  await saveLog({ id, inputText, response });
  return { id, response, source: parsed.ok ? 'openai' : 'openai_invalid_json' };
}

async function getHistory(limit = 25) {
  try {
    const { rows } = await db.query(
      `select id, input_text, response, created_at
       from symptom_logs
       order by created_at desc
       limit $1`,
      [limit]
    );
    return rows;
  } catch (_) {
    return [];
  }
}

module.exports = {
  triage,
  getHistory
};

