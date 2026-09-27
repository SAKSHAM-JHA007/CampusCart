'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function InterestsPage() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('campuscart_user'));
      if (!user || !user.verified) {
        router.push('/login?redirect=/interests');
        return;
      }
      setStudent(user);

      const stored = JSON.parse(localStorage.getItem('campuscart_interests')) || [];
      setInterests(stored);
    } catch (e) {
      router.push('/login?redirect=/interests');
    }
  }, [router]);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = interests.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    setInterests(updated);
    localStorage.setItem('campuscart_interests', JSON.stringify(updated));
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between">
      <Header />

      <main className="w-full py-8 flex-1">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dff6e9] text-[#16a34a] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[16px]">handshake</span>
              <span>Campus Physical Handover</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Reserved Meetups &amp; Transactions
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track peer-to-peer exchanges and coordinate safe on-campus verification with fellow students.
            </p>
          </div>

          {interests.length === 0 ? (
            <div className="py-20 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto">
              <span className="material-symbols-outlined text-slate-300 text-[48px] mb-2">inbox</span>
              <h3 className="font-extrabold text-slate-900 text-lg">No Active Reservations</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                When you click "Express Interest" on an item, your safe meetup request appears here.
              </p>
              <button
                onClick={() => router.push('/buy')}
                className="inline-flex items-center gap-2 px-5 py-2.5 mt-5 bg-[#0284c7] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#0369a1] transition-all cursor-pointer"
              >
                <span>Browse Marketplace</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {interests.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#f95721] mb-1">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>₹{item.price}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                        {item.meetupSpot}
                      </span>
                      <span>Seller: <b>{item.seller}</b></span>
                      <span>Buyer: <b>{item.buyer}</b> ({item.buyerPhone || 'Verified'})</span>
                    </div>
                    {item.note && (
                      <p className="mt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 italic">
                        "{item.note}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full md:w-auto">
                    <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-center w-full md:w-auto">
                      {item.status}
                    </span>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'Completed & Exchanged ✅')}
                      className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white transition-colors cursor-pointer w-full md:w-auto text-center"
                    >
                      Mark Exchanged
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
