'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Trash2, Lock, Package, Handshake, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('campuscart_user'));
      if (!u || !u.verified) {
        router.push('/login?redirect=/admin');
        return;
      }
      setUser(u);
      
      // Auto-unlock if user has admin role
      if (u.role === 'admin' || u.email?.toLowerCase().startsWith('admin@') || sessionStorage.getItem('campuscart_admin_auth') === 'true') {
        setIsAdminAuthenticated(true);
      }

      const p = JSON.parse(localStorage.getItem('campuscart_products')) || [];
      setProducts(p);
      const i = JSON.parse(localStorage.getItem('campuscart_interests')) || [];
      setInterests(i);
    } catch (e) {
      router.push('/login?redirect=/admin');
    }
  }, [router]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Default admin passkey for campus moderation
    if (adminPasskey === 'campusAdmin2026' || adminPasskey === 'admin123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('campuscart_admin_auth', 'true');
      setPasskeyError('');
    } else {
      setPasskeyError('Invalid admin passkey. Authorization denied.');
    }
  };

  const handleDeleteListing = (id) => {
    if (!isAdminAuthenticated) {
      alert('Unauthorized: You must unlock admin permissions first.');
      return;
    }
    if (confirm('Admin Action: Delete this listing from CampusCart?')) {
      const updated = products.filter((item) => item.id !== id);
      setProducts(updated);
      localStorage.setItem('campuscart_products', JSON.stringify(updated));
    }
  };

  const handleClearAllTestData = () => {
    if (!isAdminAuthenticated) {
      alert('Unauthorized: You must unlock admin permissions first.');
      return;
    }
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
                <ShieldAlert className="w-4 h-4 shrink-0" />
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
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>Purge All Test &amp; Dummy Data</span>
            </button>
          </div>

          {!isAdminAuthenticated ? (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg text-center mt-12">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 shrink-0" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Admin Authentication Required</h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Listing moderation and data controls on CampusCart require campus administration authorization.
              </p>
              <form onSubmit={handleAdminLogin} className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="Enter Admin Security Passkey"
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-medium"
                />
                {passkeyError && <p className="text-xs text-red-500 font-semibold">{passkeyError}</p>}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  Unlock Moderation Console
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                  <Package className="text-[#f95721] w-7 h-7 mb-2" />
                  <div className="text-3xl font-extrabold text-slate-900">{products.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase mt-1">Active Live Listings</div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                  <Handshake className="text-[#16a34a] w-7 h-7 mb-2" />
                  <div className="text-3xl font-extrabold text-slate-900">{interests.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase mt-1">Reserved Meetup Pings</div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                  <ShieldCheck className="text-[#0284c7] w-7 h-7 mb-2" />
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
