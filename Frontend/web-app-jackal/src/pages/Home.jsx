import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import PremiumUpsell from '../components/PremiumUpsell'

function FeatureCard({ title, desc, icon, isPremium = false }) {
  return (
    <div className="card-surface p-6 hover:border-emerald-500/30 transition-all duration-300 group hover:transform hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">{title}</h3>
            {isPremium && (
              <span className="premium-badge bg-gradient-to-r from-yellow-500 to-yellow-700 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
            {desc}
          </p>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ name, role, text, avatar }) {
  return (
    <div className="card-surface p-6 hover:border-emerald-500/30 transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-4">
        <img 
          className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500/50 group-hover:border-emerald-500 transition-colors duration-300" 
          src={avatar} 
          alt={`${name} avatar`}
        />
        <div className="flex-1">
          <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">{name}</div>
          <div className="text-xs text-emerald-400">{role}</div>
          <div className="flex text-yellow-400 text-sm mt-1">★★★★★</div>
        </div>
      </div>
      <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
        "{text}"
      </p>
    </div>
  )
}

// Professional Keyboard Visualization Component
function ProfessionalKeyboard() {
  const { isPremium } = useAuth()
  
  const handleVoiceTypingClick = () => {
    if (!isPremium) {
      return <PremiumUpsell 
        featureName="Voice Typing"
        description="Upgrade to Premium to access advanced voice typing features with real-time speech recognition and pronunciation analysis."
      />
    }
    // If premium, proceed to voice typing
    window.location.href = '/voice'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 shadow-2xl border border-neutral-700">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-3">Typing Interface</h3>
          <p className="text-neutral-400 text-lg">Explore our advanced typing platform</p>
        </div>

        {/* Keyboard Visualization */}
        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 mb-8">
          {/* Top Row */}
          <div className="flex justify-center gap-2 mb-4">
            {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'].map((key) => (
              <div
                key={key}
                className="w-14 h-14 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center text-neutral-300 font-mono text-sm font-bold hover:bg-neutral-600 transition-colors cursor-default"
              >
                {key}
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex justify-center gap-2 mb-4">
            {['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'].map((key) => (
              <div
                key={key}
                className={`h-14 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center text-neutral-300 font-mono text-sm font-bold hover:bg-neutral-600 transition-colors cursor-default ${
                  key === 'Tab' || key === '\\' ? 'w-20' : 'w-14'
                }`}
              >
                {key}
              </div>
            ))}
          </div>

          {/* Third Row */}
          <div className="flex justify-center gap-2 mb-4">
            {['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'].map((key) => (
              <div
                key={key}
                className={`h-14 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center text-neutral-300 font-mono text-sm font-bold hover:bg-neutral-600 transition-colors cursor-default ${
                  key === 'Caps' || key === 'Enter' ? 'w-24' : 'w-14'
                }`}
              >
                {key}
              </div>
            ))}
          </div>

          {/* Fourth Row */}
          <div className="flex justify-center gap-2 mb-4">
            {['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'].map((key) => (
              <div
                key={key}
                className={`h-14 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center text-neutral-300 font-mono text-sm font-bold hover:bg-neutral-600 transition-colors cursor-default ${
                  key === 'Shift' ? 'w-28' : 'w-14'
                }`}
              >
                {key}
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex justify-center gap-2">
            {['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl'].map((key) => (
              <div
                key={key}
                className={`h-14 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center text-neutral-300 font-mono text-sm font-bold hover:bg-neutral-600 transition-colors cursor-default ${
                  key === 'Space' ? 'w-64' : 'w-16'
                }`}
              >
                {key}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/typing"
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Typing Practice
          </Link>
          
          <button
            onClick={handleVoiceTypingClick}
            className={`py-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 ${
              isPremium 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg'
            }`}
          >
            {isPremium ? 'Voice Typing' : 'Voice Typing (Premium)'}
          </button>
          
          <Link 
            to="/certification"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Certified
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { isPremium } = useAuth()
  const [pricing, setPricing] = useState({ free: 0, pro: 8, team: 20 })
  const [typingStats, setTypingStats] = useState({ wpm: 0, accuracy: 0, users: 0 })

  useEffect(() => {
    // Simulate API calls
    fetch('/api/get-pricing')
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(() => {})

    // Animated counter for stats
    const animateCounter = (target, setter, duration = 2000) => {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(start))
        }
      }, 16)
    }

    animateCounter(78, (val) => setTypingStats(prev => ({...prev, wpm: val})))
    animateCounter(98, (val) => setTypingStats(prev => ({...prev, accuracy: val})))
    animateCounter(12500, (val) => setTypingStats(prev => ({...prev, users: val})))
  }, [])

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Enhanced Hero Section */}
      <section className="container-page py-12 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Master Typing with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Jackal Teck
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl lg:text-2xl text-neutral-400 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Transform your typing skills with AI-powered lessons, real-time feedback, and professional certification. 
            Join <span className="text-blue-400 font-semibold">{typingStats.users.toLocaleString()}+ users</span> worldwide.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <Link 
              to="/typing" 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25"
            >
              Start Free Practice
            </Link>
            <Link 
              to="/signup" 
              className="border-2 border-neutral-600 hover:border-emerald-500 bg-neutral-900/50 hover:bg-emerald-500/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              Create Account
            </Link>
          </motion.div>

          {/* Professional Keyboard Component */}
          <ProfessionalKeyboard />

          {/* Enhanced Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 card-surface p-8 max-w-4xl mx-auto border border-neutral-700 hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">{typingStats.wpm}+</div>
                <div className="text-neutral-400">Words Per Minute</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{typingStats.accuracy}%</div>
                <div className="text-neutral-400">Average Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">2.5x</div>
                <div className="text-neutral-400">Faster Learning</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{typingStats.users.toLocaleString()}+</div>
                <div className="text-neutral-400">Active Users</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Professional Features Section */}
<section className="py-20 bg-neutral-900/50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
        Advanced Typing Platform
      </h2>
      <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
        Enterprise-grade tools designed to accelerate your typing proficiency with data-driven insights
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700 hover:border-emerald-500 transition-all duration-300">
        <h3 className="text-xl font-bold text-white mb-4">Adaptive Learning Engine</h3>
        <p className="text-neutral-400 leading-relaxed">
          AI-powered lessons that dynamically adjust difficulty based on your typing patterns, error frequency, and progress metrics for optimal skill development.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700 hover:border-blue-500 transition-all duration-300">
        <h3 className="text-xl font-bold text-white mb-4">Performance Analytics</h3>
        <p className="text-neutral-400 leading-relaxed">
          Comprehensive real-time tracking of WPM, accuracy rates, error distribution, and progress trends with actionable insights for improvement.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700 hover:border-purple-500 transition-all duration-300">
        <h3 className="text-xl font-bold text-white mb-4">Error Pattern Analysis</h3>
        <p className="text-neutral-400 leading-relaxed">
          Visual heatmaps and detailed breakdowns of common mistakes to identify and target specific areas needing improvement.
        </p>
      </div>

      {/* Feature 4 */}
      <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700 hover:border-yellow-500 transition-all duration-300">
        <h3 className="text-xl font-bold text-white mb-4">Technique Optimization</h3>
        <p className="text-neutral-400 leading-relaxed">
          Finger placement guidance and ergonomic recommendations to build proper muscle memory and prevent fatigue during extended typing sessions.
        </p>
      </div>

      {/* Feature 5 - Premium */}
      <div className="bg-neutral-800/50 rounded-2xl p-8 border-2 border-emerald-500/50 relative">
        <div className="absolute -top-3 left-6">
          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            PREMIUM
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-4">Voice Typing Suite</h3>
        <p className="text-neutral-400 leading-relaxed mb-4">
          Advanced speech-to-text with real-time transcription, pronunciation analysis, and professional dictation features.
        </p>
        <ul className="text-sm text-neutral-500 space-y-1">
          <li>• Real-time speech recognition</li>
          <li>• Pronunciation feedback</li>
          <li>• Professional vocabulary</li>
        </ul>
      </div>

      {/* Feature 6 - Premium */}
      <div className="bg-neutral-800/50 rounded-2xl p-8 border-2 border-purple-500/50 relative">
        <div className="absolute -top-3 left-6">
          <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            PREMIUM
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-4">Professional Certification</h3>
        <p className="text-neutral-400 leading-relaxed mb-4">
          Industry-recognized certificates validating your typing proficiency for career advancement and professional credibility.
        </p>
        <ul className="text-sm text-neutral-500 space-y-1">
          <li>• Verified skill assessment</li>
          <li>• Digital credentials</li>
          <li>• Employer recognition</li>
        </ul>
      </div>
    </div>
  </div>
</section>

{/* Success Stories Section */}
<section className="py-20 bg-neutral-950">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
        Success Stories
      </h2>
      <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
        Join professionals worldwide who have transformed their productivity and career prospects
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {/* Testimonial 1 */}
      <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h4 className="text-white font-bold text-lg">Sarah Johnson</h4>
            <p className="text-emerald-400 text-sm">Senior Developer</p>
            <p className="text-neutral-500 text-sm">TechCorp Inc.</p>
          </div>
        </div>
        <div className="text-neutral-300 leading-relaxed mb-4">
          "Increased my typing speed from 45 to 85 WPM in just 3 months. The adaptive learning system identified my weak spots and created personalized exercises that actually worked."
        </div>
      </div>

      {/* Testimonial 2 */}
      <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h4 className="text-white font-bold text-lg">Michael Chen</h4>
            <p className="text-blue-400 text-sm">Data Analyst</p>
            <p className="text-neutral-500 text-sm">DataFlow Systems</p>
          </div>
        </div>
        <div className="text-neutral-300 leading-relaxed mb-4">
          "The error heatmap feature was a game-changer. I eliminated persistent mistakes I didn't even know I had. Now I handle data documentation 40% faster with better accuracy."
        </div>
      </div>

      {/* Testimonial 3 */}
      <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h4 className="text-white font-bold text-lg">Emily Rodriguez</h4>
            <p className="text-purple-400 text-sm">CS Student</p>
            <p className="text-neutral-500 text-sm">Stanford University</p>
          </div>
        </div>
        <div className="text-neutral-300 leading-relaxed mb-4">
          "As a computer science student, efficient coding and documentation are crucial. This platform helped me go from struggling to the top of my class in technical writing speed."
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Enhanced Pricing Section */}
      <section id="pricing" className="container-page py-20 bg-neutral-900/30">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h2>
          <motion.p 
            className="text-xl text-neutral-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Start free and upgrade as you grow. No credit card required to start.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            className="card-surface p-8 text-center hover:border-emerald-500/30 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
            <p className="text-neutral-400 mb-6">Perfect for beginners</p>
            <div className="text-4xl font-bold text-white mb-6">${pricing.free}</div>
            <ul className="space-y-4 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Basic Typing Lessons
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Limited Daily Challenges
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Keyboard Heatmap (Basic)
              </li>
              <li className="flex items-center gap-3 text-neutral-500">
                <span className="text-lg">✗</span> Voice Typing
              </li>
              <li className="flex items-center gap-3 text-neutral-500">
                <span className="text-lg">✗</span> Professional Certification
              </li>
            </ul>
            <Link to="/signup" className="btn-secondary w-full py-4 text-lg font-semibold">Get Started Free</Link>
          </motion.div>

          {/* Pro Plan - Highlighted */}
          <motion.div 
            className="card-surface p-8 text-center border-2 border-emerald-500 relative bg-gradient-to-b from-emerald-500/10 to-transparent"
            whileHover={{ y: -5 }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm px-6 py-2 rounded-full font-bold shadow-lg">
                MOST POPULAR
              </span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Pro Plan</h3>
            <p className="text-neutral-400 mb-6">For serious learners</p>
            <div className="text-4xl font-bold text-white mb-2">${pricing.pro}</div>
            <div className="text-sm text-neutral-400 mb-6">per month</div>
            <ul className="space-y-4 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Everything in Free
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Unlimited Lessons
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Full Heatmap Insights
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Finger Training Mode
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Voice Typing
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Professional Certification
              </li>
            </ul>
            <Link to="/signup" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 block">
              Go Pro - Start Free Trial
            </Link>
          </motion.div>

          {/* Team Plan */}
          <motion.div 
            className="card-surface p-8 text-center hover:border-blue-500/30 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Team Plan</h3>
            <p className="text-neutral-400 mb-6">Schools & organizations</p>
            <div className="text-4xl font-bold text-white mb-2">${pricing.team}</div>
            <div className="text-sm text-neutral-400 mb-6">per month</div>
            <ul className="space-y-4 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Everything in Pro
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Manage Up to 50 Users
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Team Analytics Dashboard
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Customized Exercises
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Priority Support
              </li>
            </ul>
            <Link to="/signup" className="btn-secondary w-full py-4 text-lg font-semibold">Contact Sales</Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container-page py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Typing?
          </h2>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have improved their typing speed, accuracy, and career prospects with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Start Your Journey Today
            </Link>
            <Link 
              to="/typing" 
              className="border-2 border-neutral-600 hover:border-emerald-500 bg-neutral-900/50 hover:bg-emerald-500/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              Try Practice Session
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}