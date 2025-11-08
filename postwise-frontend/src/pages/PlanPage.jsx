import React, { useState } from 'react';
import { Lightbulb, Sparkles, Clock, RefreshCw, Copy, Check, TrendingUp, X } from 'lucide-react';

// Add your Gemini API key here
const GEMINI_API_KEY = "AIzaSyCCdAXWUaup5Mz9zALQQ0TaUQO2To9pK7M";

export default function PlanPage() {
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

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      setError('Please add your Gemini API key. Get it free from: https://aistudio.google.com/app/apikey');
      return;
    }

    setError("");
    setLoading(true);
    setIdeas(null);

    try {
      const platformText = platform === "all" ? "all social media platforms" : platform;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate 6 creative content ideas for ${niche} on ${platformText}. Return ONLY valid JSON with no preamble or markdown backticks, in this exact format:
{
  "ideas": [
    {
      "id": "1",
      "title": "Post title",
      "caption": "Engaging caption text",
      "platform": "Platform name",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "bestTime": "Best time to post (e.g., 9 AM - 11 AM)",
      "estimatedEngagement": 8
    }
  ]
}

Make each idea unique, engaging, and tailored for the platform. Include relevant hashtags and realistic engagement estimates (5-10%).`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const cleanText = textContent.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      
      if (parsed.ideas && Array.isArray(parsed.ideas)) {
        setIdeas(parsed.ideas);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(`Failed to generate content ideas: ${err.message}`);
      console.error('Plan generation error:', err);
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
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            AI Content Planner
          </h1>
          <p className="text-xl text-slate-600">
            Get smart post ideas with captions, timing, and platform recommendations
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3 max-w-5xl mx-auto">
            <X className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Card */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Platform Selector */}
            <div className="mb-6">
              <label className="block text-slate-700 font-semibold mb-3 text-lg">
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
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-1">{p.emoji}</div>
                    <div className="text-sm font-semibold text-slate-700">
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Niche Input */}
            <div className="mb-6">
              <label className="block text-slate-700 font-semibold mb-3 text-lg">
                Your Niche or Topic
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., fitness, digital marketing, cooking..."
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-200 text-slate-800"
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
                  <RefreshCw className="w-5 h-5 animate-spin" />
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
        {ideas && ideas.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-600" />
              Content Ideas for {niche}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {ideas.map((idea, index) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200 hover:border-teal-300 transition-all"
                >
                  {/* Idea Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-800 mb-2">
                        {idea.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-semibold">
                          {idea.platform}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="mb-4">
                    <p className="text-slate-700 leading-relaxed">
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
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{idea.bestTime}</span>
                      </div>
                      {idea.estimatedEngagement && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{idea.estimatedEngagement}%</span>
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
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200 mt-8">
              <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Content Planning Tips
              </h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Timing:</strong> Post during the suggested times for maximum engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span><strong>Customization:</strong> Adjust captions to match your brand voice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Features:</strong> Use platform-specific features (Stories, Reels, Threads)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Analytics:</strong> Track which ideas perform best and refine your strategy</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !ideas && !error && (
          <div className="text-center py-16 max-w-5xl mx-auto">
            <Lightbulb className="w-20 h-20 mx-auto mb-4 text-slate-300" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">
              Ready to generate content ideas?
            </h3>
            <p className="text-slate-500">
              Enter your niche above and let AI create engaging post ideas for you
            </p>
          </div>
        )}
      </div>
    </div>
  );
}