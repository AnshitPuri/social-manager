import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Check, Sparkles, Loader2 } from "lucide-react";

function Improver({
  text,
  tone,
  onTextChange,
  onToneChange,
  onImprove,
  loading,
  variations,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toneEmojis = {
    professional: "💼",
    friendly: "😊",
    funny: "😄"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Wand2 className="w-10 h-10 text-sky-500" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Post Improver
            </h1>
          </motion.div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transform your content with AI-powered improvements in any tone
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-sky-200/50 p-8 md:p-10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-6">
            <label className="block text-slate-700 font-semibold mb-3 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              Your Post Caption
            </label>
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Enter your post caption here…"
              className="w-full h-40 px-5 py-4 bg-white rounded-2xl border-2 border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200/50 text-slate-800 placeholder-slate-400 resize-none transition-all duration-300 shadow-sm"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2 px-2">
              <span className="text-sm text-slate-500">
                {(text || '').length} characters
              </span>
              <span className="text-sm text-slate-500">
                {(text || '').trim().split(/\s+/).filter(w => w).length} words
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 font-semibold mb-3 text-lg">
              Select Tone
            </label>
            <div className="relative">
              <select
                value={tone}
                onChange={(e) => onToneChange(e.target.value)}
                className="w-full p-4 pr-10 bg-white border-2 border-sky-200 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200/50 text-slate-800 appearance-none cursor-pointer transition-all duration-300 shadow-sm font-medium"
                disabled={loading}
              >
                <option value="professional">{toneEmojis.professional} Professional</option>
                <option value="friendly">{toneEmojis.friendly} Friendly</option>
                <option value="funny">{toneEmojis.funny} Funny</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <motion.button
            onClick={onImprove}
            disabled={loading || !(text || '').trim()}
            className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:cursor-not-allowed"
            whileHover={!loading && (text || '').trim() ? { scale: 1.02 } : {}}
            whileTap={!loading && (text || '').trim() ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating Variations...
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                Generate Improved Versions
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
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full"></div>
              </motion.div>
              <motion.p
                className="mt-4 text-slate-600 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Creating amazing variations...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <AnimatePresence>
          {variations && variations.length > 0 && !loading && (
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
                Generated Variations
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {variations.map((variation, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-sky-200/50 p-6 hover:shadow-2xl transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">
                          Version {index + 1}
                        </h3>
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(variation, index)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                          copiedIndex === index
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                      </motion.button>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-base">
                      {variation}
                    </p>
                    <div className="mt-4 pt-4 border-t border-sky-100">
                      <span className="text-xs text-slate-500 font-medium">
                        {(variation || '').length} characters • {(variation || '').split(/\s+/).length} words
                      </span>
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

export default Improver;