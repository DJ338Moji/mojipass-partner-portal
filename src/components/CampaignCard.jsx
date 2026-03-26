import { Link } from 'react-router-dom';
import { DollarSign, Clock, Users, ExternalLink } from 'lucide-react';

export default function CampaignCard({ campaign }) {
  // Use a fallback category if undefined
  const category = campaign.category || 'General';
  
  return (
    <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--card-border)] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--color-bg)] rounded-lg flex items-center justify-center font-bold text-[var(--color-text-muted)] text-lg border border-[var(--card-border)]">
              {campaign.brandName?.charAt(0) || 'B'}
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text)] leading-tight">{campaign.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] font-medium">by {campaign.brandName || "Premium Brand"}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-brand)]/10 text-[var(--color-brand)] whitespace-nowrap">
            {campaign.trialType || 'Standard'}
          </span>
        </div>

        <p className="text-[var(--color-text-muted)] text-sm mb-6 line-clamp-2">
          {campaign.description || "No description provided."}
        </p>

        <div className="grid grid-cols-3 gap-4 py-4 border-t border-[var(--card-border)]">
          <div>
            <div className="flex items-center text-[var(--color-text-muted)] mb-1">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium uppercase tracking-wider">Budget</span>
            </div>
            <p className="font-semibold text-[var(--color-text)]">${campaign.sponsorBudget?.toLocaleString() || "N/A"}</p>
          </div>
          <div>
            <div className="flex items-center text-[var(--color-text-muted)] mb-1">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium uppercase tracking-wider">Duration</span>
            </div>
            <p className="font-semibold text-[var(--color-text)]">{campaign.duration || "Ongoing"}</p>
          </div>
          <div>
            <div className="flex items-center text-[var(--color-text-muted)] mb-1">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium uppercase tracking-wider">Max Trials</span>
            </div>
            <p className="font-semibold text-[var(--color-text)]">{campaign.maxTrials || "Unlimited"}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--color-bg)] px-6 py-4 border-t border-[var(--card-border)] flex justify-between items-center">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">{category}</span>
        <Link 
          to={`/campaign/${campaign.id}`}
          className="inline-flex items-center justify-center px-4 py-2 border border-[var(--card-border)] shadow-sm text-sm font-semibold rounded-md text-[var(--color-text-muted)] bg-[var(--card-bg)] hover:brightness-110 transition-colors"
        >
          View Details
          <ExternalLink className="w-4 h-4 ml-2 text-[var(--color-text-muted)]" />
        </Link>
      </div>
    </div>
  );
}
