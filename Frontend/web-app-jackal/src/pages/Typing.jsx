// src/pages/Typing.jsx
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSearchParams } from 'react-router-dom'

const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Del', 'Ctrl']
]

const KEY_COLORS = {
  '`': 'bg-green-300', '1': 'bg-green-300', '2': 'bg-yellow-300', '3': 'bg-yellow-300', '4': 'bg-yellow-300',
  '5': 'bg-teal-300', '6': 'bg-pink-300', '7': 'bg-pink-300', '8': 'bg-yellow-300', '9': 'bg-yellow-300',
  '0': 'bg-green-300', '-': 'bg-green-300', '=': 'bg-green-300', 'Backspace': 'bg-green-300',
  'Tab': 'bg-green-300', 'q': 'bg-green-300', 'w': 'bg-green-300', 'e': 'bg-yellow-300', 'r': 'bg-yellow-300',
  't': 'bg-teal-300', 'y': 'bg-pink-300', 'u': 'bg-pink-300', 'i': 'bg-yellow-300', 'o': 'bg-yellow-300',
  'p': 'bg-green-300', '[': 'bg-green-300', ']': 'bg-green-300', '\\': 'bg-green-300',
  'Caps': 'bg-green-300', 'a': 'bg-green-300', 's': 'bg-yellow-300', 'd': 'bg-yellow-300', 'f': 'bg-teal-300',
  'g': 'bg-teal-300', 'h': 'bg-pink-300', 'j': 'bg-pink-300', 'k': 'bg-yellow-300', 'l': 'bg-yellow-300',
  ';': 'bg-green-300', "'": 'bg-green-300', 'Enter': 'bg-green-300',
  'Shift': 'bg-green-300', 'z': 'bg-green-300', 'x': 'bg-yellow-300', 'c': 'bg-yellow-300', 'v': 'bg-teal-300',
  'b': 'bg-teal-300', 'n': 'bg-pink-300', 'm': 'bg-pink-300', ',': 'bg-yellow-300', '.': 'bg-yellow-300',
  '/': 'bg-green-300',
  'Ctrl': 'bg-green-300', 'Win': 'bg-green-300', 'Alt': 'bg-green-300', 'Space': 'bg-red-500',
  'Del': 'bg-green-300'
}

const CONTINUOUS_TEXT = `
The rapid advancement of technology has fundamentally transformed how we communicate, work, and interact with information in our daily lives. Digital platforms and tools have created unprecedented opportunities for global collaboration and knowledge sharing across different industries and disciplines worldwide. This digital revolution continues to reshape industries and create new possibilities for innovation and growth in various sectors.
Effective communication skills are crucial in professional environments where clear and concise writing can make significant differences in project outcomes and business relationships. Mastering typing enables professionals to express their ideas more efficiently and respond promptly to important messages while maintaining productivity throughout the workday and ensuring timely completion of critical tasks and assignments.
`.trim()

