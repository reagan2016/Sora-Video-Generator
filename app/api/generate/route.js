export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    // 🧠 1. FREE PROMPT ENHANCER (no API key)
    const enhanceRes = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs:
            "Turn this into a detailed cinematic image prompt: " +
            prompt,
        }),
      }
    );

    let enhancedPrompt = prompt;

    try {
      const result = await enhanceRes.json();
      if (result?.[0]?.generated_text) {
        enhancedPrompt = result[0].generated_text;
      }
    } catch {}

    // 🎨 2. IMAGE GENERATION (no key)
    const imageRes = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
        }),
      }
    );

    const blob = await imageRes.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return Response.json({
      image: `data:image/png;base64,${base64}`,
      enhancedPrompt,
    });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}