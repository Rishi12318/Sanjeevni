import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1'

async function callOllama(prompt: string): Promise<string> {
  const url = `${OLLAMA_BASE_URL.replace(/\/$/, '')}/api/generate`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    }),
    // Abort after 30 s to avoid Vercel function timeout
    signal: AbortSignal.timeout(120_000),
  })

  if (!response.ok) {
    throw new Error(`Ollama HTTP ${response.status}`)
  }

  const data = await response.json()

  // Ollama /api/generate → { response: "..." }
  if (typeof data?.response === 'string') return data.response.trim()
  if (typeof data?.output === 'string') return data.output.trim()

  // Older streaming-like shape: results[]
  const results = data?.results || data?.outputs
  if (Array.isArray(results) && results.length > 0) {
    const first = results[0]
    const content = first?.content || first?.output
    if (Array.isArray(content)) {
      return content
        .filter((c: any) => typeof c?.text === 'string')
        .map((c: any) => c.text)
        .join(' ')
        .trim()
    }
    if (typeof first?.text === 'string') return first.text.trim()
  }

  return JSON.stringify(data).slice(0, 500)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = (body.message || '').trim()

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    try {
      const reply = await callOllama(
        `You are a compassionate healthcare assistant for Sanjeevni AI. Reply helpfully and concisely to: ${message}`
      )
      return NextResponse.json({ ok: true, reply })
    } catch (ollamaErr) {
      console.warn('[/api/chat] Ollama unavailable:', ollamaErr)
      return NextResponse.json({
        ok: false,
        reply: 'The AI assistant is currently unavailable. Please try again later or contact support.',
      })
    }
  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
