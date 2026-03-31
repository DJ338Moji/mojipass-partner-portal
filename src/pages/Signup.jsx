import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, name);
      // AuthContext will automatically redirect them to /onboarding next
      navigate('/onboarding');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex flex-col items-center justify-center mb-8 gap-4">
        <Logo className="h-16" textColor="text-[var(--color-text)]" />
        <h2 className="text-center text-xl font-bold text-[var(--color-text-muted)]">
          Partner Network Signup
        </h2>
      </div>

      <div className="bg-[var(--card-bg)] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[var(--card-border)]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)]">Full Name / Creator Name</label>
            <div className="mt-1">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--card-border)] text-[var(--color-text)] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)]">Email address</label>
            <div className="mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--card-border)] text-[var(--color-text)] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)]">Password</label>
            <div className="mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--card-border)] text-[var(--color-text)] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-brand)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)] transition-all"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--color-brand)] hover:brightness-110">
              Sign in
            </Link>
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] opactiy-50">
          <Link to="/privacy" className="hover:text-[var(--color-brand)] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[var(--color-brand)] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
