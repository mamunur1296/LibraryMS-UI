import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, User, Eye, EyeOff, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { getAuthStore } from '../store/auth-store';
import { AuthBrandingPanel } from './components/AuthBrandingPanel';
import type { RegisterInput } from '../application/use-cases/register-use-case';

export function RegisterPage(): React.ReactElement {
  const store = getAuthStore();
  const { session, register: registerUser, isLoading } = store();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput & { phone: string }>({
    defaultValues: { username: '', email: '', password: '', firstName: '', lastName: '', phone: '' },
  });

  if (session !== null && !session.isExpired()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterInput & { phone: string }): Promise<void> => {
    const error = await registerUser(data.username, data.email, data.password, data.firstName, data.lastName, data.phone);
    if (error !== null) {
      const appError = error as any;
      if (appError.validationErrors) {
        const vErrors = appError.validationErrors as Record<string, string[]>;
        for (const [key, messages] of Object.entries(vErrors)) {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          setError(fieldName as any, { type: 'server', message: messages[0] ?? 'Invalid field' });
        }
        return;
      }
      setError('root.serverError', { type: 'server', message: error.message });
      return;
    }
    toast.success('Registration successful! Please sign in.');
    void navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
      <AuthBrandingPanel
        title="Join Our"
        highlight="Library Community"
        description="Create an account to borrow books, reserve items, and track your reading journey."
      />

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-16 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white text-center">Create an Account</h2>
            </div>

            {errors.root?.serverError && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-sm text-center">
                {errors.root.serverError.message}
              </div>
            )}

            <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-5" noValidate>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-navy-200">First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    {...register('firstName', { required: 'First name required' })}
                  />
                  {errors.firstName !== undefined && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-navy-200">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    {...register('lastName', { required: 'Last name required' })}
                  />
                  {errors.lastName !== undefined && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy-200">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-navy-400" />
                  <input
                    type="text"
                    placeholder="Choose a username"
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
                  />
                </div>
                {errors.username !== undefined && <p className="text-xs text-red-400">{errors.username.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy-200">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-navy-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                  />
                </div>
                {errors.email !== undefined && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy-200">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  {...register('phone', { required: 'Phone is required for members' })}
                />
                {errors.phone !== undefined && <p className="text-xs text-red-400">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy-200">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-navy-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="w-full h-11 pl-11 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password !== undefined && <p className="text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-navy-400">
                Already have an account?{' '}
                <a href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
