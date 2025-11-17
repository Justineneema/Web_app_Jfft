import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  const [accountType, setAccountType] = useState('personal')
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolDomain: '',
    adminEmail: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log('Input changed:', name, value)
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
    
    if (accountType === 'school') {
      if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required'
      if (!formData.schoolDomain.trim()) newErrors.schoolDomain = 'School domain is required'
      if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Admin email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) newErrors.adminEmail = 'Invalid email format'
    }
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted!', formData)
    
    if (!validateForm()) {
      console.log('Validation failed', errors)
      return
    }
    
    setIsSubmitting(true)
    console.log('Starting submission...')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success state
      setIsSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          schoolName: '',
          schoolDomain: '',
          adminEmail: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: ''
        })
        setErrors({})
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      alert('Error creating account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignup = () => {
    alert('Google signup would be implemented here')
  }

  console.log('SignUp component rendered, formData:', formData, 'errors:', errors, 'isSubmitting:', isSubmitting)

  return (
    <div className="container-page py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        <div className="max-w-md">
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setAccountType('personal')}
              className={`px-4 py-2 rounded border border-neutral-700 text-sm ${
                accountType === 'personal' ? 'bg-neutral-800 text-white' : 'bg-transparent text-neutral-400'
              }`}
            >
              Personal
            </button>
            <button 
              onClick={() => setAccountType('school')}
              className={`px-4 py-2 rounded border border-neutral-700 text-sm ${
                accountType === 'school' ? 'bg-neutral-800 text-white' : 'bg-transparent text-neutral-400'
              }`}
            >
              School
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="card-surface p-6">
            <h2 className="text-2xl font-bold text-white">Sign Up</h2>
            <p className="text-sm text-neutral-400">Become a Typing Master today below</p>
            
            {isSuccess && (
              <div className="mt-4 p-3 bg-green-600/20 border border-green-500 rounded text-green-400 text-sm">
                ✅ Account created successfully! You can now sign in.
              </div>
            )}
            
            <div className="mt-6 space-y-3">
              <button 
                type="button"
                onClick={handleGoogleSignup}
                className="w-full btn-secondary"
              >
                Sign up with Google
              </button>
              
              <div className="flex items-center gap-2 text-neutral-500 text-xs">
                <div className="h-px flex-1 bg-neutral-800" /> or <div className="h-px flex-1 bg-neutral-800" />
              </div>
              
              {accountType === 'school' && (
                <>
                  <div>
                    <input 
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder="School Name" 
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
                    />
                    {errors.schoolName && <p className="text-red-400 text-xs mt-1">{errors.schoolName}</p>}
                  </div>
                  
                  <div>
                    <input 
                      name="schoolDomain"
                      value={formData.schoolDomain}
                      onChange={handleInputChange}
                      placeholder="School Domain" 
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
                    />
                    {errors.schoolDomain && <p className="text-red-400 text-xs mt-1">{errors.schoolDomain}</p>}
                  </div>
                  
                  <div>
                    <input 
                      name="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      placeholder="Admin Email" 
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
                    />
                    {errors.adminEmail && <p className="text-red-400 text-xs mt-1">{errors.adminEmail}</p>}
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name" 
                    className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name" 
                    className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div>
                <input 
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password" 
                  className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <input 
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password" 
                  className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Account...' : isSuccess ? 'Account Created!' : 'Create an Account'}
              </button>
              
              {/* Debug info - remove in production */}
              <div className="text-xs text-neutral-500 mt-2">
                Debug: {Object.keys(formData).filter(key => formData[key]).length} fields filled
              </div>
              
              <p className="text-xs text-neutral-400">
                Already have an account? <Link to="/signin" className="underline hover:text-white">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="hidden md:block relative rounded-lg overflow-hidden">
          <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
            <div className="text-center text-neutral-400">
              <div className="text-6xl mb-4">⌨️</div>
              <div className="text-lg font-semibold">Start Your Typing Journey</div>
              <div className="text-sm">Join thousands of users improving their typing skills</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
