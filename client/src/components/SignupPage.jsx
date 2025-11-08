import { useState } from 'react';
import { User, Mail, Lock, Phone, UserCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../axios'
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  // State to hold all form data
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    Phonenumber: '',
    role: ''
  });

  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  // State to track which field is currently focused for dynamic styling
  const [focusedField, setFocusedField] = useState('');
  // State to store validation error messages
  const [errors, setErrors] = useState({});
  // State to show a success message after submission
  const [submitted, setSubmitted] = useState(false);

  // Available roles for the dropdown
  const roles = ['Client', 'Admin'];

  // --- Validation Logic ---
  // Function to validate individual fields based on their name
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : '';
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters' : '';
      case 'Phonenumber':
        // Cleans non-digits and checks for 10 digits
        return !/^\d{10}$/.test(value.replace(/\D/g, '')) ? 'Phone must be 10 digits' : '';
      case 'role':
        return !value ? 'Please select a role' : '';
      default:
        return '';
    }
  };

  // --- Event Handlers ---

  // Handles input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for the field as soon as user starts typing again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handles blur event (when a field loses focus) for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    setFocusedField(''); // Clear focused field state
  };

  // Handles form submission
  const handleSubmit = async (e) => {

    e.preventDefault();
    // console.log(formData);
    const res = await api.post('/auth/register', formData);
    console.log(res.data);

    localStorage.setItem('user', JSON.stringify(res.data));

    console.log(res.data?.role);

    navigate('/login');

    // --- Full Form Validation Before Submission ---
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // If there are any errors, update state and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // --- Successful Submission Logic ---
    setSubmitted(true); // Show success message
    // Reset form and hide success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', password: '', Phonenumber: '', role: '' }); // Clear form
      setErrors({}); // Clear errors
    }, 3000);
  };

  // Helper function to check if a field is valid for the green checkmark icon
  const isFieldValid = (name) => formData[name] && !errors[name];

  return (
    // Main container for the entire page, using a flexbox to center content
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl border-2 border-gray-200 shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[90vh] md:max-h-[850px]">

        {/* Left Column: Image */}
        <div className="relative hidden md:block md:w-1/2 bg-gradient-to-br from-indigo-500 to-blue-600 p-8">
          <img
            src="https://via.placeholder.com/600x800/6366f1/ffffff?text=Welcome+to+Our+Community"
            alt="Welcome"
            className="w-full h-full object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
            <h2 className="text-white text-4xl font-extrabold text-center leading-tight">
              Start Your Journey <br /> With Us
            </h2>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <UserCircle className="w-12 h-12 text-gray-700" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600 text-lg">Join us today and get started</p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3 animate-pulse">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-medium">Account created successfully!</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-gray-700' : 'text-gray-400'}`} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={handleBlur}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${errors.name ? 'border-red-500' : focusedField === 'name' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('name') ? 'border-green-500' : ''}`}
                  placeholder="John Doe"
                />
                {isFieldValid('name') && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Role Field (Moved) */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <div className="relative">
                <UserCircle className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'role' ? 'text-gray-700' : 'text-gray-400'}`} />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('role')}
                  onBlur={handleBlur}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all appearance-none bg-white ${errors.role ? 'border-red-500' : focusedField === 'role' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('role') ? 'border-green-500' : ''}`}
                >
                  <option value="">Choose a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {/* Custom arrow for select input */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {isFieldValid('role') && <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
            </div>

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
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${errors.email ? 'border-red-500' : focusedField === 'email' ? 'border-gray-700' : 'border-gray-300'
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
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${errors.password ? 'border-red-500' : focusedField === 'password' ? 'border-gray-700' : 'border-gray-300'
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

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'phone' ? 'text-gray-700' : 'text-gray-400'}`} />
                <input
                  type="tel"
                  id="Phonenumber"
                  name="Phonenumber"
                  value={formData.Phonenumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('Phonenumber')}
                  onBlur={handleBlur}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all ${errors.Phonenumber ? 'border-red-500' : focusedField === 'Phonenumber' ? 'border-gray-700' : 'border-gray-300'
                    } ${isFieldValid('Phonenumber') ? 'border-green-500' : ''}`}
                  placeholder="1234567890"
                />
                {isFieldValid('Phonenumber') && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
              </div>
              {errors.Phonenumber && <p className="mt-1 text-sm text-red-500">{errors.Phonenumber}</p>}
            </div>

            {/* Role Field (This block has been moved up) */}
            {/* <div> ... </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transform transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-gray-600 text-base">
            Already have an account?{' '}
            <a href="#" className="text-gray-800 font-semibold hover:underline" onClick={() => navigate('/login')}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}