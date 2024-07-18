import type { NextApiRequest, NextApiResponse } from 'next'
import { Ollama } from 'ollama'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const ollama = new Ollama()
    const { messages } = req.body

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    })

    try {
      const stream = await ollama.chat({
        model: 'llama2',
        messages,
        stream: true,
      })

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`)
      }
    } catch (error) {
      console.error('Error:', error)
      res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`)
    } finally {
      res.end()
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}