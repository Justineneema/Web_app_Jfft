import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function FeatureCard({ icon, title, description, features, isPremium = false }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`card-surface p-8 rounded-2xl ${isPremium ? 'border-2 border-emerald-500/50 relative' : 'hover:border-emerald-500/30'} transition-all duration-300`}
    >
      {isPremium && (
        <div className="absolute -top-3 left-6">
          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            PREMIUM
          </span>
        </div>
      )}
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-neutral-400 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-emerald-400 text-lg mt-1">✓</span>
            <span className="text-neutral-300">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Features() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Header */}
      <section className="container-page py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Powerful Features for Master Typists
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Everything you need to improve your typing speed, accuracy, and technique with advanced tools and analytics.
          </p>
        </motion.div>
      </section>

      {/* Core Features */}
      <section className="container-page py-20">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="⌨️"
              title="Adaptive Learning Engine"
              description="AI-powered lessons that adjust difficulty based on your performance"
              features={[
                'Smart difficulty progression',
                'Personalized learning paths',
                'Real-time performance tracking',
                'Custom exercise generation'
              ]}
            />
            <FeatureCard
              icon="📊"
              title="Performance Analytics"
              description="Comprehensive metrics to understand your typing patterns"
              features={[
                'Words per minute (WPM) tracking',
                'Accuracy percentage analysis',
                'Error distribution heatmaps',
                'Progress trending over time',
                'Detailed session reports'
              ]}
            />
            <FeatureCard
              icon="🎯"
              title="Error Pattern Analysis"
              description="Identify and target your specific typing weaknesses"
              features={[
                'Common mistake visualization',
                'Error frequency breakdown',
                'Key-by-key analysis',
                'Targeted practice sessions',
                'Improvement recommendations'
              ]}
            />
            <FeatureCard
              icon="🏃"
              title="Technique Optimization"
              description="Master proper typing techniques and ergonomics"
              features={[
                'Finger placement guidance',
                'Proper hand positioning tips',
                'Posture recommendations',
                'Fatigue prevention strategies',
                'Professional typing standards'
              ]}
            />
            <FeatureCard
              icon="🏆"
              title="Achievements & Milestones"
              description="Celebrate your progress with unlockable achievements"
              features={[
                'Speed milestones',
                'Accuracy badges',
                'Streak tracking',
                'Leaderboard rankings',
                'Custom challenges'
              ]}
            />
            <FeatureCard
              icon="⚙️"
              title="Customizable Exercises"
              description="Tailor your practice sessions to your needs"
              features={[
                'Multiple test durations',
                'Different text types',
                'Difficulty levels',
                'Focus areas selection',
                'Keyboard layout options'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="container-page py-20 bg-neutral-900/50 rounded-2xl">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Premium Features</h2>
          <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
            Unlock advanced capabilities with our Pro subscription
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            <FeatureCard
              icon="🎤"
              title="Voice Typing Suite"
              description="Advanced speech-to-text with professional features"
              features={[
                'Real-time speech recognition',
                'Pronunciation feedback',
                'Professional vocabulary support',
                'Multiple language support',
                'Accent adaptation',
                'Dictation mode for professionals'
              ]}
              isPremium={true}
            />
            <FeatureCard
              icon="📜"
              title="Professional Certification"
              description="Get recognized credentials for your typing skills"
              features={[
                'Industry-recognized certificates',
                'Verified skill assessments',
                'Digital credential sharing',
                'LinkedIn integration',
                'Employer verification',
                'Multiple certification levels'
              ]}
              isPremium={true}
            />
            <FeatureCard
              icon="🎓"
              title="Advanced Training Modules"
              description="Specialized training for different professions"
              features={[
                'Programming-specific typing',
                'Legal document formatting',
                'Medical terminology practice',
                'Creative writing optimization',
                'Data entry specialization',
                'Executive assistant training'
              ]}
              isPremium={true}
            />
            <FeatureCard
              icon="📈"
              title="Advanced Analytics Dashboard"
              description="Deep dive into your typing performance metrics"
              features={[
                'Comparative performance analysis',
                'Custom date range filtering',
                'Export reports to PDF/CSV',
                'Predictive performance trends',
                'Peer benchmarking',
                'Long-term progress visualization'
              ]}
              isPremium={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-page py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Typing Skills?
          </h2>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Choose your plan and start practicing today. All plans include a free tier to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/pricing" 
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              View Pricing Plans
            </Link>
            <Link 
              to="/typing" 
              className="border-2 border-neutral-600 hover:border-emerald-500 bg-neutral-900/50 hover:bg-emerald-500/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              Try Free Practice
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
