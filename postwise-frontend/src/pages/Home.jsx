import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const features = [
    {
      icon: BarChart3,
      title: 'Analyze',
      description: 'Get deep insights from your posts and engagement metrics. Understand what works.',
      link: '/analyze',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Wand2,
      title: 'Improve',
      description: 'Use AI to enhance your captions and visuals. Create content that converts.',
      link: '/improve',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Plan',
      description: 'Schedule and manage your content calendar. Stay consistent effortlessly.',
      link: '/plan',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      text: "Postwise helped me grow engagement by 40% in a week!",
      author: "@creatorpro",
      avatar: "CP"
    },
    {
      text: "Finally, a tool that actually understands social media growth.",
      author: "@digitalmarketer",
      avatar: "DM"
    },
    {
      text: "The AI recommendations are spot-on. My content has never been better.",
      author: "@contentqueen",
      avatar: "CQ"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70"></div>
        
        {/* Floating Elements */}
        <motion.div 
          animate={floatingAnimation}
          className="absolute top-20 right-10 text-blue-500 opacity-20"
        >
          <TrendingUp size={80} />
        </motion.div>
        <motion.div 
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
          className="absolute bottom-20 left-10 text-purple-500 opacity-20"
        >
          <Sparkles size={60} />
        </motion.div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Grow Smarter on Social Media <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                with Postwise 🚀
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            AI-powered analytics, content optimization, and planning — all in one place.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-white text-gray-800 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              {user ? 'Go to Dashboard' : 'Login'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools designed for modern creators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleNavigation(feature.link)}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <button className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Track Everything in One Place
            </h2>
            <p className="text-xl text-gray-600">
              Your command center for social media success
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-blue-600" size={24} />
                  <h4 className="font-semibold text-gray-900">Growth</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">+24.5%</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-purple-600" size={24} />
                  <h4 className="font-semibold text-gray-900">Reach</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">128.4K</p>
                <p className="text-sm text-gray-600">Total audience</p>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="text-pink-600" size={24} />
                  <h4 className="font-semibold text-gray-900">Engagement</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">8.2%</p>
                <p className="text-sm text-gray-600">Average rate</p>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                View Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Connect & Analytics Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Connect All Your Accounts
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Manage Instagram, X (Twitter), LinkedIn, and more from one powerful dashboard.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={24} />
                  <span className="text-gray-700">Social account integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={24} />
                  <span className="text-gray-700">Real-time analytics tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={24} />
                  <span className="text-gray-700">Audience growth metrics</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleNavigation('/connect')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Connect Accounts
                </button>
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                >
                  View Analytics
                </button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
                <Instagram size={32} className="mb-4" />
                <p className="text-sm opacity-90">Instagram</p>
                <p className="text-2xl font-bold">42.3K</p>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <Twitter size={32} className="mb-4" />
                <p className="text-sm opacity-90">X (Twitter)</p>
                <p className="text-2xl font-bold">38.1K</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
                <Linkedin size={32} className="mb-4" />
                <p className="text-sm opacity-90">LinkedIn</p>
                <p className="text-2xl font-bold">12.5K</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                <Globe size={32} className="mb-4" />
                <p className="text-sm opacity-90">Others</p>
                <p className="text-2xl font-bold">8.2K</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Site Overview Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Total Control at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              The Postwise Dashboard gives you complete visibility into your social media performance.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <BarChart3 className="text-blue-600 mx-auto mb-3" size={32} />
                <h4 className="font-semibold text-gray-900 mb-2">Monitor Performance</h4>
                <p className="text-sm text-gray-600">Track all metrics in real-time</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Users className="text-purple-600 mx-auto mb-3" size={32} />
                <h4 className="font-semibold text-gray-900 mb-2">Compare Platforms</h4>
                <p className="text-sm text-gray-600">See what works where</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <TrendingUp className="text-pink-600 mx-auto mb-3" size={32} />
                <h4 className="font-semibold text-gray-900 mb-2">Weekly Summaries</h4>
                <p className="text-sm text-gray-600">Get actionable insights</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigation('/overview')}
              className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              View Site Overview
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Automating Your Social Media Growth Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of creators who trust Postwise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {user ? 'Go to Dashboard' : 'Join Now'}
              </button>
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Explore Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Postwise</h3>
              <p className="text-sm">AI-powered social media management</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleNavigation('/')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => handleNavigation('/dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><button onClick={() => handleNavigation('/overview')} className="hover:text-white transition-colors">Analytics</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleNavigation('/analyze')} className="hover:text-white transition-colors">Analyze</button></li>
                <li><button onClick={() => handleNavigation('/improve')} className="hover:text-white transition-colors">Improve</button></li>
                <li><button onClick={() => handleNavigation('/plan')} className="hover:text-white transition-colors">Plan</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Postwise. Built with ❤️ using React + Firebase</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;