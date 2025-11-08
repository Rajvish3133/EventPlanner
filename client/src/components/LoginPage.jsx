import { useState } from 'react';
import { Mail, Lock, UserCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';

export default function LoginPage() {
  // State for login form data
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to track focused field
  const [focusedField, setFocusedField] = useState('');
  // State for validation errors
  const [errors, setErrors] = useState({});
  // State for success message
  const [submitted, setSubmitted] = useState(false);

  // --- Validation Logic ---
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : '';
      case 'password':
        // You might just check if it's empty, or keep the length check
        return !value ? 'Password is required' : '';
      default:
        return '';
    }
  };

  // --- Event Handlers ---

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handles blur event for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    setFocusedField('');
  };

  // Handles form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Call login API
      const res = await api.post('/auth/login', formData);
      console.log(res.data);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Show success message
      setSubmitted(true);
      
      // Navigate to dashboard based on role
      setTimeout(() => {
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.msg) {
        setErrors({ general: error.response.data.msg });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    }
  };

  // Helper to show green checkmark
  const isFieldValid = (name) => formData[name] && !errors[name];

  return (
    // Main container
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl border-2 border-gray-200 shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[90vh] md:max-h-[850px]">
        
        {/* Left Column: Image */}
        <div className="relative hidden md:block md:w-1/2 bg-gradient-to-br from-indigo-500 to-blue-600 p-8">
          <img 
            src="https://via.placeholder.com/600x800/4f46e5/ffffff?text=Welcome+Back!" 
            alt="Welcome Back" 
            className="w-full h-full object-cover rounded-xl shadow-lg" 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
            <h2 className="text-white text-4xl font-extrabold text-center leading-tight">
              Sign In To <br /> Your Account
            </h2>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <UserCircle className="w-12 h-12 text-gray-700" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600 text-lg">Sign in to continue</p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3 animate-pulse">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-medium">Signed in successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
              <span className="text-red-800 font-medium">{errors.general}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-gray-700' : 'text-gray-400'}`} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={handleBlur}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                    errors.email ? 'border-red-500' : focusedField === 'email' ? 'border-gray-700' : 'border-gray-300'
                  } ${isFieldValid('email') ? 'border-green-500' : ''}`}
                  placeholder="john@example.com"
                />
                {isFieldValid('email') && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-gray-700' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={handleBlur}
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${
                    errors.password ? 'border-red-500' : focusedField === 'password' ? 'border-gray-700' : 'border-gray-300'
                  } ${isFieldValid('password') ? 'border-green-500' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            
            {/* Forgot Password Link */}
            <div className="text-right">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline">
                    Forgot Password?
                </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600 text-base">
            Don't have an account?{' '}
            <a href="#" className="text-gray-800 font-semibold hover:underline" onClick={() => navigate('/signup')}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}