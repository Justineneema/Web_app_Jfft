// src/components/Certification.jsx - NEW FILE
import React from 'react'
import { useAuth } from '../context/AuthContext'

const Certification = () => {
  const { user, isPremium } = useAuth()

  const certifications = [
    { 
      id: 1, 
      name: 'Beginner Typist', 
      level: 'Beginner', 
      requirements: '25 WPM with 90% accuracy',
      description: 'Master the basics of touch typing with proper finger placement',
      color: 'green'
    },
    { 
      id: 2, 
      name: 'Intermediate Typist', 
      level: 'Intermediate', 
      requirements: '40 WPM with 95% accuracy',
      description: 'Develop consistent speed and accuracy across all keys',
      color: 'blue'
    },
    { 
      id: 3, 
      name: 'Advanced Typist', 
      level: 'Advanced', 
      requirements: '60 WPM with 98% accuracy',
      description: 'Achieve professional typing speed with minimal errors',
      color: 'purple'
    },
    { 
      id: 4, 
      name: 'Expert Typist', 
      level: 'Expert', 
      requirements: '80 WPM with 99% accuracy',
      description: 'Master elite typing skills for competitive environments',
      color: 'yellow'
    }
  ]

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500'
      case 'intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500'
      case 'advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500'
      case 'expert': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500'
    }
  }

  const handleGetCertificate = (certId) => {
    if (!isPremium) {
      alert('Certification is a premium feature. Please upgrade to get certified.')
      return
    }
    
    // Generate and download certificate
    const cert = certifications.find(c => c.id === certId)
    alert(`Congratulations! You've earned the ${cert?.name} certificate. Your certificate is being generated...`)
  }

  return (
    <div className="container-page py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Professional Typing Certifications</h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Validate your typing skills with industry-recognized certificates that showcase your proficiency to employers and educators.
          </p>
        </div>

        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <div className="card-surface p-8 mb-8 border-2 border-yellow-500/30 bg-yellow-500/10">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Unlock Professional Certification</h3>
              <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
                Upgrade to Premium to earn verified certificates that validate your typing skills and boost your professional profile.
              </p>
              <button className="btn-primary bg-yellow-500 hover:bg-yellow-600 text-white">
                Upgrade to Premium - $8/month
              </button>
            </div>
          </div>
        )}

        {/* Certification Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {certifications.map(cert => (
            <div key={cert.id} className="card-surface p-8 hover:border-neutral-600 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{cert.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(cert.level)}`}>
                    {cert.level}
                  </span>
                </div>
                <div className="text-4xl">
                  {cert.level === 'Beginner' && '🌱'}
                  {cert.level === 'Intermediate' && '🚀'}
                  {cert.level === 'Advanced' && '💫'}
                  {cert.level === 'Expert' && '🏆'}
                </div>
              </div>

              <p className="text-neutral-300 mb-6 leading-relaxed">{cert.description}</p>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-white mb-2">Requirements:</h4>
                  <p className="text-neutral-400 text-sm">{cert.requirements}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Skills Validated:</h4>
                  <ul className="text-neutral-400 text-sm space-y-1">
                    <li>• Touch typing proficiency</li>
                    <li>• Consistent speed maintenance</li>
                    <li>• Error-free typing under pressure</li>
                    <li>• Professional formatting skills</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {isPremium ? (
                  <button 
                    className="btn-primary flex-1 mr-3"
                    onClick={() => handleGetCertificate(cert.id)}
                  >
                    Get Certificate
                  </button>
                ) : (
                  <button 
                    className="btn-secondary flex-1 mr-3 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Premium Required
                  </button>
                )}
                <button className="px-4 py-2 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors">
                  View Sample
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* My Certificates Section */}
        {isPremium && (
          <div className="card-surface p-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Certificates</h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-neutral-500">📜</div>
              <h3 className="text-xl font-semibold text-neutral-400 mb-2">No Certificates Earned Yet</h3>
              <p className="text-neutral-500 mb-6">
                Complete the requirements for any certification above to earn your first certificate.
              </p>
              <button className="btn-secondary">
                View Certification Requirements
              </button>
            </div>

            {/* Progress Tracking */}
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-4">Certification Progress</h4>
              <div className="space-y-4">
                {certifications.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{cert.name}</div>
                      <div className="text-sm text-neutral-400">{cert.requirements}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-400 mb-1">Not Started</div>
                      <button className="text-sm text-emerald-400 hover:text-emerald-300">
                        Start Practice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="card-surface p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Why Get Certified?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="font-semibold text-white mb-2">Career Advancement</h3>
              <p className="text-neutral-400 text-sm">
                Stand out in job applications and demonstrate valuable typing skills to employers.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="font-semibold text-white mb-2">Academic Recognition</h3>
              <p className="text-neutral-400 text-sm">
                Get recognized by educational institutions for your typing proficiency.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="font-semibold text-white mb-2">Skill Validation</h3>
              <p className="text-neutral-400 text-sm">
                Officially validate your typing speed and accuracy with verifiable certificates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Certification