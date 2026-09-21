import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Onboarding() {
  const { user, partnerData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: partnerData?.name || '',
    websiteUrl: '',
    primaryCategory: 'General',
    targetAudience: '',
    monthlyReach: '0 - 10,000'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error("Authentication error.");

      const partnerRef = doc(db, 'partners', user.uid);
      await updateDoc(partnerRef, {
        ...formData,
        onboardingComplete: true,
        updatedAt: new Date().toISOString()
      });

      // Navigate to dashboard. App.jsx will now pass them through since onboardingComplete is true
      // (a tiny delay helps the AuthContext state sync up)
      setTimeout(() => {
        navigate('/dashboard');
        // Force reload to sync auth context just in case
        window.location.reload();
      }, 500);

    } catch (err) {
      console.error(err);
      setError("Failed to save profile: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complete Your Profile</h1>
        <p className="mt-2 text-lg text-gray-600">Tell us about your audience so we can match you with the best campaigns.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Creator / Publication Name*</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            //Added text gray and caret black HERE
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 caret-black focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Website or Social Link*</label>
          <input
            type="url"
            name="websiteUrl"
            required
            placeholder="https://"
            value={formData.websiteUrl}
            onChange={handleChange}
            // ADDED text-gray-900 and caret black HERE
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 caret-black focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Category Focus</label>
            <select
              name="primaryCategory"
              value={formData.primaryCategory}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="General">General</option>
              <option value="Apparel & Fashion">Apparel & Fashion</option>
              <option value="Beauty & Personal Care">Beauty & Personal Care</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Electronics & Tech">Electronics & Tech</option>
              <option value="Home & Garden">Home & Garden</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Monthly Reach</label>
            <select
              name="monthlyReach"
              value={formData.monthlyReach}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="0 - 10,000">0 - 10,000</option>
              <option value="10k - 50k">10,000 - 50,000</option>
              <option value="50k - 250k">50,000 - 250,000</option>
              <option value="250k - 1M">250,000 - 1,000,000</option>
              <option value="1M+">1,000,000+</option>
            </select>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
          <h3 className="text-emerald-900 font-bold mb-2 flex items-center">
            <span className="mr-2">🧬</span> Synergy Score Initialization
          </h3>
          <p className="text-sm text-emerald-700 mb-4">Based on your reach and category, your starting Synergy Score is:</p>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-black text-emerald-600">100</div>
            <div className="flex-1 mx-4 h-3 bg-emerald-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '40%' }}></div>
            </div>
            <div className="text-sm font-bold text-emerald-500">Tier 1</div>
          </div>
          <p className="mt-3 text-xs text-emerald-600 italic">Your score increases with verified physical presence and retained sales conversions.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Payout Method</label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payoutMethod" value="PayPal" className="mr-2" defaultChecked />
              <span className="text-sm font-medium text-gray-900">PayPal</span>
            </label>
            <label className="flex-1 flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payoutMethod" value="Bank" className="mr-2" />
              <span className="text-sm font-medium text-gray-900">Direct Deposit</span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1 mr-3 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-600 leading-relaxed">
              I agree to the <strong>Mojipass® Partner Terms</strong> and the <strong>FTC Disclosure Requirements</strong>. I understand that I must clearly disclose my affiliate relationship with the merchant in all social posts and promotions.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Finalizing Synergy...' : 'Complete Setup & Browse Campaigns'}
          </button>
        </div>
      </form>
    </div>
  );
}
