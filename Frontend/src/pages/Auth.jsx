// src/pages/Auth.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Auth() {
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(true) // Default to Sign Up
  const [accountType, setAccountType] = useState('personal')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // School domains for validation
  const schoolDomains = ['edu', 'ac', 'school', 'college', 'university']
  const adminEmailPatterns = ['admin', 'administrator', 'principal', 'head', 'director', 'office', 'info', 'contact']

  const validateEmail = (email, accountType) => {
    const emailParts = email.split('@')
    if (emailParts.length !== 2) return false
    
    const domainParts = emailParts[1].split('.')
    const domainExt = domainParts[domainParts.length - 1]
    const username = emailParts[0].toLowerCase()

    if (accountType === 'student') {
      return schoolDomains.includes(domainExt)
    } else if (accountType === 'manager') {
      const isAdminEmail = adminEmailPatterns.some(pattern => username.includes(pattern))
      return schoolDomains.includes(domainExt) && isAdminEmail
    }
    
    return true
  }

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

  const validateSignUpForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    else if (!validateEmail(formData.email, accountType)) {
      if (accountType === 'student') {
        newErrors.email = 'Please use a school email address'
      } else if (accountType === 'manager') {
        newErrors.email = 'Please use an admin email from a school domain'
      }
    }
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    
    if (accountType === 'manager' && !formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignInForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (!formData.password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSignUp ? !validateSignUpForm() : !validateSignInForm()) return
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const email = formData.email.toLowerCase()
      let userType = accountType || 'personal'
      const isPremiumUser = email.includes('premium') || email.includes('pro')
      
      const userData = {
        id: 1,
        email: formData.email,
        name: isSignUp ? `${formData.firstName} ${formData.lastName}` : formData.email.split('@')[0],
        isPremium: isPremiumUser,
        userType: userType
      }
      
      login(userData)
      
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
      setErrors({ submit: isSignUp ? 'Registration failed. Please try again.' : 'Invalid email or password. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolName: ''
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-neutral-400">
              {isSignUp ? 'Join JFFT and start improving your typing' : 'Sign in to continue your typing journey'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-neutral-800 p-1 rounded-lg">
            <button 
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                !isSignUp 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                isSignUp 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                {/* Account Type Selection */}
                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-semibold text-neutral-300">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['personal', 'student', 'manager'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAccountType(type)}
                        className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                          accountType === type
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* First Name */}
                <div>
                  <input 
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name" 
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <input 
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name" 
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                </div>

                {/* School Name (Manager only) */}
                {accountType === 'manager' && (
                  <div>
                    <input 
                      name="schoolName"
                      type="text"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder="School Name" 
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                    {errors.schoolName && <p className="text-red-400 text-xs mt-1">{errors.schoolName}</p>}
                  </div>
                )}
              </>
            )}

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div>
                <input 
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password" 
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>

            {/* Errors */}
            {errors.submit && (
              <p className="text-red-400 text-xs text-center">{errors.submit}</p>
            )}
          </form>

          {/* Toggle Mode Link */}
          <p className="text-xs text-neutral-400 text-center mt-6">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