export default function Typing() {
  const { isPremium, user } = useAuth()
  const [searchParams] = useSearchParams()
  const showLeaderboard = searchParams.get('leaderboard') === 'true'
  
  const [currentText, setCurrentText] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [activeKey, setActiveKey] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [testComplete, setTestComplete] = useState(false)
  const [finalWpm, setFinalWpm] = useState(0)
  const [currentPosition, setCurrentPosition] = useState(0)
  const textareaRef = useRef(null)

  // Mock leaderboard data for students
  const leaderboardData = [
    { rank: 1, name: 'Alex Johnson', wpm: 85, accuracy: '98%' },
    { rank: 2, name: 'Sarah Chen', wpm: 82, accuracy: '96%' },
    { rank: 3, name: 'Mike Rodriguez', wpm: 78, accuracy: '95%' },
    { rank: 4, name: 'Emma Wilson', wpm: 75, accuracy: '97%' },
    { rank: 5, name: 'You', wpm: 0, accuracy: '0%', isCurrent: true }
  ]

  const allWords = CONTINUOUS_TEXT.split(/\s+/)

  useEffect(() => {
    let interval
    if (isStarted && startTime && timeRemaining > 0) {
      interval = setInterval(() => {
        const elapsedSeconds = 60 - timeRemaining
        const elapsedMinutes = elapsedSeconds / 60
        const words = currentText.trim().split(/\s+/).length
        setWpm(Math.round(words / elapsedMinutes))
        
        // Update current user in leaderboard
        if (showLeaderboard) {
          const currentUserIndex = leaderboardData.findIndex(item => item.isCurrent)
          if (currentUserIndex !== -1) {
            leaderboardData[currentUserIndex].wpm = Math.round(words / elapsedMinutes)
            leaderboardData[currentUserIndex].accuracy = `${Math.min(99, Math.round(Math.random() * 10 + 90))}%`
          }
        }
        
        // Adjust text position based on typing speed
        const typingSpeed = wpm
        const positionIncrement = Math.max(10, Math.min(30, typingSpeed / 2))
        if (words > currentPosition + positionIncrement) {
          setCurrentPosition(prev => Math.min(allWords.length - 50, prev + positionIncrement))
        }
        
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsStarted(false)
            setTestComplete(true)
            setFinalWpm(Math.round(words / elapsedMinutes))
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStarted, startTime, currentText, timeRemaining, wpm, currentPosition])

  const handleInput = (e) => {
    const value = e.target.value
    setCurrentText(value)
    
    if (!isStarted && value.length > 0) {
      setIsStarted(true)
      setStartTime(Date.now())
    }
  }

  const handleKeyDown = (e) => {
    setActiveKey(e.key)
    setTimeout(() => setActiveKey(''), 150)
  }

  const resetTest = () => {
    setCurrentText('')
    setStartTime(null)
    setWpm(0)
    setIsStarted(false)
    setTimeRemaining(60)
    setTestComplete(false)
    setFinalWpm(0)
    setCurrentPosition(0)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const getKeyClass = (key) => {
    const baseClass = "px-2 py-1 m-0.5 rounded text-xs font-mono border border-gray-600 text-gray-800"
    const colorClass = KEY_COLORS[key] || 'bg-gray-300'
    const activeClass = activeKey === key.toLowerCase() ? 'ring-2 ring-blue-400 transform scale-110' : ''
    
    if (key === 'Space') return `${baseClass} ${colorClass} ${activeClass} w-24`
    if (key === 'Tab' || key === 'Caps' || key === 'Shift') return `${baseClass} ${colorClass} ${activeClass} w-12`
    if (key === 'Enter') return `${baseClass} ${colorClass} ${activeClass} w-16`
    if (key === 'Backspace') return `${baseClass} ${colorClass} ${activeClass} w-16`
    if (key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Del') return `${baseClass} ${colorClass} ${activeClass} w-10`
    
    return `${baseClass} ${colorClass} ${activeClass} w-8`
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDisplayText = () => {
    const baseWords = 50
    const speedMultiplier = Math.min(2, Math.max(0.5, wpm / 60))
    const wordsToShow = Math.floor(baseWords * speedMultiplier)
    
    const endPosition = Math.min(allWords.length, currentPosition + wordsToShow)
    return allWords.slice(currentPosition, endPosition).join(' ')
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-16 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {showLeaderboard ? 'Competitive Typing Practice' : 'Typing Speed Test'}
          </h1>
          <p className="text-neutral-400">
            {showLeaderboard ? 'Compete with your classmates!' : 'Text adapts to your speed'}
          </p>
        </div>

        {/* Two Column Layout for Students with Leaderboard */}
        {showLeaderboard && user?.userType === 'student' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-900 rounded-lg p-3 text-center border border-neutral-800">
                  <div className="text-xl font-bold text-emerald-400">{wpm}</div>
                  <div className="text-xs text-neutral-400">WPM</div>
                </div>
                <div className="bg-neutral-900 rounded-lg p-3 text-center border border-neutral-800">
                  <div className="text-xl font-bold text-blue-400">{timeRemaining}s</div>
                  <div className="text-xs text-neutral-400">Time Left</div>
                </div>
                <div className="bg-neutral-900 rounded-lg p-3 text-center border border-neutral-800">
                  <div className="text-xl font-bold text-purple-400">
                    {Math.round((currentPosition / allWords.length) * 100)}%
                  </div>
                  <div className="text-xs text-neutral-400">Progress</div>
                </div>
              </div>

              {/* Target Text Display */}
              <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                <div className="mb-3">
                  <h3 className="font-semibold text-white">Text to Type</h3>
                </div>
                <div className="text-white leading-relaxed bg-neutral-800 p-4 rounded border border-neutral-700 min-h-48 font-mono text-base">
                  {getDisplayText().split('').map((char, index) => {
                    const globalIndex = currentPosition + index
                    const isTyped = globalIndex < currentText.length
                    const isCorrect = currentText[globalIndex] === char
                    const isCurrent = globalIndex === currentText.length
                    
                    return (
                      <span
                        key={globalIndex}
                        className={`${
                          isCurrent ? 'bg-blue-500 text-white' : 
                          isTyped ? (isCorrect ? 'text-green-400' : 'text-red-400 bg-red-900/30') : 'text-white'
                        } transition-colors duration-150`}
                      >
                        {char}
                      </span>
                    )
                  })}
                </div>

                {/* Progress Bar */}
                <div className="mt-3 bg-neutral-800 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                <textarea
                  ref={textareaRef}
                  value={currentText}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={testComplete ? "Time's up! Start new test to continue..." : "Start typing here to begin the 1-minute test..."}
                  className="w-full h-24 bg-neutral-800 text-white placeholder-neutral-500 border border-neutral-700 rounded p-3 outline-none resize-none font-mono text-base focus:border-emerald-500 transition-colors"
                  autoFocus
                  disabled={testComplete}
                />
              </div>
            </div>

            {/* Leaderboard Sidebar - 1/3 width */}
            <div className="space-y-6">
              <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                <h3 className="font-semibold text-white mb-3 text-center">Class Leaderboard</h3>
                <div className="space-y-2">
                  {leaderboardData.map((student) => (
                    <div 
                      key={student.rank}
                      className={`p-3 rounded border ${
                        student.isCurrent 
                          ? 'bg-emerald-500/20 border-emerald-500' 
                          : 'bg-neutral-800/50 border-neutral-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            student.rank === 1 ? 'bg-yellow-500 text-white' :
                            student.rank === 2 ? 'bg-gray-400 text-white' :
                            student.rank === 3 ? 'bg-amber-700 text-white' :
                            'bg-neutral-700 text-neutral-300'
                          }`}>
                            {student.rank}
                          </div>
                          <span className={`font-medium ${
                            student.isCurrent ? 'text-emerald-400' : 'text-white'
                          }`}>
                            {student.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-bold">{student.wpm} WPM</div>
                          <div className="text-xs text-neutral-400">{student.accuracy} accuracy</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Stats */}
              <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                <h4 className="font-semibold text-white mb-2">Class Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Average WPM:</span>
                    <span className="text-emerald-400">74</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Top WPM:</span>
                    <span className="text-yellow-400">85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Tests Today:</span>
                    <span className="text-blue-400">23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Regular Layout for Personal Users */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-900 rounded-lg p-3 text-center border border-neutral-800">
                <div className="text-xl font-bold text-emerald-400">{wpm}</div>
                <div className="text-xs text-neutral-400">WPM</div>
              </div>
              <div className="bg-neutral-900 rounded-lg p-3 text-center border border-neutral-800">
                <div className="text-xl font-bold text-blue-400">{timeRemaining}s</div>
                <div className="text-xs text-neutral-400">Time Left</div>
              </div>
              <div className="bg-neutral-900 rounded-lg p-3 text-center border border-neutral-800">
                <div className="text-xl font-bold text-purple-400">
                  {Math.round((currentPosition / allWords.length) * 100)}%
                </div>
                <div className="text-xs text-neutral-400">Progress</div>
              </div>
            </div>

            {/* Target Text Display */}
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <div className="mb-3">
                <h3 className="font-semibold text-white">Text to Type</h3>
              </div>
              <div className="text-white leading-relaxed bg-neutral-800 p-4 rounded border border-neutral-700 min-h-48 font-mono text-base">
                {getDisplayText().split('').map((char, index) => {
                  const globalIndex = currentPosition + index
                  const isTyped = globalIndex < currentText.length
                  const isCorrect = currentText[globalIndex] === char
                  const isCurrent = globalIndex === currentText.length
                  
                  return (
                    <span
                      key={globalIndex}
                      className={`${
                        isCurrent ? 'bg-blue-500 text-white' : 
                        isTyped ? (isCorrect ? 'text-green-400' : 'text-red-400 bg-red-900/30') : 'text-white'
                      } transition-colors duration-150`}
                    >
                      {char}
                    </span>
                  )
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-3 bg-neutral-800 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <textarea
                ref={textareaRef}
                value={currentText}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={testComplete ? "Time's up! Start new test to continue..." : "Start typing here to begin the 1-minute test..."}
                className="w-full h-24 bg-neutral-800 text-white placeholder-neutral-500 border border-neutral-700 rounded p-3 outline-none resize-none font-mono text-base focus:border-emerald-500 transition-colors"
                autoFocus
                disabled={testComplete}
              />
            </div>
          </div>
        )}

        {/* Results Modal */}
        {testComplete && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 rounded-xl p-6 max-w-md w-full border border-emerald-500">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⏱️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Time's Up!</h3>
                <p className="text-neutral-400 text-sm">Your typing test is complete</p>
              </div>
              
              <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">{finalWpm}</div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wider">Words Per Minute</div>
                </div>
              </div>

              <button 
                onClick={resetTest}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Start New Test
              </button>
            </div>
          </div>
        )}

        {/* Keyboard Visualization */}
        {!showLeaderboard && (
          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 max-w-4xl mx-auto">
            <h3 className="font-semibold text-white mb-3 text-center">Keyboard Layout</h3>
            <div className="space-y-1 max-w-2xl mx-auto">
              {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                  {row.map((key) => (
                    <div key={key} className={getKeyClass(key)}>
                      {key}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}