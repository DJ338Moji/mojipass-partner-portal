import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import CampaignDetails from './pages/CampaignDetails';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Logo from './components/Logo';

// Simple nav wrapper for logged-in users
const AppLayout = ({ children }) => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col transition-colors duration-300">
      <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo className="h-12" textColor="text-[var(--color-text)]" />
              <span className="text-lg text-[var(--color-text-muted)] font-medium border-l border-[var(--card-border)] pl-3 mt-1 tracking-tight">
                Partner Hub
              </span>
            </div>
            {user && (
              <div className="flex items-center gap-6">
                <a
                  href="https://www.mojipass.com/resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-brand)] hover:brightness-110 font-bold flex items-center gap-1.5"
                >
                  <span className="text-base">🎓</span>
                  Learn
                </a>
                <span className="text-sm text-[var(--color-text-muted)]">{user.email}</span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-[var(--card-bg)] border-t border-[var(--card-border)] py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-[0.2em] italic opactiy-50">© 2026 Mojipass® Partner Hub</div>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-[10px] font-black text-[var(--color-text-muted)] hover:text-[var(--color-brand)] uppercase tracking-[0.2em] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[10px] font-black text-[var(--color-text-muted)] hover:text-[var(--color-brand)] uppercase tracking-[0.2em] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Route protection logic
const ProtectedRoute = ({ children }) => {
  const { user, loading, partnerData } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your session...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // If they are logged in but haven't finished onboarding, force them to onboarding
  if (partnerData && !partnerData.onboardingComplete && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Redirect logged-in users away from auth pages
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/signup" element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          } />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Protected Area */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <AppLayout><Onboarding /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/campaign/:id" element={
            <ProtectedRoute>
              <AppLayout><CampaignDetails /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Root Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/partners" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
