import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import CampaignCard from '../components/CampaignCard';
import { Copy, CheckCircle, ExternalLink, Sparkles, Share2, Tag, Percent } from 'lucide-react';

export default function Dashboard() {
  const { user, partnerData } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cleanHandle = partnerData?.creatorHandle || partnerData?.name?.toLowerCase().replace(/\s+/g, '_') || '';
  const referralLink = partnerData?.referralUrl || (cleanHandle ? `https://renuiq.com?ref=mojipass&creator=${cleanHandle}` : 'https://renuiq.com?ref=mojipass');
  const discountCode = partnerData?.discountCode || (cleanHandle ? `MOJI-${cleanHandle.toUpperCase()}` : 'MOJI15');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Query active campaigns
        const q = query(
          collection(db, 'campaigns'), 
          where('status', '==', 'active')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedCampaigns = [];
        querySnapshot.forEach((doc) => {
          fetchedCampaigns.push({ id: doc.id, ...doc.data() });
        });
        
        // Let's sort manually since firing multiple indexed queries in Firebase requires composite indexes
        fetchedCampaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(fetchedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = selectedCategory === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Partner Referral & Attribution Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#16161D] to-teal-950/40 border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Active Brand Partnership: RenuIQ Skin Science
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Your Exclusive Referral Link & Code</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-md">15% Commission</span>
            </h2>
            <p className="text-sm text-gray-400">
              Share your link or coupon with your community. Every customer who checks out receives 15% off and automatically attributes to your partner wallet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Referral Link Copy */}
            <div className="bg-[#0B0B0F]/90 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <input
                type="text"
                readOnly
                value={referralLink}
                className="bg-transparent text-xs font-mono text-white w-48 sm:w-60 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
              >
                {copiedLink ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Link'}
              </button>
            </div>

            {/* Discount Code Copy */}
            <div className="bg-[#0B0B0F]/90 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-mono font-bold text-white">{discountCode}</span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
              >
                {copiedCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : 'Code'}
              </button>
              <a
                href={referralLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Test on Store"
                className="p-1 text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--card-border)] pb-5">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Campaign Marketplace</h1>
        <p className="text-lg text-[var(--color-text-muted)]">Discover sponsorships to promote to your audience and earn rewards.</p>
      </div>

      {/* Basic Filters */}
      <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-sm border border-[var(--card-border)] flex gap-4 overflow-x-auto">
        {['All', 'General', 'Apparel & Fashion', 'Beauty & Personal Care', 'Food & Beverage', 'Electronics & Tech'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' 
                : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-[var(--color-text-muted)]">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-brand)] border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading campaigns...
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-[var(--card-bg)] border text-center border-[var(--card-border)] border-dashed rounded-xl p-12">
          <div className="w-16 h-16 bg-[var(--color-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">No campaigns found</h3>
          <p className="text-[var(--color-text-muted)]">Try adjusting your category filter, or check back later for new sponsorships.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
