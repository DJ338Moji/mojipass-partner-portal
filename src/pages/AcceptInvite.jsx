import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/PasswordInput';
import { Sparkles, CheckCircle, Copy, Gift, DollarSign, Percent, ArrowRight, ExternalLink } from 'lucide-react';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, partnerData, acceptInviteSignup, acceptInviteExisting, login } = useAuth();

  // Parse invite parameters
  const rawCreator = searchParams.get('creator') || '';
  const cleanCreator = rawCreator.replace(/^@/, '').trim();
  const token = searchParams.get('token') || '';
  const dropId = searchParams.get('drop') || '';

  // Form State
  const defaultDisplayName = useMemo(() => {
    if (!cleanCreator) return '';
    return cleanCreator
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [cleanCreator]);

  const [name, setName] = useState(defaultDisplayName);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Mode for existing account sign in
  const [isExistingUserMode, setIsExistingUserMode] = useState(false);
  const [existingEmail, setExistingEmail] = useState('');
  const [existingPassword, setExistingPassword] = useState('');

  // Status & Success state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activatedData, setActivatedData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const vanityCode = useMemo(() => {
    const handle = cleanCreator || (name ? name.replace(/[^a-zA-Z0-9]/g, '') : 'VIP');
    return `MOJI-${handle.toUpperCase()}`;
  }, [cleanCreator, name]);

  const referralUrl = useMemo(() => {
    const handle = cleanCreator || encodeURIComponent(name || 'vip');
    return `https://renuiq.com?ref=mojipass&creator=${handle}`;
  }, [cleanCreator, name]);

  // Handle existing logged-in user activating the invite
  const handleActivateForLoggedInUser = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await acceptInviteExisting({
        creatorHandle: cleanCreator || partnerData?.name || user.email.split('@')[0],
        inviteToken: token,
        shippingAddress,
        dropId
      });
      setActivatedData(result);
    } catch (err) {
      setError(err.message || 'Failed to activate partnership.');
    } finally {
      setLoading(false);
    }
  };

  // Handle new user signup via invite
  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedTerms) {
      setError('Please agree to the Mojipass Partner Terms and FTC Disclosure guidelines.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { partnerDoc } = await acceptInviteSignup({
        email,
        password,
        name: name || cleanCreator || 'VIP Creator',
        creatorHandle: cleanCreator || name,
        inviteToken: token,
        shippingAddress,
        dropId
      });
      setActivatedData(partnerDoc);
    } catch (err) {
      setError(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign-in for existing account
  const handleExistingUserSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(existingEmail, existingPassword);
      // Once logged in, activate existing
      const result = await acceptInviteExisting({
        creatorHandle: cleanCreator,
        inviteToken: token,
        shippingAddress,
        dropId
      });
      setActivatedData(result);
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = activatedData?.referralUrl || referralUrl;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    const code = activatedData?.discountCode || vanityCode;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-center items-center py-12 px-4 selection:bg-emerald-500/30">
      <div className="max-w-2xl w-full">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            VIP Creator Partner Invitation
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            {cleanCreator ? (
              <>Welcome, <span className="text-emerald-400">@{cleanCreator}</span>!</>
            ) : (
              <>Welcome, <span className="text-emerald-400">Creator Partner</span>!</>
            )}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto">
            You have been exclusively invited to partner with <span className="text-white font-semibold">RenuIQ Skin Science</span> via Mojipass®.
          </p>
        </div>

        {/* Partnership Perks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-[#16161D]/80 border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Percent className="w-5 h-5" />
            </div>
            <div className="text-xl font-black text-white">15% Off</div>
            <div className="text-[11px] text-gray-400 font-medium">For your fans</div>
          </div>
          <div className="bg-[#16161D]/80 border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-xl font-black text-emerald-400">15% Cash</div>
            <div className="text-[11px] text-gray-400 font-medium">Per checkout</div>
          </div>
          <div className="bg-[#16161D]/80 border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Gift className="w-5 h-5" />
            </div>
            <div className="text-xl font-black text-white">Free Kit</div>
            <div className="text-[11px] text-gray-400 font-medium">5-Step Reset Kit</div>
          </div>
          <div className="bg-[#16161D]/80 border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xl font-black text-white">Instant</div>
            <div className="text-[11px] text-gray-400 font-medium">Auto-Attribution</div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#16161D]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {activatedData ? (
            /* Activated / Success View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 ring-8 ring-emerald-500/10 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                  Partnership Activated!
                </h2>
                <p className="text-gray-400 text-sm">
                  Your VIP creator tracking link and discount code are live and ready to share.
                </p>
              </div>

              {/* Link Card */}
              <div className="bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-left">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Referral Link</span>
                  <span className="text-xs text-emerald-400 font-semibold">15% Commission Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activatedData.referralUrl || referralUrl}
                    className="w-full bg-transparent text-sm text-white font-mono outline-none truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Discount Code Card */}
              <div className="bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-left">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Fan Discount Code</span>
                  <span className="text-xs text-emerald-400 font-semibold">15% Off RenuIQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activatedData.discountCode || vanityCode}
                    className="w-full bg-transparent text-sm text-white font-mono font-bold tracking-wider outline-none truncate"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="flex-shrink-0 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* PR Kit Notice */}
              {shippingAddress && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-left flex items-start gap-3">
                  <Gift className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-300">
                    <p className="font-bold text-white mb-0.5">Complimentary PR Kit Queued</p>
                    <p>Your 5-step RenuIQ Skin Barrier Reset Routine will be dispatched to your provided address.</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  Enter Partner Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={activatedData.referralUrl || referralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  Test On RenuIQ.com
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : user ? (
            /* Logged-In User Quick Activation */
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-left">
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                <p className="text-white font-mono text-sm">{user.email}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Shipping Address for Complimentary PR Routine Kit (Optional)
                </label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street Address, City, State, ZIP Code"
                  className="w-full px-4 py-3 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>

              <button
                onClick={handleActivateForLoggedInUser}
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Activating Partnership...' : `Activate Partnership as @${cleanCreator || 'Creator'}`}
              </button>
            </div>
          ) : isExistingUserMode ? (
            /* Sign in to existing account to claim invite */
            <form onSubmit={handleExistingUserSignIn} className="space-y-5">
              <h3 className="text-lg font-bold text-white mb-2">Sign In to Link Your Account</h3>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={existingEmail}
                  onChange={(e) => setExistingEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              <PasswordInput
                id="existingPassword"
                name="existingPassword"
                label="Password"
                value={existingPassword}
                onChange={(e) => setExistingPassword(e.target.value)}
                variant="dark"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Signing In...' : 'Sign In & Activate Partnership'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsExistingUserMode(false)}
                  className="text-emerald-400 text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Create a new creator account instead
                </button>
              </div>
            </form>
          ) : (
            /* New Creator Signup Form */
            <form onSubmit={handleNewUserSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Creator Handle</label>
                  <input
                    type="text"
                    readOnly={!!cleanCreator}
                    value={cleanCreator ? `@${cleanCreator}` : `@${name}`}
                    className="w-full px-4 py-3 bg-[#0B0B0F]/50 border border-white/10 rounded-2xl text-emerald-400 font-mono text-sm outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full / Creator Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@example.com"
                  className="w-full px-4 py-3 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordInput
                  id="password"
                  name="password"
                  label="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="dark"
                />
                <PasswordInput
                  id="passwordConfirm"
                  name="passwordConfirm"
                  label="Confirm Password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  variant="dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" />
                  Shipping Address for Free PR Routine Kit
                </label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street, Unit/Apt, City, State, ZIP Code (Where should we send your gift routine?)"
                  className="w-full px-4 py-3 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#0B0B0F] border border-white/5 rounded-2xl">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 rounded border-gray-700 bg-[#0B0B0F] text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                  I agree to the <Link to="/terms" className="text-white hover:underline">Mojipass Partner Terms</Link> and agree to clearly disclose affiliate links per FTC guidelines when sharing discounts with my audience.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Activating VIP Partnership...' : 'Accept Invitation & Activate 15% Code'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsExistingUserMode(true)}
                  className="text-gray-400 hover:text-emerald-400 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                >
                  Already have a Mojipass Partner account? <span className="underline text-emerald-400">Sign in to link</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-gray-600">
          Powered by Mojipass® Unified Commerce Network & RenuIQ Skin Science.
        </div>

      </div>
    </div>
  );
}
