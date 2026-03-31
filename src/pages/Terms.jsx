import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans p-8 md:p-16 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="h-10" textColor="text-[var(--color-text)]" />
                        <span className="text-xl font-bold tracking-tighter border-l border-[var(--card-border)] pl-3">PARTNER</span>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[var(--color-brand)] hover:opacity-80 font-bold uppercase tracking-widest text-xs transition-opacity"
                    >
                        ← Back
                    </button>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 md:p-12 shadow-xl">
                    <h1 className="text-4xl font-black mb-4 tracking-tighter">Terms of Service</h1>
                    <p className="text-[var(--color-text-muted)] mb-12 font-medium">Partner Network Agreement • Last Updated: March 31, 2026</p>

                    <section className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-4">1. Network Participation</h2>
                            <p className="leading-relaxed opacity-90">By joining the Mojipass® Partner Network, you agree to promote sponsoring brands and merchants using only approved methods. Spam, fraudulent clicking, or misrepresenting rewards is strictly prohibited.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-4">2. Commission & Payments</h2>
                            <p className="mb-4 leading-relaxed opacity-90">Commissions are earned upon verified shopper redemptions. Mojipass® utilizes a guaranteed ledger system. Payouts are issued on a Net-30 basis, provided your account meets the minimum velocity threshold.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-4">3. Conduct & Branding</h2>
                            <p className="leading-relaxed opacity-90 text-[var(--color-text-muted)]">You may not use Mojipass® trademarks in any way that implies a direct endorsement or partnership outside the scope of the Network Agreement. We reserve the right to audit your promotional channels at any time.</p>
                        </div>

                        <div className="pt-12 border-t border-[var(--card-border)]">
                            <p className="text-sm text-[var(--color-text-muted)]">Legal Help: <span className="text-[var(--color-brand)] font-bold">legal@mojipass.com</span></p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
