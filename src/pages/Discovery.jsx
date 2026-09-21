import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Discovery() {
  const { user, partnerData } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [sentRequests, setSentRequests] = useState(new Set());

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // 1. Fetch brands
        const q = query(collection(db, 'merchants'), where('discoveryEnabled', '==', true));
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setBrands(fetched);

        // 2. Fetch existing requests by this partner to show 'Sent' status
        if (user) {
          const reqQuery = query(collection(db, 'synergy_requests'), where('partnerId', '==', user.uid));
          const reqSnap = await getDocs(reqQuery);
          const sent = new Set();
          reqSnap.forEach(doc => sent.add(doc.data().shop));
          setSentRequests(sent);
        }

      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [user]);

  const handleRequestSynergy = async (shop, brandName) => {
    if (!user || !partnerData) return alert("Please complete your profile first.");
    
    setRequestingId(shop);
    try {
      await addDoc(collection(db, 'synergy_requests'), {
        shop: shop,
        brandName: brandName || shop,
        partnerId: user.uid,
        partnerName: partnerData.name,
        partnerCategory: partnerData.primaryCategory,
        partnerScore: partnerData.synergyScore || 100,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setSentRequests(prev => new Set([...prev, shop]));
      alert(`Synergy request sent to ${brandName || shop}!`);
    } catch (error) {
      console.error("Error requesting synergy:", error);
      alert("Failed to send request. Please try again.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Discovery Engine</h1>
        <p className="mt-2 text-lg text-gray-600">Find brands that align with your niche and request a performance synergy.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          Scanning for brand synergies...
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Brands Found</h3>
          <p className="text-gray-600 mb-6">Be the first to join! New brands are added every hour.</p>
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors">
            Invite a Brand
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map(brand => (
            <div key={brand.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400">
                  {brand.name ? brand.name[0] : 'B'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{brand.name || brand.id}</h3>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{brand.category || 'General'}</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Commission</span>
                  <span className="font-bold text-gray-900">2.0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reward Offer</span>
                  <span className="font-bold text-gray-900">20% Off Code</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleRequestSynergy(brand.id, brand.name)}
                disabled={requestingId === brand.id || sentRequests.has(brand.id)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  sentRequests.has(brand.id) 
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {requestingId === brand.id ? 'Sending...' : sentRequests.has(brand.id) ? 'Request Sent' : 'Request Synergy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
