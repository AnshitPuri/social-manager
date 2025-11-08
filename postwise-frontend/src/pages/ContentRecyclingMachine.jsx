import React, { useState } from 'react';
import { Recycle, Twitter, Instagram, Linkedin, Video, Calendar, TrendingUp, Sparkles, Copy, Check, Share2, Zap, ChevronRight, Loader2, ArrowRight, ThumbsUp, MessageCircle, Eye } from 'lucide-react';

// Platform configurations
const platforms = [
  { 
    id: 'twitter', 
    name: 'Twitter Thread', 
    icon: Twitter, 
    color: 'from-sky-400 to-blue-500',
    format: 'thread',
    description: 'Break into engaging tweet thread'
  },
  { 
    id: 'instagram', 
    name: 'Instagram Carousel', 
    icon: Instagram, 
    color: 'from-pink-500 to-purple-500',
    format: 'carousel',
    description: '5-10 slide visual carousel'
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn Post', 
    icon: Linkedin, 
    color: 'from-blue-600 to-blue-700',
    format: 'professional',
    description: 'Professional long-form post'
  },
  { 
    id: 'reel', 
    name: 'Short Reel Script', 
    icon: Video, 
    color: 'from-red-500 to-pink-500',
    format: 'video',
    description: '30-60 sec video script'
  }
];

// Mock API - Replace with your backend endpoint
const recycleContent = async (postUrl, targetPlatforms) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const originalPost = {
    caption: "5 Ways to Stay Productive:\n\n1. Start with your hardest task\n2. Use the Pomodoro technique\n3. Limit distractions (phone away!)\n4. Take regular breaks\n5. Review your progress daily\n\nWhat's your #1 productivity hack? 💪",
    engagement: { likes: 2450, comments: 180, shares: 95 },
    performance: 200
  };
  
  const recycledContent = {
    twitter: {
      tweets: [
        "🚀 5 Productivity Hacks That Actually Work (Thread)\n\n1/6 👇",
        "1️⃣ Start with your HARDEST task\n\nYour brain is freshest in the morning. Tackle the challenging work first before decision fatigue sets in.\n\n2/6",
        "2️⃣ Use the Pomodoro Technique ⏰\n\n25 min focus + 5 min break = magic\n\nAfter 4 rounds, take a longer 15-30 min break. Your focus will thank you.\n\n3/6",
        "3️⃣ Eliminate Distractions 📱\n\nPhone in another room\nClose unnecessary tabs\nUse website blockers\n\nYour attention is your most valuable asset.\n\n4/6",
        "4️⃣ Take Strategic Breaks 🧘\n\nMovement breaks boost creativity\nStep outside for fresh air\nHydrate & stretch\n\nYour body affects your mind.\n\n5/6",
        "5️⃣ Daily Progress Review 📊\n\nWhat worked?\nWhat didn't?\nWhat's tomorrow's priority?\n\nSmall adjustments = big results over time.\n\n6/6\n\nWhat's YOUR #1 productivity hack? Drop it below! 👇"
      ],
      estimatedEngagement: "+150%"
    },
    instagram: {
      slides: [
        { title: "5 Productivity Hacks", subtitle: "That Actually Work 🚀", style: "bold-gradient" },
        { title: "1. Hardest Task First", content: "Start with the most challenging work when your brain is freshest 🧠", style: "minimal" },
        { title: "2. Pomodoro Technique", content: "25 min work\n5 min break\n= Maximum focus ⏰", style: "highlight" },
        { title: "3. Eliminate Distractions", content: "• Phone in another room\n• Close extra tabs\n• Use blockers 📱", style: "list" },
        { title: "4. Strategic Breaks", content: "Movement boosts creativity. Step outside, hydrate, stretch 🧘", style: "minimal" },
        { title: "5. Daily Review", content: "What worked?\nWhat's next?\nAdjust & improve 📊", style: "highlight" },
        { title: "Your Turn!", content: "What's YOUR #1 productivity hack? Comment below! 💬", style: "cta" }
      ],
      estimatedEngagement: "+180%"
    },
    linkedin: {
      post: "5 Productivity Strategies That Transformed My Work Routine\n\nAfter years of trial and error, these five principles have consistently delivered results:\n\n𝟭. 𝗣𝗿𝗶𝗼𝗿𝗶𝘁𝗶𝘇𝗲 𝗗𝗶𝗳𝗳𝗶𝗰𝘂𝗹𝘁𝘆\nTackle your most challenging task first thing in the morning. Research shows our cognitive capacity is highest during the first few hours after waking.\n\n𝟮. 𝗧𝗶𝗺𝗲-𝗕𝗼𝘅𝗶𝗻𝗴\nThe Pomodoro Technique isn't just a buzzword. 25-minute focused intervals with 5-minute breaks create sustainable productivity without burnout.\n\n𝟯. 𝗘𝗻𝘃𝗶𝗿𝗼𝗻𝗺𝗲𝗻𝘁𝗮𝗹 𝗗𝗲𝘀𝗶𝗴𝗻\nYour workspace shapes your output. Remove digital distractions, optimize your physical space, and create friction for interruptions.\n\n𝟰. 𝗥𝗲𝗰𝗼𝘃𝗲𝗿𝘆 𝗣𝗿𝗼𝘁𝗼𝗰𝗼𝗹𝘀\nBreaks aren't weakness—they're strategy. Movement, fresh air, and hydration aren't optional; they're performance enhancers.\n\n𝟱. 𝗥𝗲𝗳𝗹𝗲𝗰𝘁𝗶𝘃𝗲 𝗣𝗿𝗮𝗰𝘁𝗶𝗰𝗲\nDaily reviews compound over time. What worked? What didn't? What's tomorrow's priority? This meta-cognition drives continuous improvement.\n\nThe data supports this: teams implementing these strategies report 40% higher output with 30% less reported stress.\n\nWhat productivity principles have made the biggest impact in your professional life? I'd love to hear your experiences in the comments.\n\n#Productivity #WorkLife #ProfessionalDevelopment #TimeManagement",
      estimatedEngagement: "+210%"
    },
    reel: {
      script: [
        { time: "0-3s", visual: "Hook shot", text: "STOP wasting 3 hours a day", action: "Bold text overlay" },
        { time: "3-8s", visual: "Problem setup", text: "Most people start their day wrong...", action: "Show messy desk/distractions" },
        { time: "8-15s", visual: "Solution 1", text: "1. HARDEST TASK FIRST", action: "Show focused work" },
        { time: "15-22s", visual: "Solution 2", text: "2. 25 MIN FOCUS BLOCKS", action: "Timer visual" },
        { time: "22-28s", visual: "Solution 3", text: "3. PHONE = AWAY", action: "Dramatic phone removal" },
        { time: "28-35s", visual: "Solution 4", text: "4. MOVE YOUR BODY", action: "Quick stretch/walk" },
        { time: "35-42s", visual: "Solution 5", text: "5. DAILY REVIEW", action: "Checklist visual" },
        { time: "42-50s", visual: "Results", text: "Result: 2X productivity in 30 days", action: "Before/after comparison" },
        { time: "50-60s", visual: "CTA", text: "Save this & share your #1 hack below! 👇", action: "Engage prompt" }
      ],
      estimatedEngagement: "+250%"
    }
  };
  
  return {
    original: originalPost,
    recycled: recycledContent,
    metadata: {
      originalEngagement: originalPost.engagement,
      performanceBoost: originalPost.performance,
      recommendedSchedule: [
        { platform: 'Twitter', time: '9:00 AM', date: 'Today + 3 days' },
        { platform: 'Instagram', time: '7:00 PM', date: 'Today + 5 days' },
        { platform: 'LinkedIn', time: '8:00 AM', date: 'Today + 7 days' },
        { platform: 'Reel', time: '6:30 PM', date: 'Today + 10 days' }
      ]
    }
  };
};

