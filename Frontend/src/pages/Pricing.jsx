import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function PaymentModal({ plan, price, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [paymentData, setPaymentData] = useState({
    // General Fields (All Methods)
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    billingAddress: '',
    selectedPlan: 'monthly',
    amount: price,
    currency: 'USD',
    
    // Card Fields
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingZipCode: '',
    saveCard: false,
    
    // PayPal Fields
    paypalEmail: '',
    savePayPalInfo: false,
    
    // Google Play Fields
    googleEmail: '',
    
    // Apple Pay Fields
    appleId: '',
    
    // Stripe Fields
    stripeEmail: '',
    
    // Momo Fields
    momoPhoneNumber: '',
    primaryPin: '',
    momoNetwork: 'MTN'
  })
  const [errors, setErrors] = useState({})
  const [paymentComplete, setPaymentComplete] = useState(false)

  // Comprehensive Validation Function
  const validatePaymentData = (method) => {
    const newErrors = {}

    // General field validation (all methods)
    if (!paymentData.fullName || paymentData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (minimum 2 characters)'
    }

    if (!paymentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
      newErrors.email = 'Valid email address is required'
    }

    if (!paymentData.phoneNumber || !/^(\+)?[1-9]\d{1,14}$/.test(paymentData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Valid phone number is required'
    }

    if (!paymentData.country || paymentData.country.trim().length < 2) {
      newErrors.country = 'Country is required'
    }

    if (!paymentData.billingAddress || paymentData.billingAddress.trim().length < 5) {
      newErrors.billingAddress = 'Valid billing address is required'
    }

    // Method-specific validation
    switch (method) {
      case 'card':
        if (!paymentData.cardholderName || paymentData.cardholderName.trim().length < 2) {
          newErrors.cardholderName = 'Cardholder name is required'
        }
        if (!paymentData.cardNumber || !/^[0-9]{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
          newErrors.cardNumber = 'Valid 16-digit card number is required'
        }
        if (!paymentData.expiryMonth || !/^(0[1-9]|1[0-2])$/.test(paymentData.expiryMonth)) {
          newErrors.expiryMonth = 'Valid month required (01-12)'
        }
        if (!paymentData.expiryYear || !/^20[2-9][0-9]$/.test(paymentData.expiryYear)) {
          newErrors.expiryYear = 'Valid year required (2025+)'
        }
        if (!paymentData.cvv || !/^[0-9]{3,4}$/.test(paymentData.cvv)) {
          newErrors.cvv = 'Valid CVV required (3-4 digits)'
        }
        break

      case 'paypal':
        if (!paymentData.paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.paypalEmail)) {
          newErrors.paypalEmail = 'Valid PayPal email is required'
        }
        break

      case 'googleplay':
        if (!paymentData.googleEmail || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(paymentData.googleEmail)) {
          newErrors.googleEmail = 'Valid Gmail address is required'
        }
        break

      case 'applepay':
        if (!paymentData.appleId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.appleId)) {
          newErrors.appleId = 'Valid Apple ID is required'
        }
        break

      case 'stripe':
        if (!paymentData.stripeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.stripeEmail)) {
          newErrors.stripeEmail = 'Valid email is required for Stripe'
        }
        break

      case 'momo':
        if (!paymentData.momoPhoneNumber || !/^(\+)?[1-9]\d{1,14}$/.test(paymentData.momoPhoneNumber.replace(/\s/g, ''))) {
          newErrors.momoPhoneNumber = 'Valid phone number is required (e.g., +256701234567)'
        }
        if (!paymentData.primaryPin || !/^[0-9]{4}$/.test(paymentData.primaryPin)) {
          newErrors.primaryPin = '4-digit PIN is required'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    
    if (!validatePaymentData(selectedMethod)) {
      return
    }
    
    setPaymentComplete(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-neutral-900 border-2 border-emerald-500 rounded-2xl p-12 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4 text-emerald-500">✓</div>
          <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
          <p className="text-neutral-400 mb-6">Your {plan} plan has been activated. Welcome aboard!</p>
          <button 
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Complete Your Upgrade</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-3xl font-light"
          >
            ×
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary - Left Side */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-neutral-800/50 rounded-lg">
                <span className="text-3xl">⭐</span>
                <div className="flex-1">
                  <p className="text-white font-semibold">{plan}</p>
                  <p className="text-sm text-neutral-400">Monthly subscription</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-emerald-500/30 pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-white font-semibold">${price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Tax</span>
                <span className="text-white font-semibold">$0</span>
              </div>
              <div className="flex justify-between border-t border-emerald-500/30 pt-3 mt-3">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-emerald-400 font-bold text-2xl">${price}/mo</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-xs text-neutral-300">✓ Cancel anytime</p>
              <p className="text-xs text-neutral-300">✓ Secure payment</p>
              <p className="text-xs text-neutral-300">✓ No hidden fees</p>
            </div>
          </div>

          {/* Payment Methods - Right Side */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Card */}
              <label className={`cursor-pointer p-5 border-2 rounded-xl transition-all transform hover:scale-105 ${
                selectedMethod === 'card' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/30' 
                  : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={selectedMethod === 'card'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">💳</div>
                  <div className="text-sm font-semibold text-white">Card</div>
                  <div className="text-xs text-neutral-400">Credit/Debit</div>
                </div>
              </label>

              {/* PayPal */}
              <label className={`cursor-pointer p-5 border-2 rounded-xl transition-all transform hover:scale-105 ${
                selectedMethod === 'paypal' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/30' 
                  : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="paypal"
                  checked={selectedMethod === 'paypal'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">🅿️</div>
                  <div className="text-sm font-semibold text-white">PayPal</div>
                  <div className="text-xs text-neutral-400">Fast & Secure</div>
                </div>
              </label>

              {/* Google Play */}
              <label className={`cursor-pointer p-5 border-2 rounded-xl transition-all transform hover:scale-105 ${
                selectedMethod === 'googleplay' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/30' 
                  : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="googleplay"
                  checked={selectedMethod === 'googleplay'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">🔵</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                  <div className="text-xs text-neutral-400">Android</div>
                </div>
              </label>

              {/* Apple Pay */}
              <label className={`cursor-pointer p-5 border-2 rounded-xl transition-all transform hover:scale-105 ${
                selectedMethod === 'applepay' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/30' 
                  : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="applepay"
                  checked={selectedMethod === 'applepay'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">🍎</div>
                  <div className="text-sm font-semibold text-white">Apple Pay</div>
                  <div className="text-xs text-neutral-400">iOS/Mac</div>
                </div>
              </label>

              {/* Stripe */}
              <label className={`cursor-pointer p-5 border-2 rounded-xl transition-all transform hover:scale-105 ${
                selectedMethod === 'stripe' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/30' 
                  : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="stripe"
                  checked={selectedMethod === 'stripe'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-sm font-semibold text-white">Stripe</div>
                  <div className="text-xs text-neutral-400">Multiple options</div>
                </div>
              </label>

              {/* MTN Momo Pay - spans full width */}
              <label className={`cursor-pointer p-5 border-2 rounded-xl transition-all transform hover:scale-105 col-span-2 ${
                selectedMethod === 'momo' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/30' 
                  : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="momo"
                  checked={selectedMethod === 'momo'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <div className="text-sm font-semibold text-white">MTN Momo Pay</div>
                  <div className="text-xs text-neutral-400">Mobile Money - Fast & Secure</div>
                </div>
              </label>
            </div>

            {/* Forms for all payment methods */}
            {selectedMethod === 'card' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6">
                {/* Payment Summary */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Amount to Pay</span>
                    <span className="text-lg font-bold text-emerald-400">${price}/month</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                    <span>Plan</span>
                    <span>{plan}</span>
                  </div>
                </div>

                {/* General Fields */}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Billing Information</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={paymentData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={paymentData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={paymentData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Billing Address</label>
                  <input 
                    type="text" 
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street, Suite 100"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                </div>

                {/* Card-Specific Fields */}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Card Details</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Cardholder Name</label>
                  <input 
                    type="text" 
                    name="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Card Number</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Expiry Month</label>
                    <input 
                      type="text" 
                      name="expiryMonth"
                      value={paymentData.expiryMonth}
                      onChange={handleChange}
                      placeholder="MM"
                      maxLength="2"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Expiry Year</label>
                    <input 
                      type="text" 
                      name="expiryYear"
                      value={paymentData.expiryYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      maxLength="4"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">CVV</label>
                    <input 
                      type="text" 
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Billing Zip Code</label>
                  <input 
                    type="text" 
                    name="billingZipCode"
                    value={paymentData.billingZipCode}
                    onChange={handleChange}
                    placeholder="12345"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.billingZipCode && <p className="text-red-500 text-xs mt-1">{errors.billingZipCode}</p>}
                </div>
                <label className="flex items-center gap-3 mt-3">
                  <input 
                    type="checkbox" 
                    name="saveCard"
                    checked={paymentData.saveCard}
                    onChange={handleChange}
                    className="w-4 h-4 rounded bg-neutral-800 border border-neutral-700 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-400">Save this card for future payments</span>
                </label>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 mt-6"
                >
                  Pay ${price}/month
                </button>
              </form>
            )}

            {/* PayPal Form */}
            {selectedMethod === 'paypal' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6">
                {/* Payment Summary */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Amount to Pay</span>
                    <span className="text-lg font-bold text-emerald-400">${price}/month</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                    <span>Plan</span>
                    <span>{plan}</span>
                  </div>
                </div>

                {/* General Fields */}
                <div className="border-b border-neutral-700 pb-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Billing Information</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={paymentData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={paymentData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={paymentData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Billing Address</label>
                  <input 
                    type="text" 
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street, Suite 100"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                </div>

                {/* PayPal-Specific Fields */}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">PayPal Details</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">PayPal Email</label>
                  <input 
                    type="email" 
                    name="paypalEmail"
                    value={paymentData.paypalEmail}
                    onChange={handleChange}
                    placeholder="your@paypal.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.paypalEmail && <p className="text-red-500 text-xs mt-1">{errors.paypalEmail}</p>}
                </div>
                <label className="flex items-center gap-3 mt-3">
                  <input 
                    type="checkbox" 
                    name="savePayPalInfo"
                    checked={paymentData.savePayPalInfo}
                    onChange={handleChange}
                    className="w-4 h-4 rounded bg-neutral-800 border border-neutral-700 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-400">Remember my PayPal account</span>
                </label>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue to PayPal
                </button>
              </form>
            )}

            {/* MTN Momo Pay Form */}
            {selectedMethod === 'momo' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6">
                {/* Payment Summary */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Amount to Pay</span>
                    <span className="text-lg font-bold text-emerald-400">${price}/month</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                    <span>Plan</span>
                    <span>{plan}</span>
                  </div>
                </div>

                {/* General Fields */}
                <div className="border-b border-neutral-700 pb-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Billing Information</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={paymentData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={paymentData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+256 123 456 789"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={paymentData.country}
                    onChange={handleChange}
                    placeholder="Uganda"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Billing Address</label>
                  <input 
                    type="text" 
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street, Kampala"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                </div>

                {/* Momo-Specific Fields */}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">MTN Mobile Money Details</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">MTN Momo Phone Number</label>
                  <input 
                    type="tel" 
                    name="momoPhoneNumber"
                    value={paymentData.momoPhoneNumber}
                    onChange={handleChange}
                    placeholder="+256 701 234 567"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.momoPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.momoPhoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Momo Network</label>
                  <select
                    name="momoNetwork"
                    value={paymentData.momoNetwork}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="MTN">MTN</option>
                    <option value="Airtel">Airtel</option>
                    <option value="Vodafone">Vodafone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Primary PIN (4 digits)</label>
                  <input 
                    type="password" 
                    name="primaryPin"
                    value={paymentData.primaryPin}
                    onChange={handleChange}
                    placeholder="••••"
                    maxLength="4"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.primaryPin && <p className="text-red-500 text-xs mt-1">{errors.primaryPin}</p>}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue to MTN Momo Pay
                </button>
              </form>
            )}

            {/* Google Play Form */}
            {selectedMethod === 'googleplay' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6">
                {/* Payment Summary */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Amount to Pay</span>
                    <span className="text-lg font-bold text-emerald-400">${price}/month</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                    <span>Plan</span>
                    <span>{plan}</span>
                  </div>
                </div>

                {/* General Fields */}
                <div className="border-b border-neutral-700 pb-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Billing Information</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={paymentData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={paymentData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={paymentData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Billing Address</label>
                  <input 
                    type="text" 
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street, Suite 100"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                </div>

                {/* Google Play-Specific Fields */}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Google Play Details</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Google Account Email (Gmail)</label>
                  <input 
                    type="email" 
                    name="googleEmail"
                    value={paymentData.googleEmail}
                    onChange={handleChange}
                    placeholder="your@gmail.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.googleEmail && <p className="text-red-500 text-xs mt-1">{errors.googleEmail}</p>}
                  <p className="text-xs text-neutral-500 mt-2">Must be a valid Gmail address linked to Google Play</p>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue to Google Play
                </button>
              </form>
            )}

            {/* Apple Pay Form */}
            {selectedMethod === 'applepay' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6">
                {/* Payment Summary */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Amount to Pay</span>
                    <span className="text-lg font-bold text-emerald-400">${price}/month</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                    <span>Plan</span>
                    <span>{plan}</span>
                  </div>
                </div>

                {/* General Fields */}
                <div className="border-b border-neutral-700 pb-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Billing Information</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={paymentData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={paymentData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={paymentData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Billing Address</label>
                  <input 
                    type="text" 
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street, Suite 100"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                </div>

                {/* Apple Pay-Specific Fields */}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Apple ID Details</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Apple ID Email</label>
                  <input 
                    type="email" 
                    name="appleId"
                    value={paymentData.appleId}
                    onChange={handleChange}
                    placeholder="your@icloud.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.appleId && <p className="text-red-500 text-xs mt-1">{errors.appleId}</p>}
                  <p className="text-xs text-neutral-500 mt-2">Must be a valid Apple ID email (iCloud, @mac.com, etc.)</p>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue to Apple Pay
                </button>
              </form>
            )}

            {/* Stripe Form */}
            {selectedMethod === 'stripe' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6">
                {/* Payment Summary */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Amount to Pay</span>
                    <span className="text-lg font-bold text-emerald-400">${price}/month</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                    <span>Plan</span>
                    <span>{plan}</span>
                  </div>
                </div>

                {/* General Fields */}
                <div className="border-b border-neutral-700 pb-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Billing Information</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={paymentData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={paymentData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={paymentData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={paymentData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Billing Address</label>
                  <input 
                    type="text" 
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street, Suite 100"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                </div>

                {/* Stripe-Specific Fields */}
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-4">Stripe Payment Details</h4>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Stripe Account Email</label>
                  <input 
                    type="email" 
                    name="stripeEmail"
                    value={paymentData.stripeEmail}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.stripeEmail && <p className="text-red-500 text-xs mt-1">{errors.stripeEmail}</p>}
                  <p className="text-xs text-neutral-500 mt-2">We support credit/debit cards via Stripe secure payment</p>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue to Stripe
                </button>
              </form>
            )}

            {!selectedMethod && (
              <button 
                disabled
                className="w-full bg-neutral-700 text-neutral-500 font-bold py-3 rounded-lg cursor-not-allowed opacity-50"
              >
                Select a Payment Method
              </button>
            )}

            <p className="text-xs text-neutral-500 text-center mt-4">
              Your payment is secure and encrypted. No extra charges.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [pricing] = useState({ free: 0, pro: 8, team: 20 })

  const handlePlanSelect = (plan, price) => {
    setSelectedPlan({ plan, price })
    setShowModal(true)
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Header */}
      <section className="container-page py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Choose the perfect plan for your typing journey. Start free and upgrade anytime.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container-page py-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            className="card-surface p-8 text-center hover:border-emerald-500/30 transition-all duration-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
            <p className="text-neutral-400 mb-6">Perfect for beginners</p>
            <div className="text-5xl font-bold text-white mb-2">${pricing.free}</div>
            <div className="text-sm text-neutral-400 mb-8">Free forever</div>
            <ul className="space-y-4 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Basic Typing Lessons
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Limited Daily Challenges
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Keyboard Heatmap (Basic)
              </li>
              <li className="flex items-center gap-3 text-neutral-500">
                <span className="text-lg">✗</span> Voice Typing
              </li>
              <li className="flex items-center gap-3 text-neutral-500">
                <span className="text-lg">✗</span> Professional Certification
              </li>
            </ul>
            <Link to="/signup" className="btn-secondary w-full py-4 text-lg font-semibold block">
              Get Started Free
            </Link>
          </motion.div>

          {/* Pro Plan - Highlighted */}
          <motion.div 
            className="card-surface p-8 text-center border-2 border-emerald-500 relative bg-gradient-to-b from-emerald-500/10 to-transparent"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm px-6 py-2 rounded-full font-bold shadow-lg">
                MOST POPULAR
              </span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Pro Plan</h3>
            <p className="text-neutral-400 mb-6">For serious learners</p>
            <div className="text-5xl font-bold text-white mb-2">${pricing.pro}</div>
            <div className="text-sm text-neutral-400 mb-8">per month</div>
            <ul className="space-y-4 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Everything in Free
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Unlimited Lessons
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Full Heatmap Insights
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Finger Training Mode
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Voice Typing
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Professional Certification
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('Pro Plan', pricing.pro)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Upgrade to Pro
            </button>
          </motion.div>

          {/* Team Plan */}
          <motion.div 
            className="card-surface p-8 text-center hover:border-blue-500/30 transition-all duration-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Team Plan</h3>
            <p className="text-neutral-400 mb-6">Schools & organizations</p>
            <div className="text-5xl font-bold text-white mb-2">${pricing.team}</div>
            <div className="text-sm text-neutral-400 mb-8">per month</div>
            <ul className="space-y-4 text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Everything in Pro
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Manage Up to 50 Users
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Team Analytics Dashboard
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Customized Exercises
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 text-lg">✓</span> Priority Support
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('Team Plan', pricing.team)}
              className="btn-secondary w-full py-4 text-lg font-semibold"
            >
              Get Team Plan
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-page py-20 bg-neutral-900/50 rounded-2xl my-12">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Can I cancel anytime?</h3>
            <p className="text-neutral-400">Yes! You can cancel your subscription at any time. No hidden fees or long-term commitments.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Is there a free trial?</h3>
            <p className="text-neutral-400">Yes! Start with our Free plan which is free forever, then upgrade to Pro anytime.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">What payment methods do you accept?</h3>
            <p className="text-neutral-400">We accept all major credit cards, PayPal, Apple Pay, Google Play, and Stripe payments.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Can I upgrade or downgrade my plan?</h3>
            <p className="text-neutral-400">Absolutely! Change your plan at any time, and we'll prorate the charges based on your usage.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-page py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to level up your typing?</h2>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Start free today and see the difference a professional typing platform can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handlePlanSelect('Pro Plan', pricing.pro)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Upgrade Now
            </button>
            <Link 
              to="/typing" 
              className="border-2 border-neutral-600 hover:border-emerald-500 bg-neutral-900/50 hover:bg-emerald-500/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              Try Free First
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <PaymentModal 
          plan={selectedPlan.plan} 
          price={selectedPlan.price}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
