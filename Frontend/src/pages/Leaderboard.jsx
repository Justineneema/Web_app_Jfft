// src/pages/Leaderboard.jsx
import { useAuth } from '../context/AuthContext'

export default function Leaderboard() {
  const { user } = useAuth()

  // Mock data for school leaderboard
  const schoolData = [
    { rank: 1, name: 'Tech Valley High', avgWpm: 72, students: 450, improvement: '+12%' },
    { rank: 2, name: 'Digital Academy', avgWpm: 68, students: 320, improvement: '+8%' },
    { rank: 3, name: 'Future Skills Institute', avgWpm: 65, students: 280, improvement: '+15%' },
    { rank: 4, name: 'Innovation High', avgWpm: 63, students: 390, improvement: '+5%' },
    { rank: 5, name: 'STEM Preparatory', avgWpm: 60, students: 210, improvement: '+18%' },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">School Performance Leaderboard</h1>
          <p className="text-neutral-400">
            Welcome, {user?.name || 'Manager'}! Monitor school typing performance metrics.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
            <div className="text-2xl font-bold text-emerald-400">5</div>
            <div className="text-sm text-neutral-400">Schools</div>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
            <div className="text-2xl font-bold text-blue-400">1,650</div>
            <div className="text-sm text-neutral-400">Total Students</div>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
            <div className="text-2xl font-bold text-purple-400">65</div>
            <div className="text-sm text-neutral-400">Avg WPM</div>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
            <div className="text-2xl font-bold text-yellow-400">+12%</div>
            <div className="text-sm text-neutral-400">Avg Improvement</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">School Rankings</h2>
            <div className="text-sm text-neutral-400">Updated today</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3 px-4 text-neutral-400 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-neutral-400 font-semibold">School Name</th>
                  <th className="text-right py-3 px-4 text-neutral-400 font-semibold">Avg WPM</th>
                  <th className="text-right py-3 px-4 text-neutral-400 font-semibold">Students</th>
                  <th className="text-right py-3 px-4 text-neutral-400 font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {schoolData.map((school) => (
                  <tr key={school.rank} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        school.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        school.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                        school.rank === 3 ? 'bg-amber-700/20 text-amber-600' :
                        'bg-neutral-700/50 text-neutral-400'
                      }`}>
                        {school.rank}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white font-medium">{school.name}</td>
                    <td className="py-4 px-4 text-right text-emerald-400 font-bold">{school.avgWpm} WPM</td>
                    <td className="py-4 px-4 text-right text-neutral-300">{school.students}</td>
                    <td className="py-4 px-4 text-right text-green-400 font-semibold">{school.improvement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <h3 className="text-lg font-bold text-white mb-4">Top Performing Classes</h3>
            <div className="space-y-3">
              {['Advanced Computer Science - Tech Valley', 'Digital Literacy - Digital Academy', 'Programming 101 - Future Skills'].map((className, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-800/50 last:border-0">
                  <span className="text-neutral-300">{className}</span>
                  <span className="text-emerald-400 font-semibold">{78 - index * 5} WPM</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                '250 students completed typing tests today',
                'Tech Valley High reached new record average',
                '15 new students registered this week',
                'Monthly progress reports generated'
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 py-2 border-b border-neutral-800/50 last:border-0">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-neutral-400 text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}