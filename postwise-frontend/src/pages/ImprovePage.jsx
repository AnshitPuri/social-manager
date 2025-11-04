// src/pages/ImprovePage.jsx
import { useState } from "react";
import Improver from "../components/Improver";

function ImprovePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState(null);
  const [error, setError] = useState("");

  const handleImprove = async () => {
    if (!text.trim()) {
      setError("Please enter some text to improve");
      return;
    }

    setError("");
    setLoading(true);
    setVariations(null);

    try {
      const response = await fetch("/api/improve_post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      if (!response.ok) throw new Error("Improvement failed");

      const data = await response.json();
      setVariations(data.variations);
    } catch (err) {
      setError("Failed to generate improved versions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI Post Improver
          </h1>
          <p className="text-lg text-gray-600">
            Make your captions more engaging and platform-ready.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <Improver
          text={text}
          tone={tone}
          onTextChange={setText}
          onToneChange={setTone}
          onImprove={handleImprove}
          loading={loading}
          variations={variations}
        />
      </div>
    </div>
  );
}

export default ImprovePage;
