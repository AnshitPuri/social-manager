import React, { useState } from 'react';
import { Sparkles, Send, TrendingUp, Hash, Smile, BarChart3, AlertCircle, Loader2, Image, Link2, Type, Upload, X, CheckCircle, Zap, Target, Clock, Users } from 'lucide-react';
import { auth } from '../firebase/config.js';

export default function AnalyzePage() {
  const [inputMethod, setInputMethod] = useState('caption');
  const [caption, setCaption] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleAnalyze = async () => {
    setError('');
    
    // Validation based on input method
    if (inputMethod === 'caption' && !caption.trim()) {
      setError('Please enter a caption to analyze');
      return;
    }
    if (inputMethod === 'image' && !selectedImage && !caption.trim()) {
      setError('Please upload an image or enter a caption');
      return;
    }
    if (inputMethod === 'url' && !postUrl.trim()) {
      setError('Please enter a post URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Get Firebase auth token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to analyze posts');
      }
      
      const token = await user.getIdToken();

      // Call backend API
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: caption,
          inputMethod,
          postUrl: inputMethod === 'url' ? postUrl : undefined,
          hasImage: !!selectedImage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze post');
      }

      const data = await response.json();
      
      // Transform backend response to match UI expectations
      const analysisResult = data.data;
      
      const mockResult = {
        overallScore: calculateOverallScore(analysisResult),
        sentiment: getSentimentLabel(analysisResult.sentiment),
        sentimentScore: analysisResult.sentiment / 100,
        readability: analysisResult.readability,
        emojiCount: analysisResult.emojiCount,
        hashtagCount: analysisResult.hashtagCount,
        tone: 'Professional & Engaging',
        wordCount: analysisResult.wordCount,
        characterCount: analysisResult.charCount,
        
        predictions: {
          estimatedReach: estimateReach(analysisResult),
          estimatedEngagement: estimateEngagement(analysisResult),
          bestPostTime: '2:00 PM - 4:00 PM',
          viralPotential: getViralPotential(analysisResult)
        },
        
        strengths: parseStrengths(analysisResult.feedback),
        improvements: parseImprovements(analysisResult.feedback),
        
        hashtags: {
          used: analysisResult.hashtags || [],
          suggested: ['#ContentMarketing', '#DigitalStrategy', '#SocialMediaTips', '#GrowthHacking']
        },
        
        seoScore: analysisResult.readability,
        engagementFactors: {
          callToAction: caption.toLowerCase().includes('click') || caption.toLowerCase().includes('link'),
          emotionalAppeal: analysisResult.sentiment > 60,
          visualElements: !!selectedImage,
          trending: analysisResult.hashtagCount > 3,
          personalStory: false
        },
        
        targetAudience: 'Marketing professionals and content creators',
        contentType: inputMethod === 'image' ? 'Visual Content' : 'Text Post',
        feedback: analysisResult.feedback
      };

      setResult(mockResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const calculateOverallScore = (analysis) => {
    const sentimentScore = analysis.sentiment / 10;
    const readabilityScore = analysis.readability / 10;
    const engagementScore = (analysis.hashtagCount > 0 && analysis.hashtagCount <= 10) ? 8 : 5;
    return parseFloat(((sentimentScore + readabilityScore + engagementScore) / 3).toFixed(1));
  };

  const getSentimentLabel = (score) => {
    if (score >= 70) return 'Positive';
    if (score >= 40) return 'Neutral';
    return 'Negative';
  };

  const estimateReach = (analysis) => {
    const baseReach = 5000;
    const multiplier = (analysis.sentiment / 50) * (analysis.readability / 50);
    const reach = Math.floor(baseReach * multiplier);
    return `${Math.floor(reach / 1000)}K - ${Math.floor(reach * 1.5 / 1000)}K`;
  };

  const estimateEngagement = (analysis) => {
    const engagement = ((analysis.sentiment / 100) * 5 + (analysis.readability / 100) * 3).toFixed(1);
    return `${engagement}%`;
  };

  const getViralPotential = (analysis) => {
    const score = (analysis.sentiment + analysis.readability) / 2;
    if (score >= 75) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };

  const parseStrengths = (feedback) => {
    const strengths = [];
    if (feedback.includes('positive')) strengths.push('Strong positive sentiment detected');
    if (feedback.includes('readability')) strengths.push('Excellent readability score');
    if (feedback.includes('hashtag')) strengths.push('Good hashtag usage');
    if (strengths.length === 0) {
      strengths.push('Clear and concise messaging');
      strengths.push('Optimal text length for the platform');
    }
    return strengths.slice(0, 5);
  };

  const parseImprovements = (feedback) => {
    const improvements = [];
    if (feedback.includes('negative')) improvements.push('Consider more positive language');
    if (feedback.includes('hard to read')) improvements.push('Try shorter sentences for better readability');
    if (feedback.includes('hashtag')) improvements.push('Add 3-5 relevant hashtags');
    if (improvements.length === 0) {
      improvements.push('Include a question to boost comments');
      improvements.push('Add urgency with time-sensitive language');
    }
    return improvements.slice(0, 5);
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      'Positive': 'bg-emerald-500',
      'Neutral': 'bg-amber-500',
      'Negative': 'bg-rose-500'
    };
    return colors[sentiment] || 'bg-gray-500';
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'from-emerald-500 to-green-600';
    if (score >= 6) return 'from-blue-500 to-sky-600';
    if (score >= 4) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-sky-500 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Post Analyzer
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your post and get instant AI-powered insights, recommendations, and engagement predictions
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-sky-200 p-8 md:p-10 mb-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          {/* Input Method Selector */}
          <div className="mb-8">
            <label className="block text-slate-700 font-semibold mb-4 text-lg">
              Choose Input Method
            </label>
            <div className="flex gap-3 p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setInputMethod('caption')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  inputMethod === 'caption'
                    ? 'bg-white shadow-lg text-sky-600 scale-105'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Type className="w-5 h-5" />
                Caption Only
              </button>
              <button
                onClick={() => setInputMethod('image')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  inputMethod === 'image'
                    ? 'bg-white shadow-lg text-sky-600 scale-105'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Image className="w-5 h-5" />
                Image + Caption
              </button>
              <button
                onClick={() => setInputMethod('url')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  inputMethod === 'url'
                    ? 'bg-white shadow-lg text-sky-600 scale-105'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Link2 className="w-5 h-5" />
                Post URL
              </button>
            </div>
          </div>

          {/* Input Content */}
          <div className="mb-6">
            {inputMethod === 'caption' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  Post Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write or paste your social media post caption here..."
                  className="w-full h-48 px-5 py-4 bg-white rounded-2xl border-2 border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 text-slate-800 placeholder-slate-400 resize-none transition-all duration-300 shadow-sm"
                  disabled={loading}
                />
                <div className="flex justify-between items-center mt-2 px-2">
                  <span className="text-sm text-slate-500">
                    {caption.length} characters
                  </span>
                  <span className="text-sm text-slate-500">
                    {caption.trim().split(/\s+/).filter(w => w).length} words
                  </span>
                </div>
              </div>
            )}

            {inputMethod === 'image' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-sky-300 rounded-2xl p-8 text-center hover:border-sky-500 transition-colors bg-sky-50 mb-6">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="max-h-64 rounded-xl shadow-lg" />
                      <button
                        onClick={removeImage}
                        className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                      <p className="text-lg font-semibold text-slate-700 mb-2">Click to upload image</p>
                      <p className="text-sm text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  Caption (Optional)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption for better analysis..."
                  className="w-full h-32 px-5 py-4 bg-white rounded-2xl border-2 border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 text-slate-800 placeholder-slate-400 resize-none transition-all duration-300 shadow-sm"
                  disabled={loading}
                />
              </div>
            )}

            {inputMethod === 'url' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  Post URL
                </label>
                <input
                  type="url"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://instagram.com/p/example... or https://twitter.com/user/status/..."
                  className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 text-slate-800 placeholder-slate-400 transition-all duration-300 shadow-sm"
                  disabled={loading}
                />
                <p className="mt-3 text-sm text-slate-500 px-2">
                  Paste the direct URL from Instagram, Twitter, Facebook, LinkedIn, or TikTok
                </p>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-5 px-6 bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 hover:from-sky-600 hover:via-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Analyze Post
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white rounded-3xl shadow-2xl border border-sky-200 p-8 text-center">
              <div className={`text-7xl font-bold bg-gradient-to-r ${getScoreColor(result.overallScore)} bg-clip-text text-transparent mb-3`}>
                {result.overallScore}/10
              </div>
              <div className="text-2xl font-semibold text-slate-700 mb-2">Overall Score</div>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 rounded-full border border-sky-200">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(result.sentiment)}`} />
                <span className="text-sm font-semibold">{result.sentiment} Sentiment</span>
              </div>
            </div>

            {/* Predictions */}
            <div className="bg-white rounded-3xl shadow-2xl border border-sky-200 p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-sky-500" />
                Performance Predictions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 text-center border border-sky-200">
                  <Users className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                  <div className="text-xs text-slate-600 mb-1">Est. Reach</div>
                  <div className="text-xl font-bold text-slate-800">{result.predictions.estimatedReach}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 text-center border border-purple-200">
                  <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xs text-slate-600 mb-1">Est. Engagement</div>
                  <div className="text-xl font-bold text-slate-800">{result.predictions.estimatedEngagement}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 text-center border border-emerald-200">
                  <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-xs text-slate-600 mb-1">Best Time</div>
                  <div className="text-sm font-bold text-slate-800">{result.predictions.bestPostTime}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 text-center border border-orange-200">
                  <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-xs text-slate-600 mb-1">Viral Potential</div>
                  <div className="text-xl font-bold text-slate-800">{result.predictions.viralPotential}</div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                  Suggested Improvements
                </h3>
                <ul className="space-y-3">
                  {result.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hashtag Recommendations */}
            {result.hashtags && (
              <div className="bg-white rounded-3xl shadow-2xl border border-sky-200 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
                  <Hash className="w-6 h-6 text-sky-500" />
                  Hashtag Recommendations
                </h3>
                <div className="space-y-4">
                  {result.hashtags.used.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-slate-600 mb-2">Currently Used</div>
                      <div className="flex flex-wrap gap-2">
                        {result.hashtags.used.map((tag, idx) => (
                          <span key={idx} className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold border border-sky-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-600 mb-2">Suggested to Add</div>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.suggested.map((tag, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Feedback */}
            <div className="bg-gradient-to-br from-sky-50 to-purple-50 rounded-3xl shadow-2xl border border-sky-200 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-sky-500" />
                AI Insights & Recommendations
              </h3>
              <p className="text-slate-700 leading-relaxed text-lg">
                {result.feedback}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-slate-600 font-semibold">Detected Tone:</span>
                <span className="px-4 py-2 bg-white rounded-full text-sky-700 font-bold border-2 border-sky-300 shadow-sm">
                  {result.tone}
                </span>
                <span className="text-slate-600 font-semibold ml-4">Target Audience:</span>
                <span className="px-4 py-2 bg-white rounded-full text-purple-700 font-bold border-2 border-purple-300 shadow-sm">
                  {result.targetAudience}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}