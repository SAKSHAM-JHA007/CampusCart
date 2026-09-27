'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [myInterests, setMyInterests] = useState([]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('campuscart_user'));
      if (!user || !user.verified) {
        router.push('/login?redirect=/profile');
        return;
      }
      setStudent(user);

      // Load products listed by this user
      const products = JSON.parse(localStorage.getItem('campuscart_products')) || [];
      const userListings = products.filter((p) => p.sellerEmail === user.email || p.seller === user.name);
      setMyProducts(userListings);

      // Load user interests
      const interests = JSON.parse(localStorage.getItem('campuscart_interests')) || [];
      const userInterests = interests.filter((i) => i.buyer === user.name || i.seller === user.name);
      setMyInterests(userInterests);
    } catch (e) {
      router.push('/login?redirect=/profile');
    }
  }, [router]);

  const handleDeleteListing = (id) => {
    if (confirm('Are you sure you want to remove this listing?')) {
      const all = JSON.parse(localStorage.getItem('campuscart_products')) || [];
      const updated = all.filter((p) => p.id !== id);
      localStorage.setItem('campuscart_products', JSON.stringify(updated));
      setMyProducts(updated.filter((p) => p.sellerEmail === student.email || p.seller === student.name));
    }
  };

  if (!student) return null;

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between">
      <Header />

      <main className="w-full py-8 flex-1">
        <div className="max-w-[1100px] mx-auto px-6">
          
          {/* Profile Card Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-orange-100 text-[#f95721] font-extrabold text-3xl flex items-center justify-center shrink-0 shadow-inner">
              {student.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900">{student.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dff6e9] text-[#16a34a] text-xs font-bold w-fit mx-auto sm:mx-0">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Verified Student</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {student.email} • {student.phone}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-xl text-slate-700">
                  🏛️ BMS Institute of Technology
                </span>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-xl text-slate-700">
                  🎓 {student.year}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('campuscart_user');
                router.push('/login');
              }}
              className="py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>

          {/* Section: My Listings */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f95721] text-[22px]">inventory_2</span>
                <span>My Active Listings ({myProducts.length})</span>
              </h2>
              <button
                onClick={() => router.push('/sell')}
                className="py-2 px-3.5 rounded-xl bg-[#f95721] hover:bg-[#e04815] text-white text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>List New Item</span>
              </button>
            </div>

            {myProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500">You haven't listed any items yet.</p>
                <button
                  onClick={() => router.push('/sell')}
                  className="mt-3 text-xs font-bold text-[#f95721] hover:underline"
                >
                  + Sell textbooks or hostel gear now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {myProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <img src={p.image} alt={p.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                      <div className="text-[10px] font-bold text-[#f95721] uppercase">{p.category}</div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{p.title}</h4>
                      <div className="text-sm font-extrabold text-slate-900 mt-1">₹{p.price}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Active Live</span>
                      <button
                        onClick={() => handleDeleteListing(p.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Reserved Meetups */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#16a34a] text-[22px]">handshake</span>
              <span>My Meetup Reservations ({myInterests.length})</span>
            </h2>

            {myInterests.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500">No active meetup reservations yet.</p>
                <button
                  onClick={() => router.push('/buy')}
                  className="mt-3 text-xs font-bold text-[#0284c7] hover:underline"
                >
                  Browse campus essentials to express interest
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myInterests.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title} (₹{item.price})</div>
                      <div className="text-xs text-slate-500">
                        📍 Meetup Spot: <b>{item.meetupSpot}</b>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        With: {item.buyer === student.name ? `Seller: ${item.seller}` : `Buyer: ${item.buyer} (${item.buyerPhone})`}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
