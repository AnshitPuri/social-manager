import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  BarChart3, 
  Wand2, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Users, 
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Star,
  Rocket,
  Target,
  Play,
  Award,
  Clock,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleLogin = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: 'Analyze',
      description: 'Get deep insights from your posts and engagement metrics. Understand what works.',
      link: '/analyze',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      iconGradient: 'from-blue-400 to-cyan-400',
      particles: '📊',
      stats: '10K+ Analyses'
    },
    {
      icon: Wand2,
      title: 'Improve',
      description: 'Use AI to enhance your captions and visuals. Create content that converts.',
      link: '/improve',
      gradient: 'from-purple-500 via-purple-600 to-pink-500',
      iconGradient: 'from-purple-400 to-pink-400',
      particles: '✨',
      stats: '5M+ Enhanced'
    },
    {
      icon: Calendar,
      title: 'Plan',
      description: 'Schedule and manage your content calendar. Stay consistent effortlessly.',
      link: '/plan',
      gradient: 'from-orange-500 via-red-500 to-rose-500',
      iconGradient: 'from-orange-400 to-rose-400',
      particles: '📅',
      stats: '50K+ Scheduled'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Posts Analyzed', icon: BarChart3 },
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '99.9%', label: 'Uptime', icon: Shield },
    { value: '4.9/5', label: 'User Rating', icon: Star }
  ];

  const testimonials = [
    {
      text: "Postwise helped me grow engagement by 40% in just one week! The AI recommendations are incredibly accurate.",
      author: "Sarah Chen",
      role: "Content Creator",
      avatar: "SC",
      rating: 5,
      image: "from-pink-500 to-rose-500"
    },
    {
      text: "Finally, a tool that actually understands social media growth. Game-changer for my agency!",
      author: "Marcus Johnson",
      role: "Digital Marketer",
      avatar: "MJ",
      rating: 5,
      image: "from-blue-500 to-cyan-500"
    },
    {
      text: "The AI recommendations are spot-on. My content has never been better or more engaging.",
      author: "Emma Rodriguez",
      role: "Influencer",
      avatar: "ER",
      rating: 5,
      image: "from-purple-500 to-pink-500"
    }
  ];

  const pricingFeatures = [
    'Unlimited posts analysis',
    'AI-powered recommendations',
    'Advanced scheduling',
    'Cross-platform support',
    'Priority support',
    'Custom analytics reports'
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-purple-950 to-black"></div>
        
        {/* Animated mesh gradient */}
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.3), transparent 40%),
                        radial-gradient(circle at ${100-mousePosition.x}% ${100-mousePosition.y}%, rgba(168, 85, 247, 0.2), transparent 50%)`
          }}
        ></div>
        
        {/* Animated orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        ></motion.div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-32">
          {/* 3D Spline - Positioned behind but visible */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full max-w-6xl opacity-30">
              <iframe 
                src='https://my.spline.design/robotfollowcursorforlandingpagemccopy-eikGq6VvZL7xI43VMrAF9Zee/' 
                frameBorder='0' 
                width='100%' 
                height='100%'
                className="pointer-events-auto"
              ></iframe>
            </div>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-32 right-16 hidden lg:block"
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
              <Rocket className="text-blue-400" size={48} />
            </div>
          </motion.div>
          
          <motion.div
            animate={{
              y: [20, -20, 20],
              rotate: [0, -10, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-32 left-16 hidden lg:block"
          >
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
              <Target className="text-purple-400" size={40} />
            </div>
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="mb-8 inline-block"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl">
                  <Sparkles className="text-blue-400" size={18} />
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Trusted by 50,000+ Creators
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={fadeInUp}
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.95] tracking-tight"
              >
                <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Grow
                </span>{' '}
                <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Smarter
                </span>
                <br />
                <span className="inline-block text-white/90">on Social Media</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
              >
                AI-powered analytics, content optimization, and planning —{' '}
                <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  all in one powerful platform
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                <button 
                  onClick={handleGetStarted}
                  className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-lg shadow-[0_0_60px_rgba(99,102,241,0.5)] hover:shadow-[0_0_100px_rgba(99,102,241,0.8)] transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {user ? 'Go to Dashboard' : 'Get Started Free'}
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={22} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </button>
                
                <button 
                  onClick={handleLogin}
                  className="group px-12 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play size={18} className="ml-0.5" />
                  </div>
                  {user ? 'Dashboard' : 'Login'}
                </button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
              >
                {[
                  { icon: CheckCircle2, text: 'No credit card required' },
                  { icon: Clock, text: '14-day free trial' },
                  { icon: Shield, text: 'Cancel anytime' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <item.icon className="text-green-400" size={18} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-7 h-12 border-2 border-white/20 rounded-full flex justify-center pt-2">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
              
              <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
                        <stat.icon className="text-blue-400" size={24} />
                      </div>
                      <h3 className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced Bento Grid */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-24"
            >
              <div className="inline-block px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <span className="text-blue-400 font-semibold text-sm">POWERFUL FEATURES</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                Everything You Need
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  In One Platform
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Powerful tools designed for modern creators who want to dominate social media
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onClick={() => handleNavigation(feature.link)}
                  className="group relative cursor-pointer"
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
                  
                  <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Particle effect */}
                    <motion.div 
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-6 right-6 text-5xl opacity-20 group-hover:opacity-40 transition-opacity"
                    >
                      {feature.particles}
                    </motion.div>

                    {/* Icon */}
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                        <feature.icon className="text-white" size={36} />
                      </div>
                      
                      {/* Stat badge */}
                      <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
                        <span className="text-xs text-gray-400 font-semibold">{feature.stats}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-3xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 mb-8 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-4 transition-all">
                      Explore feature
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview - Larger and More Impressive */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <div className="inline-block px-6 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                <span className="text-purple-400 font-semibold text-sm">COMMAND CENTER</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                Your Dashboard
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Track everything in one beautiful, intuitive interface designed for power users
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Mega glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[3rem] blur-[100px] opacity-30"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-3xl rounded-[2.5rem] p-2 border border-white/20 shadow-2xl">
                <div className="bg-black/40 rounded-[2rem] p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {[
                      { icon: TrendingUp, label: 'Growth', value: '+24.5%', subtext: 'This month', change: '+12.3%', color: 'from-blue-500 to-cyan-500' },
                      { icon: Users, label: 'Reach', value: '128.4K', subtext: 'Total audience', change: '+8.7K', color: 'from-purple-500 to-pink-500' },
                      { icon: Zap, label: 'Engagement', value: '8.2%', subtext: 'Average rate', change: '+1.4%', color: 'from-orange-500 to-red-500' }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 }}
                        whileHover={{ scale: 1.05, y: -8 }}
                        className="relative group cursor-pointer"
                      >
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                        
                        <div className={`relative bg-gradient-to-br ${stat.color} p-[1px] rounded-2xl`}>
                          <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-8 h-full">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                  <stat.icon className="text-white" size={24} />
                                </div>
                                <h4 className="font-bold text-white text-lg">{stat.label}</h4>
                              </div>
                              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                                <span className="text-green-400 text-xs font-bold">{stat.change}</span>
                              </div>
                            </div>
                            <p className="text-5xl font-black text-white mb-2">{stat.value}</p>
                            <p className="text-sm text-gray-400 font-medium">{stat.subtext}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={() => handleNavigation('/dashboard')}
                      className="group px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:shadow-[0_0_80px_rgba(99,102,241,0.8)] transform hover:scale-105 transition-all duration-300"
                    >
                      <span className="flex items-center gap-3">
                        Explore Dashboard
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Platforms - More Dynamic */}
        <section className="py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                  <span className="text-green-400 font-semibold text-sm">INTEGRATIONS</span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Connect All
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Your Accounts
                  </span>
                </h2>
                
                <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                  Manage Instagram, X (Twitter), LinkedIn, and more from one powerful dashboard. 
                  Sync once, manage forever.
                </p>
                
                <div className="space-y-5 mb-10">
                  {[
                    { icon: CheckCircle2, text: 'One-click social account integration', color: 'from-green-400 to-emerald-500' },
                    { icon: CheckCircle2, text: 'Real-time analytics tracking across platforms', color: 'from-blue-400 to-cyan-500' },
                    { icon: CheckCircle2, text: 'Unified audience growth metrics', color: 'from-purple-400 to-pink-500' },
                    { icon: CheckCircle2, text: 'Cross-platform content scheduling', color: 'from-orange-400 to-red-500' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className={`relative w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon size={18} className="text-white" />
                      </div>
                      <span className="text-gray-300 text-lg group-hover:text-white transition-colors">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={() => handleNavigation('/connect')}
                  className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.7)] transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    Connect Now
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                  </span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-6"
              >
                {[
                  { icon: Instagram, name: 'Instagram', followers: '42.3K', growth: '+2.4K', color: 'from-pink-500 via-rose-500 to-orange-500' },
                  { icon: Twitter, name: 'X (Twitter)', followers: '38.1K', growth: '+1.8K', color: 'from-blue-400 via-blue-500 to-cyan-500' },
                  { icon: Linkedin, name: 'LinkedIn', followers: '12.5K', growth: '+856', color: 'from-blue-600 via-blue-700 to-blue-900' },
                  { icon: Globe, name: 'Others', followers: '8.2K', growth: '+432', color: 'from-purple-500 via-purple-600 to-pink-600' }
                ].map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.08, rotate: 3, y: -10 }}
                    className="relative group cursor-pointer"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-br ${platform.color} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                    
                    <div className={`relative bg-gradient-to-br ${platform.color} rounded-3xl p-8 text-white shadow-2xl`}>
                      <platform.icon size={48} className="mb-6 group-hover:scale-110 transition-transform" />
                      <p className="text-sm opacity-90 mb-2 font-medium">{platform.name}</p>
                      <p className="text-4xl font-black mb-2">{platform.followers}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} />
                        <span className="text-xs font-semibold opacity-90">{platform.growth} this month</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials - Enhanced Design */}
        <section className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <div className="inline-block px-6 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
                <span className="text-yellow-400 font-semibold text-sm flex items-center gap-2">
                  <Star className="fill-yellow-400" size={16} />
                  TESTIMONIALS
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                Loved by Creators
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Worldwide
                </span>
              </h2>
              <p className="text-xl text-gray-400">
                Join thousands of satisfied users transforming their social media
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -12 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${testimonial.image} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full">
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-gray-200 mb-8 italic leading-relaxed text-lg">
                      "{testimonial.text}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.image} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/10`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{testimonial.author}</p>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="py-32 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[3rem] blur-[100px] opacity-20"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[2.5rem] p-2 border border-white/20">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-[2rem] p-12 md:p-16">
                  <div className="text-center mb-12">
                    <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-6">
                      <span className="text-blue-400 font-semibold text-sm">LIMITED TIME OFFER</span>
                    </div>
                    
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                      Start Your Free Trial
                    </h2>
                    
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                      Experience the full power of Postwise with our 14-day free trial. 
                      <span className="text-blue-400 font-semibold"> No credit card required.</span>
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {pricingFeatures.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 size={16} className="text-white" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button 
                      onClick={handleGetStarted}
                      className="group relative px-12 py-6 bg-white text-black rounded-2xl font-bold text-lg shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:shadow-[0_0_100px_rgba(255,255,255,0.5)] transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {user ? 'Go to Dashboard' : 'Start Free Trial'}
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigation('/pricing')}
                      className="px-12 py-6 bg-white/5 backdrop-blur-md border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                    >
                      View Pricing
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Animated gradient border */}
              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-blue-600 rounded-[3rem] blur-3xl opacity-40"
              ></motion.div>
              
              <div className="relative bg-gradient-to-br from-blue-900/60 to-purple-900/60 backdrop-blur-3xl rounded-[2.5rem] p-16 md:p-24 border border-white/20 text-center overflow-hidden">
                {/* Animated background orbs */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
                ></motion.div>
                
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [360, 180, 0],
                    opacity: [0.1, 0.15, 0.1]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
                ></motion.div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 rounded-full mb-8">
                      <Award className="text-yellow-400" size={20} />
                      <span className="text-sm font-semibold">Rated 4.9/5 by 10,000+ users</span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight"
                  >
                    Ready to Transform
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Your Social Game?
                    </span>
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                  >
                    Join 50,000+ creators who trust Postwise to grow their social media presence
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                  >
                    <button 
                      onClick={handleGetStarted}
                      className="group relative px-12 py-6 bg-white text-black rounded-2xl font-bold text-lg shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:shadow-[0_0_100px_rgba(255,255,255,0.6)] transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {user ? 'Go to Dashboard' : 'Get Started Now'}
                        <Sparkles size={20} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigation('/demo')}
                      className="group px-12 py-6 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex items-center gap-3"
                    >
                      <Play size={20} />
                      Watch Demo
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer - Premium Design */}
        <footer className="relative border-t border-white/10 bg-black/80 backdrop-blur-xl py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-5 gap-12 mb-16">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-black mb-4">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Postwise
                  </span>
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  AI-powered social media management for modern creators. Grow smarter, not harder.
                </p>
                <div className="flex gap-4">
                  {[Instagram, Twitter, Linkedin, Globe].map((Icon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
              
              {[
                { title: 'Product', links: [
                  { name: 'Features', path: '/features' },
                  { name: 'Pricing', path: '/pricing' },
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'Analytics', path: '/overview' },
                  { name: 'Integrations', path: '/connect' }
                ]},
                { title: 'Company', links: [
                  { name: 'About', path: '/about' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Careers', path: '/careers' },
                  { name: 'Press', path: '/press' },
                  { name: 'Contact', path: '/contact' }
                ]},
                { title: 'Legal', links: [
                  { name: 'Privacy', path: '/privacy' },
                  { name: 'Terms', path: '/terms' },
                  { name: 'Security', path: '/security' },
                  { name: 'Cookies', path: '/cookies' },
                  { name: 'Licenses', path: '/licenses' }
                ]}
              ].map((column, index) => (
                <div key={index}>
                  <h4 className="text-white font-bold mb-6 text-lg">{column.title}</h4>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <button 
                          onClick={() => handleNavigation(link.path)}
                          className="text-gray-400 hover:text-white transition-colors text-sm block hover:translate-x-1 transition-transform"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-sm">
                © 2025 Postwise. Built with ❤️ by <span className="text-white font-semibold">Anshit Puri</span>
              </p>
              <div className="flex gap-8 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Status</a>
                <a href="#" className="hover:text-white transition-colors">Changelog</a>
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;