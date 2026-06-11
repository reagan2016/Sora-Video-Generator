"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");

  async function generate() {
    setLoading(true);
    setImage("");
    setProgress(0);
    setStage("Starting...");

    // fake progress controller
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8;

      if (p < 30) setStage("Understanding prompt...");
      else if (p < 70) setStage("Creating image...");
      else setStage("Finishing details...");

      if (p >= 95) p = 95;

      setProgress(p);
    }, 200);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      clearInterval(interval);
      setProgress(100);
      setStage("Done!");

      setTimeout(() => {
        setImage(data.image);
        setLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setStage("Error");
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🎨 AI Image Generator</h1>

      <textarea
        rows={4}
        style={{ width: "100%" }}
        placeholder="Describe your image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br /><br />

      <button onClick={generate} disabled={loading || !prompt}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* LOADING UI */}
      {loading && (
        <div style={{ marginTop: 20 }}>
          <p>⏳ {stage}</p>

          <div style={{
            width: "100%",
            height: 10,
            background: "#333",
            borderRadius: 5,
            overflow: "hidden"
          }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg,#4f46e5,#22c55e)",
                transition: "width 0.2s ease"
              }}
            />
          </div>

          <p>{Math.round(progress)}%</p>
        </div>
      )}

      {/* RESULT */}
      {image && (
        <div style={{ marginTop: 20 }}>
          <img
            src={image}
            style={{ width: "100%", borderRadius: 10 }}
          />
        </div>
      )}
    </main>
  );
}