const ContentRecyclingMachine = () => {
  const [step, setStep] = useState('input');
  const [postUrl, setPostUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState({});
  const [autoSchedule, setAutoSchedule] = useState(true);

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleRecycle = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    setStep('processing');
    setLoading(true);

    try {
      const data = await recycleContent(postUrl, selectedPlatforms);
      setResults(data);
      setStep('results');
    } catch (error) {
      console.error('Recycling error:', error);
      alert('Failed to recycle content. Please try again.');
      setStep('selecting');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content, key) => {
    const textToCopy = Array.isArray(content) ? content.join('\n\n') : content;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex({ ...copiedIndex, [key]: true });
    setTimeout(() => setCopiedIndex({ ...copiedIndex, [key]: false }), 2000);
  };

  const handleStartOver = () => {
    setStep('input');
    setPostUrl('');
    setSelectedPlatforms([]);
    setResults(null);
    setCopiedIndex({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Content Recycling Machine
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transform your best-performing posts into multiple formats across all platforms
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-2 mb-10">
          {['Input', 'Select', 'Process', 'Results'].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                step === label.toLowerCase() 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110' 
                  : idx < ['input', 'selecting', 'processing', 'results'].indexOf(step)
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <span className="text-sm">{idx + 1}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {idx < 3 && (
                <ChevronRight className={`w-5 h-5 mx-1 ${
                  idx < ['input', 'selecting', 'processing', 'results'].indexOf(step)
                    ? 'text-purple-500'
                    : 'text-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Find Your Best Content
              </h2>
              <p className="text-gray-600">
                Enter a post URL or ID from any platform
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post URL or ID
                </label>
                <input
                  type="text"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://instagram.com/p/... or paste post ID"
                  className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 text-gray-800"
                />
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Why Recycle Content?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Maximize ROI:</strong> Get 4x more value from high-performing posts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span><strong>Reach New Audiences:</strong> Different platforms = different people</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Save Time:</strong> AI automatically reformats for each platform</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setStep('selecting')}
                disabled={!postUrl.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Platform Selection
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Platform Selection */}
        {step === 'selecting' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <Share2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Choose Target Platforms
              </h2>
              <p className="text-gray-600">
                Select which formats you want to generate
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                
                return (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-6 rounded-2xl border-3 transition-all text-left ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${platform.color} shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {isSelected && (
                        <div className="bg-purple-500 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {platform.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Auto-Schedule Posts</h4>
                  <p className="text-sm text-gray-600">Optimize posting times for each platform</p>
                </div>
              </div>
              <button
                onClick={() => setAutoSchedule(!autoSchedule)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  autoSchedule ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    autoSchedule ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('input')}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Back
              </button>
              <button
                onClick={handleRecycle}
                disabled={selectedPlatforms.length === 0}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Recycle Content
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              AI is Recycling Your Content...
            </h2>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                Analyzing original post performance
              </p>
              <p className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                Adapting for each platform's best practices
              </p>
              <p className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                Optimizing for maximum engagement
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 'results' && results && (
          <div className="space-y-6">
            {/* Performance Summary */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Original Post Performance
                  </h2>
                  <p className="text-gray-600">
                    This post performed {results.metadata.performanceBoost}% above average
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <ThumbsUp className="w-5 h-5 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {results.original.engagement.likes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                  <MessageCircle className="w-5 h-5 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {results.original.engagement.comments.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-200">
                  <Share2 className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {results.original.engagement.shares.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Shares</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                  <Eye className="w-5 h-5 text-amber-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {results.metadata.performanceBoost}%
                  </div>
                  <div className="text-sm text-gray-600">Above Avg</div>
                </div>
              </div>
            </div>

            {/* Twitter Thread */}
            {selectedPlatforms.includes('twitter') && (
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl">
                      <Twitter className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Twitter Thread</h3>
                      <p className="text-sm text-gray-600">
                        Expected boost: <span className="text-emerald-600 font-bold">{results.recycled.twitter.estimatedEngagement}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(results.recycled.twitter.tweets, 'twitter')}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-all"
                  >
                    {copiedIndex.twitter ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-3">
                  {results.recycled.twitter.tweets.map((tweet, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border-2 border-sky-200">
                      <div className="text-gray-700 whitespace-pre-wrap">{tweet}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instagram Carousel */}
            {selectedPlatforms.includes('instagram') && (
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Instagram Carousel</h3>
                      <p className="text-sm text-gray-600">
                        Expected boost: <span className="text-emerald-600 font-bold">{results.recycled.instagram.estimatedEngagement}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(
                      results.recycled.instagram.slides.map(s => `${s.title}\n${s.subtitle || s.content || ''}`),
                      'instagram'
                    )}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg transition-all"
                  >
                    {copiedIndex.instagram ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {results.recycled.instagram.slides.map((slide, idx) => (
                    <div key={idx} className="aspect-square bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-white shadow-lg">
                      <div className="text-sm font-bold mb-1">{slide.title}</div>
                      {slide.subtitle && (
                        <div className="text-xs opacity-90">{slide.subtitle}</div>
                      )}
                      {slide.content && (
                        <div className="text-xs mt-2 opacity-80 whitespace-pre-line">{slide.content}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LinkedIn Post */}
            {selectedPlatforms.includes('linkedin') && (
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">LinkedIn Post</h3>
                      <p className="text-sm text-gray-600">
                        Expected boost: <span className="text-emerald-600 font-bold">{results.recycled.linkedin.estimatedEngagement}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(results.recycled.linkedin.post, 'linkedin')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                  >
                    {copiedIndex.linkedin ? (
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
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-gray-700 whitespace-pre-wrap">{results.recycled.linkedin.post}</div>
                </div>
              </div>
            )}

            {/* Reel Script */}
            {selectedPlatforms.includes('reel') && (
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Short Reel Script</h3>
                      <p className="text-sm text-gray-600">
                        Expected boost: <span className="text-emerald-600 font-bold">{results.recycled.reel.estimatedEngagement}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(
                      results.recycled.reel.script.map(s => `${s.time}: ${s.text}\nVisual: ${s.visual}\nAction: ${s.action}`),
                      'reel'
                    )}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                  >
                    {copiedIndex.reel ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Script
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-3">
                  {results.recycled.reel.script.map((scene, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          {scene.time}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-800 mb-1">{scene.text}</div>
                          <div className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Visual:</span> {scene.visual}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">Action:</span> {scene.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Schedule */}
            {autoSchedule && (
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Recommended Schedule</h3>
                    <p className="text-sm text-gray-600">Optimal posting times for maximum reach</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.metadata.recommendedSchedule.map((schedule, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                      <div className="font-bold text-gray-800 mb-1">{schedule.platform}</div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{schedule.date}</span> at {schedule.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleStartOver}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Recycle Another Post
              </button>
              <button
                onClick={() => alert('Scheduling feature coming soon!')}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule All Posts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentRecyclingMachine;