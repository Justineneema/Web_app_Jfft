// src/pages/Voice.jsx
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const VOICE_TEXTS = [
  "Technology has transformed how we communicate and work in the modern digital age. New tools and platforms emerge constantly, changing the way we interact with information and each other in professional and personal contexts.",
  "Effective communication requires clear thinking and proper organization of ideas. Whether writing emails, reports, or presentations, the ability to express thoughts coherently is essential for success in any field or industry.",
]

// Trial Limit Modal
function TrialLimitModal({ trialsRemaining, onUpgrade }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-neutral-900 border-2 border-yellow-500/50 rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="text-3xl font-bold text-white mb-2">Trial Sessions Used</h2>
        <p className="text-neutral-400 mb-6 text-lg">
          You have <span className="text-yellow-400 font-bold">{trialsRemaining}</span> free trial session{trialsRemaining !== 1 ? 's' : ''} remaining
        </p>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-neutral-300">
            Voice Typing is a <span className="text-yellow-400 font-semibold">Premium Feature</span>. Upgrade to get unlimited access and receive professional certificates!
          </p>
        </div>

        <Link 
          to="/pricing"
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block mb-3"
        >
          Upgrade to Premium
        </Link>
        
        <Link 
          to="/typing"
          className="w-full text-neutral-400 hover:text-white transition-colors py-2 block text-sm"
        >
          Try Typing Practice Instead
        </Link>
      </motion.div>
    </div>
  )
}

// Certificate Modal
function CertificateModal({ show, stats, onClose }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-neutral-900 border-2 border-emerald-500 rounded-2xl p-12 max-w-2xl w-full text-center"
      >
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-4">
          Outstanding Performance!
        </h2>
        
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 rounded-xl p-8 mb-6">
          <p className="text-neutral-400 mb-4">You've achieved an excellent score in Voice Typing</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <p className="text-sm text-neutral-400">Words Per Minute</p>
              <p className="text-3xl font-bold text-emerald-400">{stats.wpm}</p>
            </div>
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <p className="text-sm text-neutral-400">Accuracy</p>
              <p className="text-3xl font-bold text-blue-400">{stats.accuracy}%</p>
            </div>
          </div>
          <p className="text-sm text-neutral-300">
            ✓ Premium users receive <span className="font-semibold text-yellow-400">professional certificates</span> for high scores
          </p>
        </div>

        <button 
          onClick={onClose}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Continue
        </button>
      </motion.div>
    </div>
  )
}

