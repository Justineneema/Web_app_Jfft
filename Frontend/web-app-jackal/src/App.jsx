// src/App.jsx - ENHANCED VERSION
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-dvh flex flex-col bg-neutral-950">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur">
        <nav className="container-page flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <div>
              <div className="font-bold text-white text-lg leading-none">Jackal Tech Ltd</div>
              <div className="text-xs text-neutral-400 leading-none hidden sm:block">JFFT Platform</div>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <a 
              href="#features" 
              className="text-neutral-400 hover:text-white transition-colors duration-200"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-neutral-400 hover:text-white transition-colors duration-200"
            >
              Pricing
            </a>
            <Link 
              to="/typing" 
              className={`transition-colors duration-200 ${
                isActive('/typing') 
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Typing
            </Link>
            <Link 
              to="/voice" 
              className={`transition-colors duration-200 ${
                isActive('/voice') 
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Voice
            </Link>
            <Link 
              to="/leaderboard" 
              className={`transition-colors duration-200 ${
                isActive('/leaderboard') 
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Leaderboard
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              to="/signin" 
              className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm hidden sm:block"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="btn-primary text-sm"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Minimal Professional Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-900">
        <div className="container-page py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-neutral-400 text-sm">
              © 2024 Jackal Tech Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span>info@jackaltechltd.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App