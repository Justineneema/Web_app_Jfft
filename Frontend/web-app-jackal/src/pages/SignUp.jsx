// src/pages/SignUp.jsx - UPDATED VERSION
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const [accountType, setAccountType] = useState('personal')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '' // Only for school managers
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // School domains for validation
  const schoolDomains = ['edu', 'ac', 'school', 'college', 'university']
  
  // Common admin email patterns
  const adminEmailPatterns = ['admin', 'administrator', 'principal', 'head', 'director', 'office', 'info', 'contact']

  const validateEmail = (email, accountType) => {
    const emailParts = email.split('@')
    if (emailParts.length !== 2) return false
    
    const domainParts = emailParts[1].split('.')
    const domainExt = domainParts[domainParts.length - 1]
    const username = emailParts[0].toLowerCase()

    if (accountType === 'student') {
      // Student must use school email
      return schoolDomains.includes(domainExt)
    } else if (accountType === 'manager') {
      // Manager must have admin email pattern and school domain
      const isAdminEmail = adminEmailPatterns.some(pattern => 
        username.includes(pattern)
      )
      return schoolDomains.includes(domainExt) && isAdminEmail
    }
    
    return true // Personal accounts have no restrictions
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation based on account type
    if (formData.email) {
      if (!validateEmail(formData.email, accountType)) {
        if (accountType === 'student') {
          newErrors.email = 'Students must use a valid school email address (e.g., .edu, .ac, .school)'
        } else if (accountType === 'manager') {
          newErrors.email = 'School managers must use a school admin email (e.g., admin@school.edu)'
        }
      }
    }

    // Required field validation
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // School name validation for managers only
    if (accountType === 'manager') {
      if (!formData.schoolName.trim()) {
        newErrors.schoolName = 'School name is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAccountTypeChange = (type) => {
    setAccountType(type)
    // Reset school-specific fields when changing type
    setFormData(prev => ({
      ...prev,
      schoolName: ''
    }))
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call with account type data
      const userData = {
        id: Date.now(), // Generate unique ID
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        isPremium: false, // New users start as non-premium
        userType: accountType, // Use accountType as userType for consistency
        accountType: accountType,
        schoolName: accountType === 'manager' ? formData.schoolName : undefined
      }
      
      console.log('Creating user account:', userData)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Login user with the created account data
      login(userData)
      
      // Redirect based on account type (same logic as SignIn)
      switch (accountType) {
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
      setErrors({ submit: 'Failed to create account. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getEmailPlaceholder = () => {
    switch (accountType) {
      case 'student':
        return 'student@school.edu'
      case 'manager':
        return 'admin@school.edu'
      default:
        return 'your@email.com'
    }
  }

  const getAccountTypeDescription = () => {
    switch (accountType) {
      case 'personal':
        return 'Perfect for individual practice and skill development'
      case 'student':
        return 'Access competitive leaderboards and track progress with classmates'
      case 'manager':
        return 'Monitor school performance and student progress analytics'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-neutral-400">Choose your account type</p>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-neutral-800 rounded-lg">
            {[
              { type: 'personal', label: 'Personal', icon: '👤' },
              { type: 'student', label: 'Student', icon: '🎓' },
              { type: 'manager', label: 'Manager', icon: '🏫' }
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => handleAccountTypeChange(type)}
                className={`py-3 px-2 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                  accountType === type
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Account Type Description */}
          <div className="mb-6 p-3 bg-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-300 text-center">
              {getAccountTypeDescription()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* School Name for Managers Only */}
            {accountType === 'manager' && (
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-neutral-300 mb-2">
                  School Name *
                </label>
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your school name"
                />
                {errors.schoolName && <p className="text-red-400 text-xs mt-1">{errors.schoolName}</p>}
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-300 mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="First name"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-300 mb-2">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Last name"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder={getEmailPlaceholder()}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              {accountType === 'student' && (
                <p className="text-xs text-neutral-500 mt-1">
                  ✓ Use your school email address to access student features
                </p>
              )}
              {accountType === 'manager' && (
                <p className="text-xs text-neutral-500 mt-1">
                  ✓ Use your school admin email to access management features
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Create a password"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-600/20 border border-red-500 rounded text-red-400 text-sm text-center">
                {errors.submit}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : `Create ${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`}
            </button>

            <p className="text-center text-sm text-neutral-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Sign in
              </Link>
            </p>

            {/* Account Type Benefits */}
            <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
              <h4 className="text-sm font-semibold text-white mb-2">What you'll get:</h4>
              <ul className="text-xs text-neutral-400 space-y-1">
                {accountType === 'personal' && (
                  <>
                    <li>✓ Unlimited typing practice</li>
                    <li>✓ Progress tracking</li>
                    <li>✓ Personalized exercises</li>
                  </>
                )}
                {accountType === 'student' && (
                  <>
                    <li>✓ Everything in Personal</li>
                    <li>✓ Class leaderboards</li>
                    <li>✓ Compete with classmates</li>
                    <li>✓ Progress reports</li>
                  </>
                )}
                {accountType === 'manager' && (
                  <>
                    <li>✓ School performance dashboard</li>
                    <li>✓ Student progress monitoring</li>
                    <li>✓ Class statistics</li>
                    <li>✓ Exportable reports</li>
                  </>
                )}
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}