import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Hash, Music, MessageSquare, Sparkles, RefreshCw, Target, Clock,  ArrowRight, CheckCircle, Play, Instagram, Twitter, Volume2, AlertCircle, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TrendHijackingPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [generatingIdea, setGeneratingIdea] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [userNiche, setUserNiche] = useState('Digital Marketing');

  // Mock trending data
  const trendingData = {
    hashtags: [
      { tag: '#ProductivityHack', platform: 'twitter', posts: '45.2K', growth: '+342%', velocity: 'viral', match: 95 },
      { tag: '#AItools2025', platform: 'twitter', posts: '28.7K', growth: '+198%', velocity: 'hot', match: 88 },
      { tag: '#ContentCreation', platform: 'instagram', posts: '156K', growth: '+89%', velocity: 'trending', match: 92 },
      { tag: '#SocialMediaTips', platform: 'twitter', posts: '91.3K', growth: '+156%', velocity: 'hot', match: 85 },
      { tag: '#CreatorEconomy', platform: 'twitter', posts: '23.1K', growth: '+267%', velocity: 'viral', match: 78 }
    ],
    sounds: [
      { name: 'Motivational Beat 2025', platform: 'tiktok', uses: '2.3M', growth: '+458%', velocity: 'viral', match: 82 },
      { name: 'Tech Startup Vibes', platform: 'instagram', uses: '890K', growth: '+234%', velocity: 'hot', match: 90 },
      { name: 'Success Anthem', platform: 'tiktok', uses: '1.7M', growth: '+189%', velocity: 'trending', match: 75 }
    ],
    topics: [
      { topic: 'AI Productivity Tools', platform: 'reddit', discussions: '12.4K', growth: '+412%', velocity: 'viral', match: 94 },
      { topic: 'Remote Work Setup', platform: 'reddit', discussions: '8.9K', growth: '+178%', velocity: 'hot', match: 81 },
      { topic: 'Side Hustle Ideas', platform: 'twitter', discussions: '34.2K', growth: '+298%', velocity: 'viral', match: 86 }
    ]
  };

  const niches = [
    'Digital Marketing',
    'Fitness & Health',
    'Tech & SaaS',
    'E-commerce',
    'Content Creation',
    'Finance & Investing',
    'Education',
    'Lifestyle'
  ];

  const generateContentIdea = async (trend) => {
    setGeneratingIdea(true);
    setSelectedTrend(trend);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const ideas = {
      hashtag: {
        title: `${trend.tag} × ${userNiche} Strategy`,
        hook: `"Why ${trend.tag} is changing ${userNiche} forever 🚀"`,
        content: `Create a carousel post showing 5 ways ${userNiche} professionals can leverage this trending topic. Include real examples and actionable tips.`,
        platforms: ['Instagram', 'LinkedIn', 'Twitter'],
        format: 'Carousel Post',
        estimatedReach: '15K-50K',
        engagementPrediction: '8.5%'
      },
      sound: {
        title: `Trending Audio × ${userNiche} Reel`,
        hook: `"Using '${trend.name}' to showcase your ${userNiche} expertise"`,
        content: `Create a 15-second reel with this trending audio. Show before/after transformation, quick tips, or day-in-the-life content related to ${userNiche}.`,
        platforms: ['Instagram Reels', 'TikTok'],
        format: 'Short Video',
        estimatedReach: '25K-100K',
        engagementPrediction: '12.3%'
      },
      topic: {
        title: `${trend.topic} Discussion Post`,
        hook: `"My take on ${trend.topic} that nobody's talking about..."`,
        content: `Start a discussion thread sharing unique insights about ${trend.topic} from a ${userNiche} perspective. Ask thought-provoking questions to boost engagement.`,
        platforms: ['Twitter', 'LinkedIn', 'Reddit'],
        format: 'Thread/Discussion',
        estimatedReach: '10K-30K',
        engagementPrediction: '15.8%'
      }
    };

    const type = trend.tag ? 'hashtag' : trend.name ? 'sound' : 'topic';
    setGeneratedIdea(ideas[type]);
    setGeneratingIdea(false);
  };

  const getVelocityColor = (velocity) => {
    switch(velocity) {
      case 'viral': return 'text-red-600 bg-red-100';
      case 'hot': return 'text-orange-600 bg-orange-100';
      case 'trending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVelocityIcon = (velocity) => {
    switch(velocity) {
      case 'viral': return Flame;
      case 'hot': return Zap;
      case 'trending': return TrendingUp;
      default: return Clock;
    }
  };

  const getPlatformIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'tiktok': return Music;
      default: return MessageSquare;
    }
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600';
    if (match >= 80) return 'text-blue-600';
    if (match >= 70) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Real-Time Trend Hijacking
              </h1>
              <p className="text-lg text-slate-600">
                Detect trending topics and instantly generate viral content ideas
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-red-500" />
                <span className="text-sm text-slate-600">Viral Trends</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">23</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-sm text-slate-600">Niche Match</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">87%</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-slate-600">Ideas Generated</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">156</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-600">Last Updated</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">2m ago</p>
            </div>
          </div>
        </div>

        {/* Niche Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-500" />
            Your Niche
          </h3>
          <div className="flex flex-wrap gap-2">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => setUserNiche(niche)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  userNiche === niche
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-lg">
          {[
            { id: 'discover', label: 'Discover Trends', icon: TrendingUp },
            { id: 'generate', label: 'Generate Ideas', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Discover Trends Section */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Trending Hashtags */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Hash className="w-6 h-6 text-sky-500" />
                Trending Hashtags
              </h3>
              <div className="space-y-3">
                {trendingData.hashtags.map((trend, idx) => {
                  const VelocityIcon = getVelocityIcon(trend.velocity);
                  const PlatformIcon = getPlatformIcon(trend.platform);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      onClick={() => generateContentIdea(trend)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <PlatformIcon className="w-5 h-5 text-slate-400" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-slate-800">{trend.tag}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getVelocityColor(trend.velocity)}`}>
                                {trend.velocity.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {trend.posts} posts
                              </span>
                              <span className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                {trend.growth}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getMatchColor(trend.match)}`}>
                            {trend.match}%
                          </div>
                          <div className="text-xs text-slate-500">Niche Match</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Trending Sounds */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-purple-500" />
                Trending Audio
              </h3>
              <div className="space-y-3">
                {trendingData.sounds.map((trend, idx) => {
                  const VelocityIcon = getVelocityIcon(trend.velocity);
                  const PlatformIcon = getPlatformIcon(trend.platform);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      onClick={() => generateContentIdea(trend)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Music className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-slate-800">{trend.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getVelocityColor(trend.velocity)}`}>
                                {trend.velocity.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Play className="w-4 h-4" />
                                {trend.uses} uses
                              </span>
                              <span className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                {trend.growth}
                              </span>
                              <PlatformIcon className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getMatchColor(trend.match)}`}>
                            {trend.match}%
                          </div>
                          <div className="text-xs text-slate-500">Niche Match</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange-500" />
                Hot Topics & Discussions
              </h3>
              <div className="space-y-3">
                {trendingData.topics.map((trend, idx) => {
                  const VelocityIcon = getVelocityIcon(trend.velocity);
                  const PlatformIcon = getPlatformIcon(trend.platform);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      onClick={() => generateContentIdea(trend)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <PlatformIcon className="w-5 h-5 text-slate-400" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-slate-800">{trend.topic}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getVelocityColor(trend.velocity)}`}>
                                {trend.velocity.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {trend.discussions} discussions
                              </span>
                              <span className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                {trend.growth}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getMatchColor(trend.match)}`}>
                            {trend.match}%
                          </div>
                          <div className="text-xs text-slate-500">Niche Match</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Generate Ideas Section */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            {generatingIdea ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <RefreshCw className="w-16 h-16 text-sky-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Generating Content Ideas...</h3>
                <p className="text-slate-600">Analyzing trend and matching with your niche</p>
              </div>
            ) : generatedIdea ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{generatedIdea.title}</h3>
                    <p className="text-lg text-sky-600 italic">{generatedIdea.hook}</p>
                  </div>
                  <button
                    onClick={() => setGeneratedIdea(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Content Description */}
                  <div className="p-4 bg-sky-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-2">Content Strategy</h4>
                    <p className="text-slate-700">{generatedIdea.content}</p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-slate-700">Estimated Reach</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{generatedIdea.estimatedReach}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-slate-700">Engagement Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{generatedIdea.engagementPrediction}</p>
                    </div>
                  </div>

                  {/* Format & Platforms */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Content Format</h4>
                      <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                        {generatedIdea.format}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Best Platforms</h4>
                      <div className="flex gap-2">
                        {generatedIdea.platforms.map((platform, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Create This Content
                    </button>
                    <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all">
                      Save for Later
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Select a Trend to Generate Ideas</h3>
                <p className="text-slate-600 mb-6">Go to "Discover Trends" and click on any trend to generate content ideas</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl transition-all"
                >
                  Browse Trends
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrendHijackingPage;