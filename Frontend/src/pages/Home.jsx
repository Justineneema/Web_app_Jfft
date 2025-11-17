import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded bg-neutral-700/70 grid place-items-center">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-neutral-400">{desc}</p>
    </div>
  )
}

function TestimonialCard() {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-3 mb-2">
        <img className="h-8 w-8 rounded-full object-cover" src="https://i.pravatar.cc/40" alt="avatar" />
        <div className="text-sm">
          <div className="font-semibold text-white">Justine Neema</div>
          <div className="text-xs text-neutral-400">★★★★★</div>
        </div>
      </div>
      <p className="text-sm text-neutral-400">The best typing app I've ever used! My speed and accuracy have improved significantly.</p>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="container-page py-14 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Master Typing with Fun and
            <br className="hidden sm:block" /> Engaging Lessons
          </h1>
          <p className="mt-4 text-neutral-400">
            Improve your typing skills with tailored practices, voice typing, and more.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/typing" className="btn-primary">Start Typing</Link>
            <a href="#learn" className="btn-secondary">Learn More</a>
          </div>
        </div>

        <div className="mt-10 card-surface p-6 text-neutral-300 max-w-4xl mx-auto">
          <p className="text-sm sm:text-base text-neutral-300">
          JackalTech Typing Platform is an interactive web app designed to improve users’ typing speed and accuracy through real-time practice sessions. It tracks performance metrics like WPM, errors, and progress. The platform includes leaderboards for friendly competition and a clean, user-friendly interface built with modern web technologies.

          </p>
        </div>

        <div className="mt-10 grid place-items-center">
          <div className="w-full max-w-4xl rounded border border-neutral-700 bg-neutral-800 p-6">
            <div className="text-center text-neutral-400 mb-6 text-lg font-semibold">Color-Coded Keyboard Layout</div>
            
            {/* Keyboard Container */}
            <div className="bg-neutral-900 rounded-lg p-4 shadow-2xl">
              {/* Top Row */}
              <div className="flex justify-center gap-1 mb-1">
                {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map((key, i) => (
                  <div key={i} className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold ${
                    ['`', '1', '0', '-', '='].includes(key) ? 'bg-green-400' :
                    ['2', '3', '4', '8', '9'].includes(key) ? 'bg-yellow-400' :
                    key === '5' ? 'bg-teal-400' : 'bg-pink-400'
                  } text-gray-900 shadow-md`}>
                    {key}
                  </div>
                ))}
                <div className="w-16 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md ml-2">
                  ⌫
                </div>
              </div>

              {/* QWERTY Row */}
              <div className="flex justify-center gap-1 mb-1">
                <div className="w-12 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                  ⇥
                </div>
                {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key, i) => (
                  <div key={i} className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold ${
                    ['Q', 'W', 'P'].includes(key) ? 'bg-green-400' :
                    ['E', 'R', 'I', 'O'].includes(key) ? 'bg-yellow-400' :
                    key === 'T' ? 'bg-teal-400' : 'bg-pink-400'
                  } text-gray-900 shadow-md`}>
                    {key}
                  </div>
                ))}
                {['[', ']', '\\'].map((key, i) => (
                  <div key={i} className="w-10 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                    {key}
                  </div>
                ))}
              </div>

              {/* ASDF Row */}
              <div className="flex justify-center gap-1 mb-1">
                <div className="w-14 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                  ⇪
                </div>
                {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key, i) => (
                  <div key={i} className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold ${
                    ['A', 'L'].includes(key) ? 'bg-green-400' :
                    ['S', 'D', 'K'].includes(key) ? 'bg-yellow-400' :
                    ['F', 'G'].includes(key) ? 'bg-teal-400' : 'bg-pink-400'
                  } text-gray-900 shadow-md`}>
                    {key}
                  </div>
                ))}
                {[';', "'"].map((key, i) => (
                  <div key={i} className="w-10 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                    {key}
                  </div>
                ))}
                <div className="w-16 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md ml-2">
                  ↵
                </div>
              </div>

              {/* ZXCV Row */}
              <div className="flex justify-center gap-1 mb-1">
                <div className="w-16 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                  ⇧
                </div>
                {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key, i) => (
                  <div key={i} className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold ${
                    key === 'Z' ? 'bg-green-400' :
                    ['X', 'C'].includes(key) ? 'bg-yellow-400' :
                    ['V', 'B'].includes(key) ? 'bg-teal-400' : 'bg-pink-400'
                  } text-gray-900 shadow-md`}>
                    {key}
                  </div>
                ))}
                {[',', '.', '/'].map((key, i) => (
                  <div key={i} className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold ${
                    key === '/' ? 'bg-green-400' : 'bg-yellow-400'
                  } text-gray-900 shadow-md`}>
                    {key}
                  </div>
                ))}
                <div className="w-20 h-10 rounded-md bg-green-400 flex items-center justify-center text-sm font-bold text-gray-900 shadow-md ml-2">
                  ⇧
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex justify-center gap-1">
                {['Ctrl', 'Win', 'Alt'].map((key, i) => (
                  <div key={i} className="w-12 h-10 rounded-md bg-green-400 flex items-center justify-center text-xs font-bold text-gray-900 shadow-md">
                    {key}
                  </div>
                ))}
                <div className="w-32 h-10 rounded-md bg-red-500 flex items-center justify-center text-sm font-bold text-white shadow-md mx-2">
                  Space
                </div>
                {['Alt', 'Win', 'Del', 'Ctrl'].map((key, i) => (
                  <div key={i} className="w-12 h-10 rounded-md bg-green-400 flex items-center justify-center text-xs font-bold text-gray-900 shadow-md">
                    {key}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span className="text-neutral-300">Pinky Finger</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-neutral-300">Ring Finger</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-400 rounded"></div>
                <span className="text-neutral-300">Middle Finger</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-400 rounded"></div>
                <span className="text-neutral-300">Index Finger</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-page py-16">
        <h2 className="text-3xl font-bold text-center text-white">Why Choose Our Typing App?</h2>
        <p className="text-center text-neutral-400 mt-2">Experience the difference with our innovative features.</p>
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <FeatureCard title="Varied Typing Texts" desc="Engage with a wide range of texts to keep your practice diverse and interesting." icon={<span>📝</span>} />
          <FeatureCard title="Real-Time Feedback" desc="Receive instant feedback on your typing to improve your speed and accuracy." icon={<span>⚡</span>} />
          <FeatureCard title="Progress Tracking" desc="Monitor your progress over time and stay motivated with detailed stats." icon={<span>⏱️</span>} />
          <FeatureCard title="Voice Typing Feature" desc="Practice pronunciation with real-time feedback and improvement suggestions." icon={<span>🎤</span>} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-16">
        <h2 className="text-3xl font-bold text-center text-white">What Our Users Say?</h2>
        <p className="text-center text-neutral-400 mt-2">Hear from satisfied users who have improved their typing skills.</p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <TestimonialCard key={i} />
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-page py-16">
        <h2 className="text-3xl font-bold text-center text-white">Pricing Plans</h2>
        <p className="text-center text-neutral-400 mt-2">Become A Typing Master with Us</p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-sm border border-neutral-800">
            <thead className="bg-neutral-800/70">
              <tr>
                <th className="text-left p-4">Compare plans</th>
                <th className="p-4 text-center font-semibold text-white">Free</th>
                <th className="p-4 text-center font-semibold text-white">$8</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Varied Typing Texts',
                'Free Typing Mode',
                'Practice Typing Mode',
                'Progress Tracking',
                'Organization Account Management',
                'Certifications',
                'Voice Practice Feature',
                'Email Support',
                'Analytics and reporting',
              ].map((label) => (
                <tr key={label} className="border-t border-neutral-800">
                  <td className="p-4">{label}</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}


