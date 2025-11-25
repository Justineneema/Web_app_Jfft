// src/components/PremiumUpsell.jsx - NEW FILE
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PremiumUpsell = ({ featureName, description }) => {
  const { upgradeToPremium } = useAuth()

  const premiumFeatures = [
    'Advanced voice typing with pronunciation analysis',
    'Professional typing certifications',
    'Unlimited practice exercises',
    'Detailed progress analytics',
    'Priority customer support',
    'Ad-free experience'
  ]

  const handleUpgrade = () => {
    upgradeToPremium()
    alert('Redirecting to premium upgrade...')
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="card-surface p-8 text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⭐</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Unlock {featureName} with Premium
          </h2>
          
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {description || 'Upgrade to Premium to access advanced features and take your typing skills to the next level.'}
          </p>

          {/* Premium Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-left p-3 bg-neutral-800/50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-neutral-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-8">
            <div className="card-surface p-6 border-2 border-yellow-500/30">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-white mb-4">
                $8<span className="text-lg text-neutral-400">/month</span>
              </div>
              <ul className="space-y-2 text-sm text-neutral-300 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> All premium features included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Cancel anytime
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 7-day free trial
                </li>
              </ul>
              <button 
                onClick={handleUpgrade}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors mb-3"
              >
                Start Free Trial
              </button>
              <p className="text-xs text-neutral-500">
                No credit card required for free trial
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-neutral-400 mb-4">
              Already have Premium? <Link to="/signin" className="text-yellow-400 hover:text-yellow-300 font-semibold">Sign in</Link>
            </p>
            <div className="flex justify-center gap-6 text-sm text-neutral-500">
              <span>🔒 Secure payment</span>
              <span>💬 24/7 support</span>
              <span>↩️ 30-day refund</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="card-surface p-6 text-center">
            <div className="text-yellow-400 text-2xl mb-2">★★★★★</div>
            <p className="text-neutral-300 text-sm mb-3">
              "The voice typing feature alone is worth the upgrade. Game changer!"
            </p>
            <div className="text-xs text-neutral-500">- Sarah, Developer</div>
          </div>
          <div className="card-surface p-6 text-center">
            <div className="text-yellow-400 text-2xl mb-2">★★★★★</div>
            <p className="text-neutral-300 text-sm mb-3">
              "Certifications helped me land my current job. Highly recommended!"
            </p>
            <div className="text-xs text-neutral-500">- Mike, Data Analyst</div>
          </div>
          <div className="card-surface p-6 text-center">
            <div className="text-yellow-400 text-2xl mb-2">★★★★★</div>
            <p className="text-neutral-300 text-sm mb-3">
              "The analytics are incredibly detailed. Perfect for tracking progress."
            </p>
            <div className="text-xs text-neutral-500">- Emily, Student</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumUpsell