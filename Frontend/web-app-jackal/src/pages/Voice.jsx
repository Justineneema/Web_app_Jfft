// src/pages/Voice.jsx
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const VOICE_TEXTS = [
  "Technology has transformed how we communicate and work in the modern digital age. New tools and platforms emerge constantly, changing the way we interact with information and each other in professional and personal contexts.",
  "Effective communication requires clear thinking and proper organization of ideas. Whether writing emails, reports, or presentations, the ability to express thoughts coherently is essential for success in any field or industry.",
]

export default function Voice() {
  const { isPremium, user, upgradeToPremium } = useAuth()
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

  // Free trial: Allow 3 sessions for non-premium users
  const [freeSessions, setFreeSessions] = useState(3)

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
    if (!isPremium && freeSessions <= 0) {
      setError('Free trial ended. Upgrade to Premium for unlimited voice typing.')
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
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      // Decrement free sessions for non-premium users
      if (!isPremium) {
        setFreeSessions(prev => prev - 1)
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

  const handleUpgrade = () => {
    upgradeToPremium()
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

  // Premium required screen
  if (!isPremium && freeSessions <= 0) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
            <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Upgrade to Premium</h1>
            <p className="text-neutral-400 mb-6">
              You've used all your free voice typing sessions. Upgrade to Premium for unlimited access to all features.
            </p>
            <div className="space-y-4">
              <button 
                onClick={handleUpgrade}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Upgrade Now - $9.99/month
              </button>
              <button 
                onClick={() => navigate('/typing')}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg font-semibold transition-colors border border-neutral-700"
              >
                Continue with Regular Typing
              </button>
            </div>
          </div>
        </div>
      </div>
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
        {!isPremium && (
          <div className="bg-blue-900/20 border border-blue-500 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-400 font-semibold">Free Trial</div>
                <div className="text-sm text-neutral-400">{freeSessions} sessions remaining</div>
              </div>
              <button 
                onClick={handleUpgrade}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
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
      </div>
    </div>
  )
}