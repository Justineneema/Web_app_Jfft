import { useState, useEffect, useRef } from 'react'

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

const TYPING_TEXTS = {
  beginner: [
    "The quick brown fox jumps over the lazy dog. This is a simple sentence for beginners to practice typing.",
    "Hello world! Welcome to our typing practice. Start slow and focus on accuracy first.",
    "Practice makes perfect. Keep typing every day to improve your speed and accuracy.",
    "The cat sat on the mat. Simple words help build confidence in typing skills.",
    "Type each word carefully. Speed will come naturally with consistent practice."
  ],
  intermediate: [
    "The advancement of technology has revolutionized the way we communicate and work in the modern world. Digital tools and platforms have made it possible to connect with people across the globe instantly.",
    "Programming is an art form that combines logic, creativity, and problem-solving skills. Developers use various programming languages to create software applications that solve real-world problems.",
    "The importance of education cannot be overstated in today's competitive job market. Continuous learning and skill development are essential for career growth and personal fulfillment.",
    "Climate change represents one of the most pressing challenges of our time. Scientists and researchers are working tirelessly to develop sustainable solutions for environmental protection.",
    "Artificial intelligence is transforming industries across the board, from healthcare and finance to transportation and entertainment. The potential for AI to improve human life is enormous."
  ],
  advanced: [
    "The intricate complexities of quantum mechanics have baffled scientists for decades, yet they continue to unravel the mysteries of subatomic particles and their behavior in ways that challenge our fundamental understanding of reality.",
    "Neuroscience research has revealed fascinating insights into the human brain's plasticity and its remarkable ability to adapt and reorganize itself throughout our lives, opening new possibilities for treating neurological disorders.",
    "The philosophical implications of artificial consciousness raise profound questions about the nature of self-awareness, free will, and what it truly means to be human in an age of increasingly sophisticated machines.",
    "Cryptocurrency and blockchain technology represent a paradigm shift in how we conceptualize value, trust, and decentralized systems, potentially revolutionizing everything from financial services to supply chain management.",
    "The synthesis of interdisciplinary knowledge from fields as diverse as biology, computer science, and cognitive psychology is driving unprecedented advances in our understanding of complex adaptive systems and emergent behaviors."
  ],
  quotes: [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Life is what happens to you while you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle"
  ],
  programming: [
    "function calculateFibonacci(n) { if (n <= 1) return n; return calculateFibonacci(n - 1) + calculateFibonacci(n - 2); }",
    "const users = await fetch('/api/users').then(response => response.json()).catch(error => console.error('Error:', error));",
    "class DatabaseConnection { constructor(host, port) { this.host = host; this.port = port; } async connect() { return new Promise((resolve, reject) => { /* connection logic */ }); } }",
    "import React, { useState, useEffect } from 'react'; const App = () => { const [data, setData] = useState(null); useEffect(() => { fetchData(); }, []); return <div>{data}</div>; };",
    "SELECT u.username, p.title FROM users u JOIN posts p ON u.id = p.user_id WHERE p.created_at > '2024-01-01' ORDER BY p.created_at DESC LIMIT 10;"
  ]
}

