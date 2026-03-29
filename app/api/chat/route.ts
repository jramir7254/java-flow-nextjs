import Cerebras from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_KEY,
});

interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { messages } = body;

    const completionStream = await client.chat.completions.create({
      messages,
      model: 'gpt-oss-120b',
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completionStream) {
          const content = (chunk as any).choices?.[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
      cancel() {
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Error generating chat response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
