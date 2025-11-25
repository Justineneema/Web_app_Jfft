// src/main.jsx - UPDATED VERSION
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Import pages
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Typing from './pages/Typing.jsx'
import Voice from './pages/Voice.jsx'
import Leaderboard from './pages/Leaderboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'typing', element: <Typing /> },
      { path: 'voice', element: <Voice /> },
      { path: 'leaderboard', element: <Leaderboard /> },
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