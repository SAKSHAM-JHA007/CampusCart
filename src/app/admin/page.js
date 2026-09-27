'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('campuscart_user'));
      setUser(u);
      const p = JSON.parse(localStorage.getItem('campuscart_products')) || [];
      setProducts(p);
      const i = JSON.parse(localStorage.getItem('campuscart_interests')) || [];
      setInterests(i);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleDeleteListing = (id) => {
    if (confirm('Admin Action: Delete this listing from CampusCart?')) {
      const updated = products.filter((item) => item.id !== id);
      setProducts(updated);
      localStorage.setItem('campuscart_products', JSON.stringify(updated));
    }
  };

  const handleClearAllTestData = () => {
    if (confirm('DANGER: Clear all testing and mock items from local database?')) {
      localStorage.setItem('campuscart_products', JSON.stringify([]));
      localStorage.setItem('campuscart_interests', JSON.stringify([]));
      setProducts([]);
      setInterests([]);
      alert('All test data cleared successfully!');
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between">
      <Header />

      <main className="w-full py-8 flex-1">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                <span>CampusCart Administration</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Campus Moderation Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Oversee listings, monitor peer exchanges, and maintain safety for BMSIT college domain.
              </p>
            </div>

            <button
              onClick={handleClearAllTestData}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Purge All Test &amp; Dummy Data</span>
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <span className="material-symbols-outlined text-[#f95721] text-[28px] mb-2">inventory</span>
              <div className="text-3xl font-extrabold text-slate-900">{products.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase mt-1">Active Live Listings</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <span className="material-symbols-outlined text-[#16a34a] text-[28px] mb-2">handshake</span>
              <div className="text-3xl font-extrabold text-slate-900">{interests.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase mt-1">Reserved Meetup Pings</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <span className="material-symbols-outlined text-[#0284c7] text-[28px] mb-2">verified_user</span>
              <div className="text-3xl font-extrabold text-slate-900">BMSIT</div>
              <div className="text-xs font-bold text-slate-400 uppercase mt-1">Designated Domain</div>
            </div>
          </div>

          {/* Live Listings Management Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center justify-between">
              <span>All Campus Listings</span>
              <span className="text-xs text-slate-400 font-normal">{products.length} items currently in feed</span>
            </h2>

            {products.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Feed is completely clean. No listings present.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Seller</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-bold text-slate-800 flex items-center gap-2">
                          <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="truncate max-w-[200px]">{item.title}</span>
                        </td>
                        <td className="py-3 text-slate-500">{item.category}</td>
                        <td className="py-3 font-extrabold text-slate-900">₹{item.price}</td>
                        <td className="py-3 text-slate-600">{item.seller}</td>
                        <td className="py-3 text-slate-500 truncate max-w-[150px]">{item.location ? item.location.split('/')[0] : 'Campus'}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteListing(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xs"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
