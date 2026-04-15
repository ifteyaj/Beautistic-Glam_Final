import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; form?: string }>({});
  const { signUp, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/shop', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    if (email && !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.form = 'Please agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    const result = await signUp(sanitizedEmail, sanitizedPassword, sanitizedName);
    
    if (result.success) {
      setSuccess(true);
    } else {
      let errorMsg = result.error || 'Registration failed';
      if (errorMsg.includes('email rate limit')) {
        errorMsg = 'Please wait 60 seconds before trying again';
      } else if (errorMsg.includes('invalid')) {
        errorMsg = 'Please enter a valid email address';
      } else if (errorMsg.includes('already been registered')) {
        errorMsg = 'This email is already registered. Try signing in instead.';
      }
      setErrors({ form: errorMsg });
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F6]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-[5px] shadow-sm border border-stone-100 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-brand mb-2">Account Created!</h2>
          <p className="text-stone-500 text-sm mb-8">Welcome to Beautistic Glam, {name}!</p>
          <p className="text-stone-600 text-sm mb-6">We've sent a confirmation link to your email. Please verify to activate your account.</p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-brand text-white py-4 rounded-[5px] font-bold uppercase tracking-widest text-xs hover:bg-brand-hover transition-all flex items-center justify-center gap-2"
          >
            Continue to Shop
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F6]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-[5px] shadow-sm border border-stone-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-brand mb-2">Create Account</h2>
          <p className="text-stone-500 text-sm">Join Beautistic Glam for exclusive benefits</p>
        </div>

        {errors.form && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-[5px]">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-stone-50 border ${errors.name ? 'border-red-500' : 'border-stone-200'} focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-sm`}
                placeholder="Your full name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-stone-50 border ${errors.email ? 'border-red-500' : 'border-stone-200'} focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-sm`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-stone-50 border ${errors.password ? 'border-red-500' : 'border-stone-200'} focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-sm`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-brand transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <p className="text-[10px] text-stone-400 mt-1">At least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-stone-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-stone-200'} focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-sm`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-start text-xs">
            <input 
              type="checkbox" 
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mr-2 mt-0.5 rounded border-stone-300 text-brand focus:ring-brand" 
            />
            <span className="text-stone-500">
              I agree to the <Link to="/terms" className="text-brand hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand hover:underline">Privacy Policy</Link>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand text-white py-4 rounded-[5px] font-bold uppercase tracking-widest text-xs hover:bg-brand-hover transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center">
          <p className="text-stone-500 text-sm mb-4">Already have an account?</p>
          <Link 
            to="/login"
            className="text-brand font-bold uppercase tracking-widest text-xs hover:underline"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;