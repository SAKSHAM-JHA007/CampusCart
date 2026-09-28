'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Store, Camera, Send, Eye, Footprints, MapPin, CheckCircle2 } from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Textbooks', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Electronics', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hostel/Mattress', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80' },
  { label: 'Kettle/Appliance', url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Study Table/Chair', url: 'https://images.unsplash.com/photo-1580481077195-731da01f3799?auto=format&fit=crop&w=600&q=80' },
  { label: 'Drafter/Kit', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80' },
];

export default function SellPage() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Books & Notes');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [location, setLocation] = useState('BMSIT Library Lobby / Steps');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
  const [publishedItem, setPublishedItem] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('campuscart_user'));
      if (!stored || !stored.verified) {
        router.push(`/login?redirect=${encodeURIComponent('/sell')}`);
      } else {
        setStudent(stored);
      }
    } catch (e) {
      router.push(`/login?redirect=${encodeURIComponent('/sell')}`);
    }
  }, [router]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Invalid file format. Please upload an image file (JPEG, PNG, or WebP).');
        return;
      }
      if (file.size > 500 * 1024) {
        alert('Image too large. Please select an image under 500 KB to preserve browser storage.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!student) {
      router.push(`/login?redirect=${encodeURIComponent('/sell')}`);
      return;
    }

    const numericPrice = parseFloat(price) || 0;
    const numericOrig = parseFloat(originalPrice) || numericPrice;

    if (!title.trim() || numericPrice < 0) {
      alert('Please enter a valid title and price.');
      return;
    }

    const newItem = {
      id: Date.now(),
      title: title.trim(),
      category: category,
      price: numericPrice,
      originalPrice: numericOrig,
      condition: condition,
      location: location,
      description: description.trim(),
      image: imageUrl,
      seller: student.name,
      sellerEmail: student.email,
      sellerPhone: student.phone,
      branch: `${student.year || 'Student'} • Verified`,
      created: Date.now(),
    };

    // Save to localStorage safely with quota protection
    let products = [];
    try {
      products = JSON.parse(localStorage.getItem('campuscart_products')) || [];
      products.unshift(newItem);
      localStorage.setItem('campuscart_products', JSON.stringify(products));
    } catch (err) {
      alert('Browser storage quota reached. Please list with a preset image instead of a custom upload.');
      return;
    }

    // Optional sync to backend API
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (err) {
      // ignore
    }

    setPublishedItem(newItem);
  };

  const parsedPrice = parseFloat(price) || 0;
  const parsedOrig = parseFloat(originalPrice) || 0;
  const discount = parsedOrig > parsedPrice && parsedPrice > 0 ? Math.round(((parsedOrig - parsedPrice) / parsedOrig) * 100) : 0;

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col justify-between">
      <Header />

      <main className="w-full py-8 flex-1">
        <div className="max-w-[1300px] mx-auto px-6">
          {/* Page Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dff6e9] text-[#16a34a] text-xs font-bold uppercase tracking-wider mb-2">
                <Store className="w-4 h-4 shrink-0" />
                <span>Student Seller Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                List Your Gear in <span className="text-[#f95721]">Minutes</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Sell or donate textbooks, dorm furniture, appliances, and drafters directly to juniors at BMSIT.
              </p>
            </div>
            {student && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse"></span>
                <span>Logged in as <b>{student.name}</b> ({student.year || 'Verified'})</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Form Area (7 cols) */}
            <form onSubmit={handlePublish} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col gap-6">
              
              {/* Item Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Item Title <span className="text-[#f95721]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VTU 3rd Sem CSE Textbooks + Lab Manuals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Category <span className="text-[#f95721]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="Books & Notes">📚 Books &amp; Notes</option>
                    <option value="Hostel Essentials">🛏️ Hostel Essentials</option>
                    <option value="Appliances">⚡ Appliances</option>
                    <option value="Lab & Drafter">📐 Lab &amp; Drafter</option>
                    <option value="Furniture">🪑 Furniture</option>
                    <option value="Donate">🎁 Free / Donate (₹0)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Condition <span className="text-[#f95721]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Like New', 'Good', 'Acceptable', 'Brand New'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCondition(c)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                          condition === c
                            ? 'bg-[#f95721] text-white shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing (INR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Your Price (₹) <span className="text-[#f95721]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 font-bold text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 450 (or 0 for donation)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-extrabold text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Original Price (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 font-bold text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 1400"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* On-Campus Meetup Spot */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Safe On-Campus Meetup Spot <span className="text-[#f95721]">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="BMSIT Library Lobby / Steps">BMSIT Library Lobby / Steps (Recommended Safe Spot)</option>
                  <option value="BMSIT Main Security Gate">BMSIT Main Security Gate</option>
                  <option value="Campus Central Canteen Area">Campus Central Canteen Area</option>
                  <option value="Boys Hostel Block 2 Entrance">Boys Hostel Block 2 Entrance</option>
                  <option value="Girls Hostel Gate">Girls Hostel Gate</option>
                  <option value="Admin Block Foyer">Admin Block Foyer</option>
                </select>
              </div>

              {/* Photo & Presets */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700">
                  Item Photo (Upload or Pick Preset)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    <Camera className="w-[18px] h-[18px] shrink-0" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-400">or choose a quick preset:</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_IMAGES.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        imageUrl === p.url
                          ? 'border-[#f95721] bg-orange-50 text-[#f95721]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Description &amp; Highlights
                </label>
                <textarea
                  rows="3"
                  placeholder="Mention edition, semester, condition, and when you are free on campus for handover."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#f95721] focus:bg-white transition-all font-medium text-slate-800"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#f95721] hover:bg-[#e04815] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-5 h-5 shrink-0" />
                  <span>Publish Listing to Feed (₹0 Free)</span>
                </button>
              </div>
            </form>

            {/* Right: Sticky Live Student Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                  <Eye className="w-5 h-5 text-[#f95721] shrink-0" />
                  <span>Live Student Preview</span>
                </div>
                <span className="text-xs text-slate-400">Updates as you type</span>
              </div>

              {/* PREVIEW CARD */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg flex flex-col gap-4">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                    <span>BMSIT</span>
                  </div>
                  {discount > 0 && (
                    <div className="absolute top-3 right-3 bg-[#16a34a] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {discount}% OFF
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    {condition}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="uppercase font-bold tracking-wider text-[#f95721]">{category}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[140px]">{location.split('/')[0].trim()}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 line-clamp-2 leading-snug">
                    {title.trim() || 'Untitled Campus Listing'}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-1">
                    <div className="text-2xl font-extrabold text-slate-900">
                      {parsedPrice === 0 ? <span className="text-[#16a34a]">FREE</span> : `₹${parsedPrice}`}
                    </div>
                    {parsedOrig > parsedPrice && parsedPrice > 0 && (
                      <div className="text-xs text-slate-400 line-through">
                        ₹{parsedOrig}
                      </div>
                    )}
                    <span className="text-[10px] text-[#16a34a] bg-[#dff6e9] px-2 py-0.5 rounded font-bold ml-auto">
                      Verified Deal
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {description.trim() || 'Add a quick description about condition, edition, or pickup availability...'}
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-[#f95721] font-bold text-xs flex items-center justify-center">
                      {student ? student.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="text-xs flex-1">
                      <div className="font-bold text-slate-800">{student ? student.name : 'Verified Student'}</div>
                      <div className="text-slate-400 text-[11px]">{student ? student.year : 'BMSIT Campus'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {publishedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#dff6e9] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 shrink-0" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Listing Live!</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              "{publishedItem.title}" has been published. Other students at BMSIT can now view and express interest.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/buy')}
                className="flex-1 py-3 rounded-xl bg-[#f95721] hover:bg-[#e04815] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                View on Marketplace
              </button>
              <button
                onClick={() => {
                  setPublishedItem(null);
                  setTitle('');
                  setPrice('');
                  setOriginalPrice('');
                  setDescription('');
                }}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                List Another
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
