const express = require('express');
const { triage, getHistory } = require('../services/triageService');

const router = express.Router();

router.post('/triage', async (req, res) => {
  const text = req.body?.text;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing "text" (string)' });
  }

  try {
    const result = await triage(text);
    return res.json({
      id: result.id,
      ...result.response
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/history', async (req, res) => {
  const limitRaw = req.query?.limit;
  const limit = Math.max(1, Math.min(100, Number(limitRaw || 25) || 25));

  try {
    const rows = await getHistory(limit);
    return res.json({ items: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