export default function Voice() {
  const { isPremium, user } = useAuth()
  const navigate = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [wordCount, setWordCount] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [testStats, setTestStats] = useState({ wpm: 0, accuracy: 0 })

  // Free trial: Allow 3 sessions for non-premium users
  const [freeSessions, setFreeSessions] = useState(() => {
    const saved = localStorage.getItem('jfft_voice_sessions')
    return saved ? parseInt(saved) : 3
  })

  useEffect(() => {
    // Redirect non-premium users who have no free sessions left
    if (!isPremium && freeSessions <= 0) {
      setError('Free trial ended. Upgrade to Premium for unlimited voice typing.')
      return
    }

    // Check browser support
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(false)
      setError('Voice typing is not supported in your browser. Try Chrome or Edge.')
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' '
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
          
          // Count words
          const newWords = finalTranscript.trim().split(/\s+/).length
          setWordCount(prev => prev + newWords)
          
          // Calculate WPM based on elapsed time
          const elapsedTime = 60 - timeRemaining
          if (elapsedTime > 0) {
            const minutes = elapsedTime / 60
            setWpm(Math.round(wordCount / minutes))
          }
        }
      }

      recognitionRef.current.onerror = (event) => {
        setError(`Error: ${event.error}`)
        stopTest()
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timeRemaining, wordCount, isPremium, freeSessions])

  const startTest = () => {
    // Check if non-premium user has trials remaining
    if (!isPremium && freeSessions <= 0) {
      setShowTrialModal(true)
      return
    }

    if (recognitionRef.current && !isListening) {
      setError('')
      setTranscript('')
      setWordCount(0)
      setWpm(0)
      setTimeRemaining(60)
      setCurrentTextIndex(0)
      
      recognitionRef.current.start()
      setIsListening(true)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopTest()
            // Check if test finished successfully
            setTimeout(() => {
              // Show certificate modal if premium and good score
              if (isPremium && wpm > 40) {
                setTestStats({ wpm, accuracy: 95 })
                setShowCertificateModal(true)
              }
            }, 500)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      // Decrement free sessions for non-premium users
      if (!isPremium) {
        const newSessions = freeSessions - 1
        setFreeSessions(newSessions)
        localStorage.setItem('jfft_voice_sessions', newSessions)
      }
    }
  }

  const stopTest = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const resetTest = () => {
    stopTest()
    setTranscript('')
    setWordCount(0)
    setWpm(0)
    setTimeRemaining(60)
    setCurrentTextIndex(0)
    setError('')
  }

  const getDisplayText = () => {
    const timeProgress = 1 - (timeRemaining / 60)
    const wordProgress = Math.min(wordCount / 100, 1)
    const progress = Math.max(timeProgress, wordProgress)
    
    const textsToShow = Math.max(1, Math.ceil(progress * 3))
    
    return VOICE_TEXTS.slice(currentTextIndex, currentTextIndex + textsToShow).join(' ')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Show trial limit modal when free sessions are exhausted
  if (!isPremium && freeSessions <= 0) {
    return (
      <TrialLimitModal 
        trialsRemaining={0} 
        onUpgrade={() => setShowTrialModal(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Voice Typing Test</h1>
          <p className="text-neutral-400">Speak for one minute - Premium Feature</p>
        </div>

        {/* Free Trial Info */}
        {!isPremium && freeSessions > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-yellow-400 font-semibold flex items-center gap-2">
                  <span>🎤</span> Free Trial Active
                </div>
                <div className="text-sm text-neutral-400">{freeSessions} test{freeSessions !== 1 ? 's' : ''} remaining • Premium unlocks unlimited access + certificates</div>
              </div>
              <Link 
                to="/pricing"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Go Premium
              </Link>
            </div>
          </motion.div>
        )}

        {!isSupported ? (
          <div className="bg-neutral-900 rounded-xl p-6 text-center border border-neutral-800">
            <div className="text-red-400 mb-3">Browser Not Supported</div>
            <p className="text-neutral-400 text-sm">
              Voice typing works best in Chrome, Edge, or Safari. Please switch browsers to use this feature.
            </p>
          </div>
        ) : (
          <>
            {/* Stats with Timer */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
                <div className="text-2xl font-bold text-emerald-400">{wpm}</div>
                <div className="text-sm text-neutral-400">WPM</div>
              </div>
              <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
                <div className="text-2xl font-bold text-blue-400">{wordCount}</div>
                <div className="text-sm text-neutral-400">Words</div>
              </div>
              <div className="bg-neutral-900 rounded-xl p-4 text-center border border-neutral-800">
                <div className={`text-2xl font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-purple-400'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-neutral-400">Time Left</div>
              </div>
            </div>

            {/* Target Text Display */}
            <div className="bg-neutral-900 rounded-xl p-6 mb-6 border border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Text to Speak</h3>
                <div className="text-sm text-neutral-500">
                  {timeRemaining < 60 ? 'Keep speaking...' : 'Ready to start'}
                </div>
              </div>
              
              {/* Current Text */}
              <div className="text-neutral-100 leading-relaxed text-lg bg-neutral-800 p-6 rounded-lg min-h-48 font-medium">
                {getDisplayText()}
                {timeRemaining === 0 && (
                  <div className="mt-4 text-center text-emerald-400 text-sm font-semibold">
                    ✓ Time's up! Great job completing the 1-minute test.
                  </div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 bg-neutral-800 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Voice Controls */}
            <div className="bg-neutral-900 rounded-xl p-6 mb-6 border border-neutral-800">
              <div className="flex justify-center gap-4 mb-4">
                {!isListening ? (
                  <button 
                    onClick={startTest}
                    disabled={timeRemaining === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    {timeRemaining === 0 ? 'Start New Test' : 'Start Test'}
                  </button>
                ) : (
                  <button 
                    onClick={stopTest}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Stop Test
                  </button>
                )}
                <button 
                  onClick={resetTest}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors border border-neutral-700"
                >
                  Reset
                </button>
              </div>

              {isListening && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Listening... {timeRemaining}s remaining
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 mb-6">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}

            {/* Live Transcript */}
            <div className="bg-neutral-900 rounded-xl p-6 mb-6 border border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Your Live Transcription</h3>
                <span className="text-sm text-neutral-500">
                  Real-time speech to text
                </span>
              </div>
              <div className="min-h-48 p-6 bg-neutral-800 rounded-lg border border-neutral-700">
                {transcript ? (
                  <div className="text-neutral-200 leading-relaxed text-lg">
                    {transcript}
                    {isListening && (
                      <span className="inline-block w-2 h-6 bg-blue-400 ml-1 animate-pulse"></span>
                    )}
                  </div>
                ) : (
                  <div className="text-neutral-500 italic text-center h-48 flex items-center justify-center">
                    {timeRemaining === 0 ? 'Test completed. Start a new test to begin.' : 'Your spoken words will appear here as you speak...'}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Trial Limit Modal */}
        <TrialLimitModal 
          trialsRemaining={freeSessions} 
          onUpgrade={() => setShowTrialModal(false)}
        />

        {/* Certificate Modal */}
        <CertificateModal 
          show={showCertificateModal && isPremium}
          stats={testStats}
          onClose={() => setShowCertificateModal(false)}
        />
      </div>
    </div>
  )
}