export default function Typing() {
  const [currentText, setCurrentText] = useState('')
  const [targetText, setTargetText] = useState('')
  const [textCategory, setTextCategory] = useState('beginner')
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [activeKey, setActiveKey] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [errors, setErrors] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const textareaRef = useRef(null)

  // Load random text when component mounts or category changes
  useEffect(() => {
    loadNewText()
  }, [textCategory])

  const loadNewText = () => {
    const texts = TYPING_TEXTS[textCategory]
    const randomText = texts[Math.floor(Math.random() * texts.length)]
    setTargetText(randomText)
    setCurrentText('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setIsStarted(false)
    setErrors(0)
    setTotalChars(0)
    setCorrectChars(0)
  }

  useEffect(() => {
    if (isStarted && startTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000 / 60 // minutes
        const words = currentText.trim().split(/\s+/).length
        setWpm(Math.round(words / elapsed))
        
        // Calculate accuracy
        let correct = 0
        let total = currentText.length
        for (let i = 0; i < Math.min(currentText.length, targetText.length); i++) {
          if (currentText[i] === targetText[i]) correct++
        }
        setCorrectChars(correct)
        setTotalChars(total)
        setAccuracy(total > 0 ? Math.round((correct / total) * 100) : 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isStarted, startTime, currentText, targetText])

  const handleInput = (e) => {
    const value = e.target.value
    setCurrentText(value)
    
    if (!isStarted) {
      setIsStarted(true)
      setStartTime(Date.now())
    }

    // Check for errors
    let errorCount = 0
    for (let i = 0; i < Math.min(value.length, targetText.length); i++) {
      if (value[i] !== targetText[i]) errorCount++
    }
    setErrors(errorCount)
  }

  const handleKeyDown = (e) => {
    setActiveKey(e.key)
    setTimeout(() => setActiveKey(''), 150)
  }

  const resetTest = () => {
    loadNewText()
    if (textareaRef.current) textareaRef.current.focus()
  }

  const getKeyClass = (key) => {
    const baseClass = "px-2 py-1 m-0.5 rounded text-xs font-mono border border-gray-600 text-gray-800"
    const colorClass = KEY_COLORS[key] || 'bg-gray-300'
    const activeClass = activeKey === key.toLowerCase() ? 'ring-2 ring-blue-400' : ''
    
    if (key === 'Space') return `${baseClass} ${colorClass} ${activeClass} w-24`
    if (key === 'Tab' || key === 'Caps' || key === 'Shift') return `${baseClass} ${colorClass} ${activeClass} w-12`
    if (key === 'Enter') return `${baseClass} ${colorClass} ${activeClass} w-16`
    if (key === 'Backspace') return `${baseClass} ${colorClass} ${activeClass} w-16`
    if (key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Del') return `${baseClass} ${colorClass} ${activeClass} w-10`
    
    return `${baseClass} ${colorClass} ${activeClass} w-8`
  }

  return (
    <div className="container-page py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Professional Typing Practice</h1>
        
        {/* Text Category Selection */}
        <div className="card-surface p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Choose Text Category:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(TYPING_TEXTS).map(category => (
              <button
                key={category}
                onClick={() => setTextCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  textCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{wpm}</div>
            <div className="text-sm text-neutral-400">WPM</div>
          </div>
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{accuracy}%</div>
            <div className="text-sm text-neutral-400">Accuracy</div>
          </div>
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{errors}</div>
            <div className="text-sm text-neutral-400">Errors</div>
          </div>
          <div className="card-surface p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{currentText.length}</div>
            <div className="text-sm text-neutral-400">Characters</div>
          </div>
        </div>

        {/* Target Text */}
        <div className="card-surface p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Type this text:</h3>
          <div className="text-neutral-300 leading-relaxed">
            {targetText.split('').map((char, index) => {
              const isTyped = index < currentText.length
              const isCorrect = currentText[index] === char
              const isCurrent = index === currentText.length
              
              return (
                <span
                  key={index}
                  className={`${
                    isCurrent ? 'bg-blue-500' : 
                    isTyped ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : ''
                  }`}
                >
                  {char}
                </span>
              )
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="card-surface p-6 mb-6">
          <textarea
            ref={textareaRef}
            value={currentText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Start typing here..."
            className="w-full h-32 bg-transparent text-white placeholder-neutral-500 border-none outline-none resize-none"
            autoFocus
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={resetTest} className="btn-secondary">New Text</button>
          <button onClick={() => textareaRef.current?.focus()} className="btn-primary">Focus Input</button>
        </div>

        {/* Keyboard Visualization */}
        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Keyboard Layout</h3>
          <div className="space-y-1">
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
      </div>
    </div>
  )
}
