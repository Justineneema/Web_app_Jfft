// src/main.jsx - UPDATED VERSION
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Import pages
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Typing from './pages/Typing.jsx'
import Voice from './pages/Voice.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Pricing from './pages/Pricing.jsx'
import Features from './pages/Features.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'auth', element: <Auth /> },
      { path: 'signup', element: <Auth /> }, // Redirect to unified auth
      { path: 'signin', element: <Auth /> }, // Redirect to unified auth
      { path: 'typing', element: <Typing /> },
      { path: 'voice', element: <Voice /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'features', element: <Features /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)