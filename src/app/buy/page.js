'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, ShoppingBag, Store, PlusCircle, MapPin, X, ShieldCheck, Send } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '⚡ All Items' },
  { id: 'Books & Notes', label: '📚 Books & Notes' },
  { id: 'Hostel Essentials', label: '🛏️ Hostel Essentials' },
  { id: 'Appliances', label: '⚡ Appliances' },
  { id: 'Lab & Drafter', label: '📐 Lab & Drafter' },
  { id: 'Furniture', label: '🪑 Furniture' },
  { id: 'Donate', label: '🎁 Free / Donate' },
];

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [currentSort, setCurrentSort] = useState('newest');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Load products (purges any dummy test mock data)
  useEffect(() => {
    try {
      let stored = JSON.parse(localStorage.getItem('campuscart_products'));
      if (Array.isArray(stored)) {
        // filter out any old residual dummy IDs
        stored = stored.filter(p => p.id && p.id > 1000);
        localStorage.setItem('campuscart_products', JSON.stringify(stored));
        setProducts(stored);
      } else {
        setProducts([]);
      }
    } catch (e) {
      setProducts([]);
    }
  }, []);

  // Sync URL search params
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);

    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    const meetup = e.target.meetupSpot.value;
    const note = e.target.note.value;

    let student = null;
    try {
      student = JSON.parse(localStorage.getItem('campuscart_user'));
    } catch (err) {
      // ignore
    }

    if (!student || !student.verified) {
      router.push(`/login?redirect=${encodeURIComponent('/buy')}`);
      return;
    }

    const interestRecord = {
      id: Date.now(),
      productId: selectedItem.id,
      title: selectedItem.title,
      price: selectedItem.price,
      seller: selectedItem.seller,
      buyer: student.name,
      buyerPhone: student.phone,
      meetupSpot: meetup,
      note: note,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Awaiting Seller Confirmation',
    };

    let interests = [];
    try {
      interests = JSON.parse(localStorage.getItem('campuscart_interests')) || [];
    } catch (err) {
      interests = [];
    }
    interests.unshift(interestRecord);
    localStorage.setItem('campuscart_interests', JSON.stringify(interests));

    setSelectedItem(null);
    triggerToast(`Interest sent to ${selectedItem.seller}! Meetup spot: ${meetup.split('/')[0].trim()}`);
  };

  // Filter & sort products
  const filteredProducts = products.filter((item) => {
    const matchCat =
      activeCategory === 'all' ||
      item.category === activeCategory ||
      (activeCategory === 'Donate' && item.price === 0);
    const matchCond = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchCond && matchSearch;
  });

  if (currentSort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    filteredProducts.sort((a, b) => (b.created || 0) - (a.created || 0));
  }

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white text-sm rounded-2xl shadow-2xl border-l-4 border-[#f95721] animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e4f1ff] text-[#0284c7] text-xs font-bold uppercase tracking-wider w-fit">
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Direct Campus Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Browse Pre-Loved <span className="text-[#f95721]">Campus Essentials</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Verified textbooks, tech, dorm furniture, and appliances from fellow students right at BMSIT Yelahanka.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter & Results Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-slate-200/80 mb-8 bg-white/60 backdrop-blur-sm px-4 rounded-2xl">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
          <span className="text-slate-900 font-extrabold">
            Showing {filteredProducts.length} verified item{filteredProducts.length === 1 ? '' : 's'}
          </span>
          {searchQuery && (
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>"{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-amber-950 font-black">×</button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Condition Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Condition:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Recently Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-[#f95721] flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 shrink-0" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-xl">No Campus Listings Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
            All test data has been cleared. Be the very first student at BMSIT to post your pre-loved textbooks or hostel essentials!
          </p>
          <button
            onClick={() => router.push('/sell')}
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-[#f95721] hover:bg-[#e04815] text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-[18px] h-[18px] shrink-0" />
            <span>List an Item for Free (₹0)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const orig = item.originalPrice || item.price;
            const discount = orig > item.price ? Math.round(((orig - item.price) / orig) * 100) : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-800 shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-[13px] h-[13px] text-[#16a34a] shrink-0" />
                      <span>Verified</span>
                    </div>
                    {discount > 0 && item.price > 0 && (
                      <div className="absolute top-2.5 right-2.5 bg-[#16a34a] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                        {discount}% OFF
                      </div>
                    )}
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {item.condition}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-[#f95721] uppercase tracking-wider text-[10px]">{item.category}</span>
                    <span className="truncate max-w-[130px] flex items-center gap-0.5">
                      <MapPin className="w-[13px] h-[13px] shrink-0" />
                      {item.location ? item.location.split('/')[0].trim() : 'BMSIT Campus'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#f95721] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      {item.price === 0 ? (
                        <span className="text-[#16a34a]">FREE (Donation)</span>
                      ) : (
                        `₹${item.price.toLocaleString('en-IN')}`
                      )}
                    </div>
                    {item.originalPrice > item.price && item.price > 0 && (
                      <div className="text-[11px] text-slate-400 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-[#f95721] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Express Interest</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Express Interest Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-[18px] h-[18px] shrink-0" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-[#16a34a] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-[18px] h-[18px] shrink-0" />
              <span>Peer-to-Peer Safe Meetup</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">Request Physical Handover</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Coordinate safe on-campus inspection and payment with the senior before paying anything.
            </p>

            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl mb-4">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 truncate">{selectedItem.title}</h4>
                <div className="text-xs font-extrabold text-[#f95721]">
                  {selectedItem.price === 0 ? 'FREE (Donation)' : `₹${selectedItem.price.toLocaleString('en-IN')}`}
                </div>
                <div className="text-[11px] text-slate-400">Seller: {selectedItem.seller}</div>
              </div>
            </div>

            <form onSubmit={handleInterestSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700" htmlFor="meetupSpot">
                  Preferred On-Campus Safe Meetup Spot <span className="text-[#f95721]">*</span>
                </label>
                <select id="meetupSpot" name="meetupSpot" className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none">
                  <option value="BMSIT Library Lobby / Steps">BMSIT Library Lobby / Steps (Recommended Safe Spot)</option>
                  <option value="BMSIT Main Security Gate">BMSIT Main Security Gate</option>
                  <option value="Campus Central Canteen Area">Campus Central Canteen Area</option>
                  <option value="Boys Hostel Block 2 Entrance">Boys Hostel Block 2 Entrance</option>
                  <option value="Girls Hostel Gate">Girls Hostel Gate</option>
                  <option value="Admin Block Foyer">Admin Block Foyer</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700" htmlFor="note">
                  Note to Senior / Seller (Optional)
                </label>
                <input
                  type="text"
                  id="note"
                  name="note"
                  placeholder="e.g. Free today after 3:30 PM lab or during lunch break"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#f95721] hover:bg-[#e04815] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-[18px] h-[18px] shrink-0" />
                  <span>Send Reservation Ping to Seller</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyPage() {
  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between">
      <Header />
      <main className="w-full py-8 flex-1">
        <div className="max-w-[1300px] mx-auto px-6">
          <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading campus marketplace...</div>}>
            <BrowseContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
