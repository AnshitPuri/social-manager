// src/pages/PlanPage.jsx
import { useState } from "react";
import Recommender from "../components/Recommender";

function PlanPage() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState(null);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    if (!niche.trim()) {
      setError("Please enter a niche or topic");
      return;
    }

    setError("");
    setLoading(true);
    setIdeas(null);

    try {
      const response = await fetch("/api/recommend_content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });

      if (!response.ok) throw new Error("Recommendation failed");

      const data = await response.json();
      setIdeas(data.ideas);
    } catch (err) {
      setError("Failed to generate content ideas. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI Content Planner
          </h1>
          <p className="text-lg text-gray-600">
            Get smart post ideas with captions and timing.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <Recommender
          niche={niche}
          onNicheChange={setNiche}
          onRecommend={handleRecommend}
          loading={loading}
          results={ideas}
        />
      </div>
    </div>
  );
}

export default PlanPage;
