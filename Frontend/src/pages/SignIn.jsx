import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      
      // Show success message
      alert('Signed in successfully! Redirecting to dashboard...')
      
      // In a real app, you'd redirect to dashboard
      // window.location.href = '/app'
    } catch (error) {
      alert('Invalid email or password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignin = () => {
    alert('Google signin would be implemented here')
  }

  return (
    <div className="container-page py-10 md:py-16">
      <div className="max-w-md mx-auto">
        <div className="card-surface p-6">
          <h2 className="text-2xl font-bold text-white text-center">Sign In</h2>
          <p className="text-sm text-neutral-400 text-center mt-2">Welcome back! Sign in to continue</p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <button 
              type="button"
              onClick={handleGoogleSignin}
              className="w-full btn-secondary"
            >
              Sign in with Google
            </button>
            
            <div className="flex items-center gap-2 text-neutral-500 text-xs">
              <div className="h-px flex-1 bg-neutral-800" /> or <div className="h-px flex-1 bg-neutral-800" />
            </div>
            
            <div>
              <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email" 
                className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
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
                className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500" 
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-400">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-emerald-400 hover:text-emerald-300">Forgot password?</a>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            
            <p className="text-xs text-neutral-400 text-center">
              Don't have an account? <Link to="/signup" className="underline hover:text-white">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}


