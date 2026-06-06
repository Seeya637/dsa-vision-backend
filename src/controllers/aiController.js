import OpenAI from 'openai';

// ── Groq client setup ───────────────────────────────────────


// ── System prompt — defined BEFORE use ─────────────────────
const SYSTEM_PROMPT = `You are DSA Sensei 🥷 — an elite Data Structures 
and Algorithms expert and teacher. You were built into DSA Vision, 
an algorithm visualizer.

YOUR PERSONALITY:
- Sharp, precise, and confident like a sensei
- Encouraging but strict — no fluff, no filler
- Use emojis sparingly but effectively (🥷⚡💡)

WHAT YOU CAN DO:
1. Explain ANY DSA concept — arrays, linked lists, trees, 
   graphs, sorting, searching, dynamic programming, etc.
2. Debug code — user pastes code, you find bugs and fix them
3. Compare algorithms — time/space complexity, use cases
4. Answer short OR detailed based on user's request
5. Give examples with dry runs
6. Explain in simple terms for beginners

RESPONSE RULES:
- If user asks for "short" answer → 2-3 lines max
- If user asks for "detailed" → full explanation with example
- Always use proper code blocks with language specified
- For code debugging → point out exact line and why it's wrong
- Always mention time and space complexity when relevant
- Format code nicely using markdown code blocks

WHAT YOU DO NOT DO:
- Answer non-DSA questions (cooking, movies, etc.)
- For off-topic: say "I am DSA Sensei 🥷 — I only answer 
  DSA and programming questions. Ask me about algorithms!"
- Never make up algorithms that don't exist

CURRENT CONTEXT:
The user is currently using DSA Vision visualizer.
They may ask about the algorithm they are currently watching.
`;

// ── Main chat handler ───────────────────────────────────────
export const chatWithSensei = async (req, res) => {
  try {
    const { messages, currentAlgo, currentCategory } = req.body;

    // validate
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
const client = new OpenAI({
  apiKey:  process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
    // ✅ build system prompt with current context
    const systemWithContext = SYSTEM_PROMPT + (
      currentAlgo
        ? `\n\nCURRENT CONTEXT: User is currently visualizing "${currentAlgo}" algorithm in "${currentCategory}" category. If they ask questions that seem related to what they're viewing, assume they're asking about ${currentAlgo}.`
        : ''
    );

    // set streaming headers BEFORE creating stream
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    // ✅ stream created INSIDE the function with correct system prompt
    const stream = await client.chat.completions.create({
      model:      'llama-3.1-8b-instant',
      messages:   [
        { role: 'system', content: systemWithContext }, // ✅ uses context
        ...messages
      ],
      stream:     true,
      max_tokens: 1024,
    });

    // stream each chunk to frontend
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) res.write(text);
    }

    res.end();

  } catch (err) {
    console.error('AI error:', err.message);

    // if headers not sent yet — send JSON error
    if (!res.headersSent) {
      res.status(500).json({ error: 'DSA Sensei is unavailable. Try again.' });
    } else {
      res.end('\n\n[Error: DSA Sensei encountered an issue]');
    }
  }
};