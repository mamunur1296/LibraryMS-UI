import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BookOpen, Lock, User, Eye, EyeOff, Library } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { getAuthStore } from '../store/auth-store';

interface LoginFormValues {
  username: string;
  password: string;
}

export function LoginPage(): React.ReactElement {
  const store = getAuthStore();
  const { session, login, isLoading } = store();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '' },
  });

  if (session !== null && !session.isExpired()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    const error = await login(data.username, data.password);
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
      toast.error(error.message, { duration: 4000 });
      return;
    }
    toast.success('Welcome back!');
    void navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-amber-500 rounded-xl">
              <Library className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">LibraryMS</span>
          </div>
          <p className="text-navy-300 text-sm">Library Management System</p>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Manage Your
              <span className="block text-amber-400">Library Smarter</span>
            </h1>
            <p className="mt-4 text-lg text-navy-300 max-w-md leading-relaxed">
              Track books, manage members, handle borrows and reservations — all in one beautiful,
              professional dashboard.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📚', label: 'Book Catalog' },
              { icon: '👥', label: 'Member Management' },
              { icon: '🔄', label: 'Borrow & Return' },
              { icon: '📊', label: 'Reports & Analytics' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm font-medium text-navy-200">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-navy-500 text-xs">
          © {new Date().getFullYear()} LibraryMS. All rights reserved.
        </p>
      </motion.div>

      {/* Right Panel — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-16"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="p-2 bg-amber-500 rounded-xl">
              <Library className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LibraryMS</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center justify-center w-14 h-14 bg-amber-500/20 rounded-2xl mb-5 mx-auto border border-amber-400/30">
                <BookOpen className="h-7 w-7 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">Welcome back</h2>
              <p className="text-navy-300 text-sm text-center mt-1">
                Sign in to your LibraryMS account
              </p>
            </div>

            <form
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
              }}
              className="space-y-5"
              noValidate
            >
              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="login-username" className="text-sm font-medium text-navy-200">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-navy-400" />
                  <input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    {...register('username', { required: 'Username is required' })}
                  />
                </div>
                {errors.username !== undefined && (
                  <p className="text-xs text-red-400">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-navy-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-navy-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full h-11 pl-11 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-navy-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {errors.password !== undefined && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-navy-400">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
