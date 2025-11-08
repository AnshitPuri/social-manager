// utils/fallbackTrends.js
// Use this when API keys are not configured (development mode)

export const FALLBACK_TRENDS = {
  'Digital Marketing': {
    hashtags: [
      { tag: '#AIMarketing2025', platform: 'twitter', posts: 67800, volume: 67800, growth: '+412%', velocity: 'viral', match: 96 },
      { tag: '#ContentStrategy', platform: 'twitter', posts: 45200, volume: 45200, growth: '+278%', velocity: 'hot', match: 92 },
      { tag: '#SocialMediaROI', platform: 'twitter', posts: 34600, volume: 34600, growth: '+189%', velocity: 'trending', match: 88 },
      { tag: '#InfluencerMarketing', platform: 'instagram', posts: 156000, volume: 156000, growth: '+156%', velocity: 'hot', match: 85 },
      { tag: '#SEOTips2025', platform: 'twitter', posts: 28900, volume: 28900, growth: '+234%', velocity: 'viral', match: 91 }
    ],
    sounds: [
      { name: 'Marketing Success Beat', platform: 'tiktok', uses: 2400000, growth: '+458%', velocity: 'viral', match: 89 },
      { name: 'Entrepreneur Anthem', platform: 'tiktok', uses: 1700000, growth: '+312%', velocity: 'hot', match: 82 },
      { name: 'Business Growth Vibes', platform: 'instagram', uses: 980000, growth: '+234%', velocity: 'trending', match: 86 }
    ],
    topics: [
      { topic: 'AI-Powered Marketing Automation', platform: 'reddit', discussions: 15600, growth: '+523%', velocity: 'viral', match: 94 },
      { topic: 'TikTok Shop Success Stories', platform: 'reddit', discussions: 8900, growth: '+298%', velocity: 'hot', match: 87 },
      { topic: 'Email Marketing Comebacks', platform: 'twitter', discussions: 12400, growth: '+187%', velocity: 'trending', match: 83 }
    ]
  },
  'Fitness & Health': {
    hashtags: [
      { tag: '#FitnessTransformation', platform: 'instagram', posts: 289000, volume: 289000, growth: '+387%', velocity: 'viral', match: 95 },
      { tag: '#HealthyHabits2025', platform: 'twitter', posts: 54300, volume: 54300, growth: '+245%', velocity: 'hot', match: 91 },
      { tag: '#WorkoutMotivation', platform: 'tiktok', posts: 178000, volume: 178000, growth: '+198%', velocity: 'trending', match: 88 },
      { tag: '#NutritionTips', platform: 'instagram', posts: 98700, volume: 98700, growth: '+167%', velocity: 'hot', match: 86 }
    ],
    sounds: [
      { name: 'Gym Motivation Anthem', platform: 'tiktok', uses: 3200000, growth: '+567%', velocity: 'viral', match: 92 },
      { name: 'Workout Energy Mix', platform: 'tiktok', uses: 1900000, growth: '+389%', velocity: 'hot', match: 87 },
      { name: 'Fitness Journey Theme', platform: 'instagram', uses: 1200000, growth: '+256%', velocity: 'trending', match: 84 }
    ],
    topics: [
      { topic: '75 Hard Challenge Updates', platform: 'reddit', discussions: 18900, growth: '+456%', velocity: 'viral', match: 93 },
      { topic: 'Home Gym Setup Ideas', platform: 'reddit', discussions: 14200, growth: '+312%', velocity: 'hot', match: 89 },
      { topic: 'Protein Shake Recipes', platform: 'twitter', discussions: 9800, growth: '+198%', velocity: 'trending', match: 82 }
    ]
  },
  'Tech & SaaS': {
    hashtags: [
      { tag: '#AITools2025', platform: 'twitter', posts: 89400, volume: 89400, growth: '+512%', velocity: 'viral', match: 97 },
      { tag: '#SaaSGrowth', platform: 'twitter', posts: 43200, volume: 43200, growth: '+298%', velocity: 'hot', match: 92 },
      { tag: '#ProductivityApps', platform: 'twitter', posts: 67800, volume: 67800, growth: '+234%', velocity: 'viral', match: 90 },
      { tag: '#NoCode2025', platform: 'twitter', posts: 34500, volume: 34500, growth: '+187%', velocity: 'trending', match: 86 }
    ],
    sounds: [
      { name: 'Tech Startup Vibes', platform: 'tiktok', uses: 1800000, growth: '+423%', velocity: 'viral', match: 88 },
      { name: 'Innovation Beat', platform: 'tiktok', uses: 1200000, growth: '+312%', velocity: 'hot', match: 84 }
    ],
    topics: [
      { topic: 'ChatGPT Integration Strategies', platform: 'reddit', discussions: 23400, growth: '+678%', velocity: 'viral', match: 96 },
      { topic: 'SaaS Pricing Models', platform: 'reddit', discussions: 12800, growth: '+345%', velocity: 'hot', match: 89 },
      { topic: 'API-First Development', platform: 'twitter', discussions: 8900, growth: '+234%', velocity: 'trending', match: 85 }
    ]
  },
  'E-commerce': {
    hashtags: [
      { tag: '#Dropshipping2025', platform: 'tiktok', posts: 234000, volume: 234000, growth: '+456%', velocity: 'viral', match: 93 },
      { tag: '#ShopifySuccess', platform: 'instagram', posts: 123000, volume: 123000, growth: '+312%', velocity: 'hot', match: 90 },
      { tag: '#EcommerceGrowth', platform: 'twitter', posts: 56700, volume: 56700, growth: '+234%', velocity: 'trending', match: 87 }
    ],
    sounds: [
      { name: 'E-commerce Success Story', platform: 'tiktok', uses: 2100000, growth: '+489%', velocity: 'viral', match: 91 },
      { name: 'Product Launch Theme', platform: 'tiktok', uses: 1500000, growth: '+345%', velocity: 'hot', match: 86 }
    ],
    topics: [
      { topic: 'Print on Demand Profits', platform: 'reddit', discussions: 16700, growth: '+523%', velocity: 'viral', match: 94 },
      { topic: 'Amazon FBA Strategies', platform: 'reddit', discussions: 11200, growth: '+289%', velocity: 'hot', match: 88 }
    ]
  },
  'Content Creation': {
    hashtags: [
      { tag: '#ContentCreator', platform: 'instagram', posts: 345000, volume: 345000, growth: '+412%', velocity: 'viral', match: 96 },
      { tag: '#CreatorEconomy', platform: 'twitter', posts: 78900, volume: 78900, growth: '+289%', velocity: 'hot', match: 91 },
      { tag: '#VideoEditing', platform: 'tiktok', posts: 167000, volume: 167000, growth: '+198%', velocity: 'trending', match: 87 }
    ],
    sounds: [
      { name: 'Creator Vibes Mix', platform: 'tiktok', uses: 2800000, growth: '+534%', velocity: 'viral', match: 93 },
      { name: 'Behind The Scenes Beat', platform: 'tiktok', uses: 1600000, growth: '+378%', velocity: 'hot', match: 88 }
    ],
    topics: [
      { topic: 'Monetization Strategies', platform: 'reddit', discussions: 19800, growth: '+589%', velocity: 'viral', match: 95 },
      { topic: 'Camera Gear Reviews', platform: 'reddit', discussions: 13400, growth: '+312%', velocity: 'hot', match: 89 }
    ]
  },
  'Finance & Investing': {
    hashtags: [
      { tag: '#Investing2025', platform: 'twitter', posts: 98700, volume: 98700, growth: '+456%', velocity: 'viral', match: 94 },
      { tag: '#FinancialFreedom', platform: 'instagram', posts: 156000, volume: 156000, growth: '+312%', velocity: 'hot', match: 90 },
      { tag: '#StockMarket', platform: 'twitter', posts: 67800, volume: 67800, growth: '+234%', velocity: 'trending', match: 86 }
    ],
    sounds: [
      { name: 'Money Motivation', platform: 'tiktok', uses: 1900000, growth: '+423%', velocity: 'viral', match: 89 },
      { name: 'Wealth Building Theme', platform: 'tiktok', uses: 1300000, growth: '+289%', velocity: 'hot', match: 84 }
    ],
    topics: [
      { topic: 'Crypto Market Analysis', platform: 'reddit', discussions: 24500, growth: '+612%', velocity: 'viral', match: 92 },
      { topic: 'Index Fund Strategies', platform: 'reddit', discussions: 15600, growth: '+345%', velocity: 'hot', match: 87 }
    ]
  },
  'Education': {
    hashtags: [
      { tag: '#EdTech2025', platform: 'twitter', posts: 45600, volume: 45600, growth: '+378%', velocity: 'viral', match: 92 },
      { tag: '#OnlineLearning', platform: 'instagram', posts: 89000, volume: 89000, growth: '+256%', velocity: 'hot', match: 88 },
      { tag: '#StudyTips', platform: 'tiktok', posts: 123000, volume: 123000, growth: '+198%', velocity: 'trending', match: 85 }
    ],
    sounds: [
      { name: 'Study Motivation Beat', platform: 'tiktok', uses: 1700000, growth: '+389%', velocity: 'viral', match: 87 },
      { name: 'Learning Journey Theme', platform: 'tiktok', uses: 1100000, growth: '+267%', velocity: 'hot', match: 83 }
    ],
    topics: [
      { topic: 'AI in Education', platform: 'reddit', discussions: 17800, growth: '+498%', velocity: 'viral', match: 93 },
      { topic: 'Remote Teaching Tools', platform: 'reddit', discussions: 12300, growth: '+289%', velocity: 'hot', match: 86 }
    ]
  },
  'Lifestyle': {
    hashtags: [
      { tag: '#LifestyleGoals', platform: 'instagram', posts: 234000, volume: 234000, growth: '+345%', velocity: 'viral', match: 91 },
      { tag: '#DailyRoutine', platform: 'tiktok', posts: 178000, volume: 178000, growth: '+267%', velocity: 'hot', match: 87 },
      { tag: '#SelfImprovement', platform: 'instagram', posts: 123000, volume: 123000, growth: '+198%', velocity: 'trending', match: 84 }
    ],
    sounds: [
      { name: 'Lifestyle Vibes', platform: 'tiktok', uses: 2200000, growth: '+456%', velocity: 'viral', match: 90 },
      { name: 'Morning Routine Beat', platform: 'tiktok', uses: 1500000, growth: '+312%', velocity: 'hot', match: 85 }
    ],
    topics: [
      { topic: 'Minimalist Living', platform: 'reddit', discussions: 16900, growth: '+423%', velocity: 'viral', match: 92 },
      { topic: 'Sustainable Fashion', platform: 'reddit', discussions: 11700, growth: '+278%', velocity: 'hot', match: 86 }
    ]
  }
};

// Get fallback trends for a specific niche
export const getFallbackTrends = (niche) => {
  return FALLBACK_TRENDS[niche] || FALLBACK_TRENDS['Digital Marketing'];
};

// Simulate API delay for realistic development
export const getFallbackTrendsWithDelay = async (niche, delay = 1000) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return {
    success: true,
    ...getFallbackTrends(niche),
    timestamp: new Date().toISOString(),
    fromFallback: true
  };
};