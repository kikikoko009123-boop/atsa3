import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Home, User } from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';

export function AdminLogin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      setShowLoadingScreen(true);
    } catch (err: any) {
      if (isSignUp) {
        if (err.code === 'auth/email-already-in-use') {
          setError('This email already has an account. Please log in instead.');
        } else {
          setError(err.message || 'Failed to create account');
        }
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    setLoading(false);
    navigate('/');
  };


  return (
    <>
      {showLoadingScreen && <LoadingScreen onComplete={handleLoadingComplete} duration={2000} />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-scaleIn">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#3d4f5c] rounded-full flex items-center justify-center animate-fadeIn">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#3d4f5c] animate-fadeIn delay-100">
            {isSignUp ? 'Create Account' : 'Login'}
          </h2>
          <p className="text-gray-600 mt-2 animate-fadeIn delay-200">
            {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className={`${error.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} px-4 py-3 rounded-lg text-sm animate-fadeIn`}>
              {error}
            </div>
          )}

          {isSignUp && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          <div className="animate-fadeIn delay-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent transition"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="animate-fadeIn delay-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3d4f5c] focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3d4f5c] text-white py-3 rounded-lg font-semibold hover:bg-[#2d3f4c] transition disabled:opacity-50 animate-fadeIn delay-300"
          >
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3 animate-fadeIn delay-400">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-[#3d4f5c] hover:underline text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>

          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#3d4f5c] transition text-sm"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
