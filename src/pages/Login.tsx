import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthError = (error: any) => {
    if (error.message?.includes('Email not confirmed')) {
      toast.error('Please check your email to confirm your account before signing in');
    } else if (error.message?.includes('Invalid login credentials')) {
      toast.error('Invalid email or password');
    } else if (error.message?.includes('User already registered')) {
      toast.error('An account with this email already exists');
    } else {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showResetPassword) {
        await resetPassword(email);
        toast.success('Password reset instructions sent to your email');
        setShowResetPassword(false);
      } else if (isSignUp) {
        await signUp(email, password);
        toast.success('Check your email to confirm your account');
      } else {
        await signIn(email, password);
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl border border-purple-900">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-purple-300">
              Reset your password
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-10 py-3 border border-purple-900 bg-gray-800 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  loading
                    ? 'bg-purple-800 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Send reset instructions'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetPassword(false)}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Back to sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl border border-purple-900">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-purple-300">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-purple-900 bg-gray-800 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-purple-900 bg-gray-800 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading
                  ? 'bg-purple-800 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                isSignUp ? 'Sign up' : 'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;