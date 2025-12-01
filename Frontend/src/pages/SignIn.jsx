// src/pages/SignIn.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (!formData.password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock user data - replace with actual API response
      const email = formData.email.toLowerCase()
      let userType = 'personal'
      
      if (email.includes('student') || email.includes('.edu')) {
        userType = 'student'
      } else if (email.includes('manager') || email.includes('admin')) {
        userType = 'manager'
      }

      // Mock premium status based on email for demo
      const isPremiumUser = email.includes('premium') || email.includes('pro')
      
      const userData = {
        id: 1,
        email: formData.email,
        name: formData.email.split('@')[0],
        isPremium: isPremiumUser,
        userType: userType
      }
      
      // Login user
      login(userData)
      
      // Redirect based on user type
      switch (userType) {
        case 'student':
          navigate('/typing?leaderboard=true')
          break
        case 'manager':
          navigate('/leaderboard')
          break
        case 'personal':
        default:
          navigate('/typing')
          break
      }
      
    } catch (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Sign In</h2>
          <p className="text-sm text-neutral-400 text-center mb-6">Welcome back! Sign in to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email" 
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <input 
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password" 
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            
            {errors.submit && (
              <p className="text-red-400 text-xs text-center">{errors.submit}</p>
            )}
            
            <p className="text-xs text-neutral-400 text-center">
              Don't have an account? <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}