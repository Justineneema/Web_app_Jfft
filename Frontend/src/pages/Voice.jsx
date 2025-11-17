import { useState, useRef, useEffect } from 'react'

const VOICE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This is a voice typing test to measure your speaking speed and accuracy.",
  "Welcome to voice typing practice. Speak clearly and at a moderate pace to achieve the best results.",
  "Technology has revolutionized the way we communicate and work in the modern digital age.",
  "Practice makes perfect when it comes to voice recognition and speech-to-text technology.",
  "Artificial intelligence and machine learning are transforming industries across the globe."
]

export default function Voice() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [targetText, setTargetText] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isStarted, setIsStarted] = useState(false)
  const recognitionRef = useRef(null)

  // Load random text on component mount
  useEffect(() => {
    loadNewText()
  }, [])

  const loadNewText = () => {
    const randomText = VOICE_TEXTS[Math.floor(Math.random() * VOICE_TEXTS.length)]
    setTargetText(randomText)
    setTranscript('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setIsStarted(false)
    setError('')
  }

  // Calculate WPM and accuracy
  useEffect(() => {
    if (isStarted && startTime && transcript) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000 / 60 // minutes
        const words = transcript.trim().split(/\s+/).length
        setWpm(Math.round(words / elapsed))
        
        // Calculate accuracy by comparing with target text
        let correctChars = 0
        const minLength = Math.min(transcript.length, targetText.length)
        for (let i = 0; i < minLength; i++) {
          if (transcript[i].toLowerCase() === targetText[i].toLowerCase()) {
            correctChars++
          }
        }
        setAccuracy(transcript.length > 0 ? Math.round((correctChars / transcript.length) * 100) : 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isStarted, startTime, transcript, targetText])

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(prev => {
          const newTranscript = prev + finalTranscript
          if (!isStarted && newTranscript.length > 0) {
            setIsStarted(true)
            setStartTime(Date.now())
          }
          return newTranscript
        })
      }

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      setIsSupported(false)
      setError('Speech recognition is not supported in this browser')
    }
  }, [isStarted])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError('')
      setTranscript('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const clearTranscript = () => {
    loadNewText()
  }

  return (
    <div className="container-page py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Voice Typing Practice</h1>
        
        {!isSupported ? (
          <div className="card-surface p-6 text-center">
            <div className="text-red-400 mb-4">⚠️ Speech recognition not supported</div>
            <p className="text-neutral-400">
              Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for the best experience.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="card-surface p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{wpm}</div>
                <div className="text-sm text-neutral-400">Words/Min</div>
              </div>
              <div className="card-surface p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{accuracy}%</div>
                <div className="text-sm text-neutral-400">Accuracy</div>
              </div>
              <div className="card-surface p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{transcript.length}</div>
                <div className="text-sm text-neutral-400">Characters</div>
              </div>
            </div>

            {/* Target Text */}
            <div className="card-surface p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Speak this text:</h3>
              <div className="text-neutral-300 leading-relaxed text-lg">
                {targetText}
              </div>
            </div>

            {/* Controls */}
            <div className="card-surface p-6 mb-6">
              <div className="flex justify-center gap-4 mb-4">
                {!isListening ? (
                  <button 
                    onClick={startListening}
                    className="btn-primary flex items-center gap-2"
                  >
                    🎤 Start Voice Typing
                  </button>
                ) : (
                  <button 
                    onClick={stopListening}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2"
                  >
                    ⏹️ Stop Listening
                  </button>
                )}
                <button 
                  onClick={clearTranscript}
                  className="btn-secondary"
                >
                  New Text
                </button>
              </div>
              
              {isListening && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-emerald-400">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    Listening...
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="card-surface p-4 mb-6 border border-red-500">
                <div className="text-red-400">{error}</div>
              </div>
            )}

            {/* Transcript Display */}
            <div className="card-surface p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Speech:</h3>
              <div className="min-h-32 p-4 bg-neutral-800/50 rounded border border-neutral-700">
                {transcript ? (
                  <div className="text-neutral-200 leading-relaxed">
                    {transcript.split('').map((char, index) => {
                      const isCorrect = index < targetText.length && 
                        char.toLowerCase() === targetText[index].toLowerCase()
                      return (
                        <span
                          key={index}
                          className={isCorrect ? 'text-green-400' : 'text-red-400'}
                        >
                          {char}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-neutral-500 italic">Start speaking to see your words appear here...</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="card-surface p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Use Voice Typing:</h3>
              <ul className="space-y-2 text-neutral-300">
                <li>• Click "Start Voice Typing" to begin</li>
                <li>• Speak clearly and at a normal pace</li>
                <li>• The system will convert your speech to text in real-time</li>
                <li>• Click "Stop Listening" when you're done</li>
                <li>• Use "Clear Text" to start over</li>
              </ul>
            </div>

            {/* Tips */}
            <div className="card-surface p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tips for Better Results:</h3>
              <ul className="space-y-2 text-neutral-300">
                <li>• Use a quiet environment for better accuracy</li>
                <li>• Speak at a moderate pace - not too fast or slow</li>
                <li>• Pronounce words clearly</li>
                <li>• Use punctuation commands like "period", "comma", "question mark"</li>
                <li>• Say "new line" or "new paragraph" for line breaks</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
