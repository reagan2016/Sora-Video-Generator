import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    let result;

    try {
      // Try newest model first
      result = await client.images.generate({
        model: "gpt-image-2",
        prompt,
        size: "1024x1024",
      });
    } catch (e) {
      // Fallback if GPT Image 2 not available
      result = await client.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });
    }

    return Response.json({
      image: result.data[0].url,
    });

  } catch (error) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
