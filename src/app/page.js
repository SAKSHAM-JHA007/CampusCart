'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();

  const handleAction = (destination) => {
    try {
      const student = JSON.parse(localStorage.getItem('campuscart_user'));
      if (!student || !student.verified) {
        router.push(`/login?redirect=${encodeURIComponent(destination)}`);
      } else {
        router.push(destination);
      }
    } catch (e) {
      router.push(`/login?redirect=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white relative">
      <Header />

      {/* Hero Canvas Area with Ambient Subtle Gradients */}
      <main className="flex-1 relative overflow-hidden flex flex-col justify-center py-8 sm:py-12">
        {/* Radial Gradient Glows */}
        <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-[1300px] mx-auto px-6 w-full relative">
          
          {/* Hand-drawn Doodle 1 (Top Left): "Same Campus Same People" */}
          <div className="hidden lg:flex flex-col items-center absolute -top-2 left-6 pointer-events-none select-none -rotate-3">
            <div className="font-handwriting text-2xl sm:text-3xl text-amber-500 font-bold leading-tight tracking-wide text-center">
              Same<br/>Campus<br/>Same<br/>People
            </div>
            <svg width="80" height="14" viewBox="0 0 80 14" fill="none" className="text-amber-500 mt-1 stroke-current">
              <path d="M2 10C24 4 56 12 78 4" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Hand-drawn Doodle 2 (Top Right): "Pass it Forward 🙂" */}
          <div className="hidden lg:flex flex-col items-center absolute -top-2 right-12 pointer-events-none select-none rotate-3">
            <div className="font-handwriting text-2xl sm:text-3xl text-emerald-600 font-bold leading-tight tracking-wide text-center">
              Pass it<br/>Forward
            </div>
            <div className="font-handwriting text-2xl text-emerald-600 font-bold -mt-1">
              🙂
            </div>
            <svg width="70" height="12" viewBox="0 0 70 12" fill="none" className="text-emerald-600 stroke-current">
              <path d="M2 3C22 10 50 2 68 8" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Center Brand Text Hierarchy */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-block tracking-[0.25em] text-[11px] sm:text-xs font-extrabold text-slate-400 uppercase mb-3">
              BUY • SELL • DONATE
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1">
              <span>CampusCart</span>
              <span className="text-[#f95721] text-3xl sm:text-4xl">✦</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg font-bold text-slate-700">
              Pre-loved essentials. A better campus.
            </p>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Direct student-to-student marketplace for college dorms, textbooks, and campus life.
            </p>
          </div>

          {/* 3 Main Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1100px] mx-auto">
            
            {/* Card 1: BUY */}
            <div 
              onClick={() => handleAction('/buy')}
              className="action-card bg-[#f0f7ff] border border-[#d8ebff] rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-lg"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-white shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80" 
                  alt="Student study desk setup" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-[#0284c7] tracking-tight">BUY</h3>
                  <div className="arrow-btn w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0284c7] shadow-sm transition-transform">
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Affordable textbooks, electronics, mattresses, and hostel essentials from seniors.
                </p>
              </div>
            </div>

            {/* Card 2: SELL */}
            <div 
              onClick={() => handleAction('/sell')}
              className="action-card bg-[#f0fbf5] border border-[#d2f3e2] rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-lg"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-white shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" 
                  alt="Dorm room packing box" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-[#16a34a] tracking-tight">SELL</h3>
                  <div className="arrow-btn w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#16a34a] shadow-sm transition-transform">
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Turn your unused lab gear, furniture, and appliances into cash before moving out.
                </p>
              </div>
            </div>

            {/* Card 3: DONATE */}
            <div 
              onClick={() => handleAction('/buy?category=Donate')}
              className="action-card bg-[#fff5ed] border border-[#ffe0cc] rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-lg"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-white shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=600&q=80" 
                  alt="Community donation box drive" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-[#f95721] tracking-tight">DONATE</h3>
                  <div className="arrow-btn w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#f95721] shadow-sm transition-transform">
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Pass on items you no longer need and help a fellow student at zero cost.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
