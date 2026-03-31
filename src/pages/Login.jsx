import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    if (!email) {
      return setError('Please enter your email address first.');
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setResetMessage('Check your inbox for further instructions');
    } catch (err) {
      setError('Failed to reset password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center py-12 px-4 selection:bg-emerald-500/30 font-sans">
      <div className="max-w-md w-full">

        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 flex items-center justify-center">
            <img src="/mojipass-logo.png" alt="Mojipass Logo" className="w-full h-full object-contain" onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg">M</div>';
            }} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2 italic">
            MOJI<span className="text-emerald-400">PASS</span>®
          </h1>
          <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px]">Partner Network Hub</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#16161D]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl p-10 relative overflow-hidden group">
          {/* Subtle Glow Background Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>

          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {showReset ? 'Reset Password' : 'Sign In'}
          </h2>

          {showReset ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <p className="text-gray-400 text-sm text-center mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm text-center">{error}</div>}
              {resetMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm text-center">📧 {resetMessage}</div>}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="text-emerald-400/60 hover:text-emerald-400 font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm text-center">{error}</div>}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-emerald-400/60 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-all"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                    placeholder="••••••••"
                    minLength="6"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                >
                  {loading ? 'Please wait...' : 'Sign In'}
                </button>
              </form>

              {/* Toggle Sign Up */}
              <div className="mt-8 text-center">
                <Link
                  to="/signup"
                  className="text-emerald-400 hover:text-emerald-300 font-black text-xs uppercase tracking-[0.2em] transition-all"
                >
                  New Partner? Apply to join the network
                </Link>
              </div>

              {/* Legal Links */}
              <div className="mt-10 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-700">
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
