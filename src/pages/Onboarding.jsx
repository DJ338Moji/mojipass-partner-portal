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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Category Focus</label>
            <select
              name="primaryCategory"
              value={formData.primaryCategory}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="0 - 10,000">0 - 10,000</option>
              <option value="10k - 50k">10,000 - 50,000</option>
              <option value="50k - 250k">50,000 - 250,000</option>
              <option value="250k - 1M">250,000 - 1,000,000</option>
              <option value="1M+">1,000,000+</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-1">Target Audience Demographics (Optional)</label>
           <textarea 
            name="targetAudience"
            rows={3}
            placeholder="e.g. Gen-Z fitness enthusiasts, Millennial moms, etc."
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Saving Profile...' : 'Complete Setup & Browse Campaigns'}
          </button>
        </div>
      </form>
    </div>
  );
}
