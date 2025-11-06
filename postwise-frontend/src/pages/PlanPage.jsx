import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sparkles, Clock, Loader2, Zap, Copy, Check, Calendar, TrendingUp } from "lucide-react";
import api from "../services/api";

function PlanPage() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("all");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const platforms = [
    { value: "all", label: "All Platforms", emoji: "🌐" },
    { value: "Instagram", label: "Instagram", emoji: "📸" },
    { value: "Twitter", label: "Twitter", emoji: "🐦" },
    { value: "LinkedIn", label: "LinkedIn", emoji: "💼" },
    { value: "Facebook", label: "Facebook", emoji: "👥" },
  ];

  const handleRecommend = async () => {
    if (!niche.trim()) {
      setError("Please enter a niche or topic");
      return;
    }

    setError("");
    setLoading(true);
    setIdeas(null);

    try {
      const response = await api.generatePlan(niche, platform);

      if (!response.success) {
        setError(response.error || "Failed to generate content ideas");
        return;
      }

      setIdeas(response.data.data.ideas);
    } catch (err) {
      setError("Failed to generate content ideas. Please try again.");
      console.error("Plan generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (caption, index) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            AI Content Planner
          </h1>
          <p className="text-xl text-gray-600">
            Get smart post ideas with captions, timing, and platform recommendations
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3 max-w-4xl mx-auto"
          >
            <Zap className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Input Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Platform Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                Target Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {platforms.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlatform(p.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      platform === p.value
                        ? "border-teal-500 bg-teal-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">{p.emoji}</div>
                    <div className="text-sm font-semibold text-gray-700">
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Niche Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                Your Niche or Topic
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., fitness, digital marketing, cooking..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-200 text-gray-800"
                disabled={loading}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleRecommend}
              disabled={loading || !niche.trim()}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5" />
                  Generate Content Ideas
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {ideas && ideas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-teal-600" />
                Content Ideas for {niche}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-teal-300 transition-all"
                  >
                    {/* Idea Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {idea.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-semibold">
                            {idea.platform}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">
                        {idea.caption}
                      </p>
                    </div>

                    {/* Hashtags */}
                    {idea.hashtags && idea.hashtags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {idea.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{idea.bestTime}</span>
                        </div>
                        {idea.estimatedEngagement && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{idea.estimatedEngagement}% engagement</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(idea.caption, index)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg transition-all"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200 mt-8">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Content Planning Tips
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Post during the suggested times for maximum engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>Customize the captions to match your brand voice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Use platform-specific features (Stories, Reels, Threads)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Track which ideas perform best and refine your strategy</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && !ideas && !error && (
          <div className="text-center py-16">
            <Lightbulb className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Ready to generate content ideas?
            </h3>
            <p className="text-gray-500">
              Enter your niche above and let AI create engaging post ideas for you
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlanPage;