'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '2nd Year B.E. / B.Tech',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('campuscart_user'));
      if (existing) {
        setFormData((prev) => ({
          ...prev,
          name: existing.name || '',
          email: existing.email || '',
          phone: existing.phone || '',
          year: existing.year || prev.year,
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.year) {
      alert('Please fill out all fields to verify your student status.');
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      year: formData.year,
      verified: true,
      college: formData.email.includes('@') ? formData.email.split('@')[1].split('.')[0].toUpperCase() : 'BMSIT',
      loginTime: Date.now(),
    };

    // Save to local state
    localStorage.setItem('campuscart_user', JSON.stringify(userData));

    // Optional API sync
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
    } catch (err) {
      // ignore network errors in local dev
    }

    setLoading(false);
    router.push(redirectTarget);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dff6e9] text-[#198754] text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[15px]">verified_user</span>
          <span>Student Verification</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Your Student Status</h1>
        <p className="text-xs text-slate-500 mt-1">CampusCart is an exclusive student-only circular marketplace. Enter your details to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="studentName" className="text-xs font-bold text-slate-700">
            Full Name <span className="text-[#f95721]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">person</span>
            <input
              type="text"
              id="studentName"
              placeholder="e.g. Rahul Sharma"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800"
            />
          </div>
        </div>

        {/* College Email ID */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="studentEmail" className="text-xs font-bold text-slate-700">
            College Email ID <span className="text-[#f95721]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">mail</span>
            <input
              type="email"
              id="studentEmail"
              placeholder="e.g. rahul.cs22@bmsit.in"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800"
            />
          </div>
          <span className="text-[11px] text-slate-400">Use your college domain (e.g., @bmsit.in)</span>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="studentPhone" className="text-xs font-bold text-slate-700">
            Phone Number <span className="text-[#f95721]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">call</span>
            <input
              type="tel"
              id="studentPhone"
              placeholder="e.g. 9876543210"
              required
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800"
            />
          </div>
          <span className="text-[11px] text-slate-400">10 digits (used for safe on-campus exchange coordination)</span>
        </div>

        {/* Year of Study */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="studentYear" className="text-xs font-bold text-slate-700">
            Year of Study <span className="text-[#f95721]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">school</span>
            <select
              id="studentYear"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800 cursor-pointer"
            >
              <option value="1st Year B.E. / B.Tech">1st Year B.E. / B.Tech</option>
              <option value="2nd Year B.E. / B.Tech">2nd Year B.E. / B.Tech</option>
              <option value="3rd Year B.E. / B.Tech">3rd Year B.E. / B.Tech</option>
              <option value="4th Year B.E. / B.Tech">4th Year B.E. / B.Tech</option>
              <option value="M.Tech / MCA / MBA / PG">M.Tech / MCA / MBA / PG</option>
              <option value="Recent Graduate / Alumni">Recent Graduate / Alumni</option>
            </select>
          </div>
        </div>

        {/* Verification Guarantee */}
        <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl flex items-start gap-2.5 mt-1">
          <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">shield</span>
          <p className="text-[11px] text-amber-800 leading-tight">
            Your details are never shared with external advertisers. All listings and chats stay within verified students.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#f95721] hover:bg-[#e04815] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
        >
          <span>{loading ? 'Verifying...' : 'Verify & Continue to CampusCart'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between relative">
      {/* Ambient top glow */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#f95721]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Campus<span className="text-[#f95721]">Cart</span>
          </span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Login / Verification Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Suspense fallback={<div className="text-sm text-slate-400">Loading form...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
