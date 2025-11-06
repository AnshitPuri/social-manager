import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, TrendingUp, Hash, Smile, BarChart3, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await api.analyzePost(text);

      if (response.success) {
        setResult({
          sentiment: getSentimentLabel(response.data.sentiment),
          sentimentScore: response.data.sentiment / 100,
          readability: response.data.readability,
          emojiCount: response.data.emojiCount,
          hashtagCount: response.data.hashtagCount,
          wordCount: response.data.wordCount,
          charCount: response.data.charCount,
          hashtags: response.data.hashtags,
          tone: response.data.tone || 'Professional & Engaging',
          feedback: response.data.feedback || 'Your post looks good! Try balancing tone and readability for better engagement.'
        });
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze post');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentLabel = (score) => {
    if (score >= 70) return 'Positive';
    if (score >= 40) return 'Neutral';
    return 'Negative';
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      Positive: 'bg-emerald-500',
      Neutral: 'bg-amber-500',
      Negative: 'bg-rose-500',
    };
    return colors[sentiment] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center gap-3 mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-10 h-10 text-sky-500" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              AI Post Analyzer
            </h1>
          </motion.div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Paste your post and get instant tone, sentiment, and engagement insights.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-sky-200/50 p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <div className="mb-6">
            <label className="block text-slate-700 font-semibold mb-3 text-lg">Your Post</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write or paste your social media post here..."
              className="w-full h-48 px-5 py-4 bg-white rounded-2xl border-2 border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200/50 text-slate-800 placeholder-slate-400 resize-none transition-all duration-300 shadow-sm"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2 px-2">
              <span className="text-sm text-slate-500">{text.length} characters</span>
              <span className="text-sm text-slate-500">
                {text.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>

          {/* Button */}
          <motion.button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:cursor-not-allowed"
            whileHover={!loading && text.trim() ? { scale: 1.02 } : {}}
            whileTap={!loading && text.trim() ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                Analyze Post
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-sky-200/50 p-8 md:p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-8 flex items-center gap-3"
              >
                <TrendingUp className="w-8 h-8 text-sky-500" />
                Analysis Results
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Sentiment */}
                <motion.div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-700 font-semibold text-lg">Sentiment</span>
                    <Smile className="w-6 h-6 text-sky-500" />
                  </div>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full ${getSentimentColor(
                      result.sentiment
                    )} text-white font-bold text-lg shadow-md`}
                  >
                    {result.sentiment}
                  </div>
                  <div className="mt-3 text-slate-600 text-sm">
                    Score: {(result.sentimentScore * 100).toFixed(0)}%
                  </div>
                </motion.div>

                {/* Readability */}
                <motion.div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-700 font-semibold text-lg">Readability</span>
                    <BarChart3 className="w-6 h-6 text-sky-500" />
                  </div>
                  <div className="relative h-4 bg-sky-100 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.readability}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="mt-3 text-slate-600 text-sm">{result.readability}/100</div>
                </motion.div>

                {/* Emoji Count */}
                <motion.div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Smile className="w-6 h-6 text-sky-500" />
                        <span className="text-slate-700 font-semibold text-lg">Emojis</span>
                      </div>
                      <motion.div
                        className="text-4xl font-bold text-sky-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        {result.emojiCount}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Hashtag Count */}
                <motion.div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-6 h-6 text-sky-500" />
                        <span className="text-slate-700 font-semibold text-lg">Hashtags</span>
                      </div>
                      <motion.div
                        className="text-4xl font-bold text-sky-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        {result.hashtagCount}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* AI Feedback */}
              <motion.div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-md">
                <h3 className="text-slate-700 font-bold text-xl mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-500" />
                  AI Insights
                </h3>
                <motion.p className="text-slate-600 leading-relaxed text-lg">
                  {result.feedback}
                </motion.p>
              </motion.div>

              {/* Tone */}
              {result.tone && (
                <motion.div className="mt-6 flex items-center gap-3">
                  <span className="text-slate-600 font-semibold">Detected Tone:</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full text-sky-700 font-bold border border-sky-300">
                    {result.tone}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
