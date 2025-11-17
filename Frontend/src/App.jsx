import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur">
        <nav className="container-page flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-neutral-800 border border-neutral-700">J</span>
            <span>Jackal Tech Ltd</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-white border-b-2 border-white">Home</Link>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <Link to="/typing" className="hover:text-white">Typing</Link>
            <Link to="/voice" className="hover:text-white">Voice</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signup" className="btn-secondary hidden sm:inline-flex">Sign Up</Link>
            <Link to="/signin" className="text-sm inline-flex items-center gap-2"><span className="i">👤</span> Justine Neema</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-800">
        <div className="container-page py-10 text-sm text-neutral-400">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <div className="font-semibold text-neutral-200">Jackal Furious Finger Typing</div>
              <div className="flex gap-4">
                <a href="#about">About</a>
                <a href="#features">Features</a>
                <a href="#typing">Typing</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Email: info@jackaltechltd.com</span>
              <span>Website: www.jackaltechltd.com</span>
            </div>
          </div>
          <hr className="my-8 border-neutral-800" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p>2024 Jackal Tech. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
