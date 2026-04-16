import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const { signIn, signUp, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/shop', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    // Additional validation
    if (email && !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Prevent multiple rapid submissions
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleSubmit = async (e: React.FormEvent, isRegister = false) => {
    e.preventDefault();
    
    // Rate limit check
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      setErrors({ form: 'Please wait a moment before trying again' });
      return;
    }
    setLastSubmitTime(now);
    
    if (!validateForm()) return;

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (isRegister) {
      const result = await signUp(sanitizedEmail, sanitizedPassword, sanitizedEmail.split('@')[0]);
      if (result.success) {
        navigate('/shop', { replace: true });
      } else {
        // Provide more helpful error messages
        let errorMsg = result.error || 'Registration failed';
        if (errorMsg.includes('email rate limit')) {
          errorMsg = 'Please wait 60 seconds before trying to register again';
        } else if (errorMsg.includes('invalid')) {
          errorMsg = 'Please enter a valid email address';
        }
        setErrors({ form: errorMsg });
      }
    } else {
      const result = await signIn(sanitizedEmail, sanitizedPassword);
      if (result.success) {
        navigate('/shop', { replace: true });
      } else {
        let errorMsg = result.error || 'Invalid credentials';
        if (errorMsg.includes('Invalid login credentials')) {
          errorMsg = 'Invalid email or password';
        } else if (errorMsg.includes('rate limit')) {
          errorMsg = 'Please wait a moment before trying again';
        }
        setErrors({ form: errorMsg });
      }
    }
  };

  // Prevent multiple rapid clicks on Create Account button
  const [isRegistering, setIsRegistering] = useState(false);

  // Show loading while redirecting authenticated users
  if (isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F6]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-[5px] shadow-sm border border-stone-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-brand mb-2">Welcome Back</h2>
          <p className="text-stone-500 text-sm">Sign in to your Beautistic Glam account</p>
        </div>

        {errors.form && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-[5px]">
            {errors.form}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center text-stone-500 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-stone-300 text-brand focus:ring-brand" />
              Remember me
            </label>
            <a href="#" className="text-brand hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand text-white py-4 rounded-[5px] font-bold uppercase tracking-widest text-xs hover:bg-brand-hover transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center">
          <p className="text-stone-500 text-sm mb-4">Don't have an account?</p>
          <Link 
            to="/register"
            className="text-brand font-bold uppercase tracking-widest text-xs hover:underline"
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;