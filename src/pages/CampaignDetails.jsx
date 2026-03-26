import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Link as LinkIcon, DollarSign, Clock, Users, CheckCircle2, Copy } from 'lucide-react';

export default function CampaignDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const handleGenerateLink = () => {
    // Phase 1 mechanism: Creates a tracking URL pointing to the core API (which we will build to handle redirects)
    // Local dev fallback URL for testing:
    const baseUrl = import.meta.env.DEV ? 'http://localhost:3000' : 'https://api.mojipass.com';
    const trackingUrl = `${baseUrl}/api/v1/redirect?campaignId=${campaign.id}&partnerId=${user.uid}`;
    
    setGeneratedLink(trackingUrl);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

    return (
      <div className="py-20 text-center text-[var(--color-text-muted)]">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-brand)] border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading campaign details...
      </div>
    );

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Campaign not found</h2>
        <p className="text-gray-500 mb-6">This campaign may have ended or been removed.</p>
        <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--card-border)] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-accent)] opacity-80"></div>
        
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-brand)]/10 text-[var(--color-brand)] uppercase tracking-wider">
                  {campaign.category || 'General'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] uppercase tracking-wider">
                  {campaign.trialType || 'Standard'}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--color-text)] mb-2 capitalize leading-tight">
                {campaign.title}
              </h1>
              <p className="text-lg text-[var(--color-text-muted)] font-medium">
                Sponsored by <span className="text-[var(--color-text)] font-bold">{campaign.brandName || "Premium Brand"}</span>
              </p>
            </div>
            
            <div className="w-full md:w-auto bg-[var(--color-bg)] rounded-xl p-6 border border-[var(--card-border)] flex-shrink-0 text-center">
               <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Pool</p>
               <p className="text-3xl font-black text-[var(--color-text)]">${campaign.sponsorBudget?.toLocaleString() || "0"}</p>
            </div>
          </div>

          <div className="prose max-w-none mb-10 text-[var(--color-text-muted)] text-lg">
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">The Offer & Pitch</h3>
            <p className="whitespace-pre-line">{campaign.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-10">
            <div>
              <div className="flex items-center text-[var(--color-text-muted)] mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold uppercase tracking-wider">Duration</span>
              </div>
              <p className="text-xl font-bold text-[var(--color-text)]">{campaign.duration || "Ongoing"}</p>
            </div>
            <div>
              <div className="flex items-center text-[var(--color-text-muted)] mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold uppercase tracking-wider">Max Trials (Total)</span>
              </div>
              <p className="text-xl font-bold text-[var(--color-text)]">{campaign.maxTrials || "Unlimited"}</p>
            </div>
          </div>

          <div className="bg-[var(--color-brand)]/5 rounded-2xl p-8 border border-[var(--color-brand)]/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Ready to promote this campaign?</h3>
                <p className="text-[var(--color-text-muted)]">Generate your unique tracking link below. Any trials registered through this link will be securely attributed to your partner account.</p>
              </div>
              
              {!generatedLink ? (
                <button
                  onClick={handleGenerateLink}
                  className="w-full md:w-auto flex-shrink-0 flex items-center justify-center py-4 px-8 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-[var(--color-brand)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)] transition-all transform hover:scale-105"
                >
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Generate Tracking Link
                </button>
              ) : (
                <div className="w-full md:w-auto flex-shrink-0">
                  <div className="bg-[var(--card-bg)] px-4 py-3 rounded-lg border border-[var(--card-border)] flex items-center shadow-inner">
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedLink}
                      className="bg-transparent border-none outline-none text-[var(--color-text-muted)] text-sm font-mono w-full md:w-64 truncate"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="ml-3 p-2 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  {copied && <p className="text-xs text-emerald-600 mt-2 text-right font-medium">Copied to clipboard!</p>}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
