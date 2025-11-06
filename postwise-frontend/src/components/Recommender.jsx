import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, Clock, Loader2, Zap } from 'lucide-react';
import api from '../services/api';

function Recommender() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleRecommend = async () => {
    if (!niche.trim()) {
      setError('Please enter a niche');
      return;
    }

    setError('');
    setLoading(true);
    setResults([]);

    try {
      const response = await api.generatePlan(niche);
      
      if (response.success) {
        // Map backend response to frontend format
        const mappedIdeas = response.data.ideas.map((idea) => ({
          title: idea.title,
          caption: idea.caption,
          platform: idea.platform,
          best_time: idea.bestTime,
          hashtags: idea.hashtags || [],
        }));
        setResults(mappedIdeas);
      } else {
        setError('Failed to fetch ideas. Try again later.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate ideas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
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

      <div className="max-w-6xl mx-auto relative z-10">
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
              <Lightbulb className="w-10 h-10 text-sky-500" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Content Ideas
            </h1>
          </motion.div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get AI-powered content ideas tailored to your niche
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-sky-200/50 p-8 md:p-10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <label className="block text-slate-700 font-semibold mb-3 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            Your Niche
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Enter your niche, e.g., tech tutorials, fitness, cooking..."
            className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200/50 text-slate-800 placeholder-slate-400 transition-all duration-300 shadow-sm text-lg"
            disabled={loading}
          />

          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
          )}

          <motion.button
            onClick={handleRecommend}
            disabled={loading || !niche.trim()}
            className="mt-6 w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:cursor-not-allowed"
            whileHover={!loading && niche.trim() ? { scale: 1.02 } : {}}
            whileTap={!loading && niche.trim() ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                Generate Ideas
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="flex flex-col justify-center items-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full"></div>
              </motion.div>
              <motion.p
                className="mt-4 text-slate-600 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Crafting brilliant ideas for you...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && results.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-8 h-8 text-sky-500" />
                Generated Ideas
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((idea, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-sky-200/50 p-6 hover:shadow-2xl transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 leading-tight">
                        {idea.title}
                      </h3>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {idea.caption}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-sky-100">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full">
                        <span className="text-sm font-bold text-sky-700">
                          {idea.platform}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {idea.best_time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Recommender;
