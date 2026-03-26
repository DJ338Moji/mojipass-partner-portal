import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import CampaignCard from '../components/CampaignCard';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
