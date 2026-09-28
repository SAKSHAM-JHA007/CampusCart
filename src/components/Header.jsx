'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, PlusCircle, User, Handshake, ShieldCheck, LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [student, setStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('campuscart_user');
      if (stored) {
        setStudent(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/buy?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('campuscart_user');
    setStudent(null);
    setShowProfileMenu(false);
    router.push('/login');
  };

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-[1340px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#f95721] transition-transform group-hover:scale-105">
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

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link
            href="/"
            className={`pb-1 transition-colors ${pathname === '/' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Home
          </Link>
          <Link
            href="/buy"
            className={`pb-1 transition-colors ${pathname === '/buy' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Browse
          </Link>
          <Link
            href="/sell"
            className={`pb-1 transition-colors ${pathname === '/sell' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Sell
          </Link>
          <a
            href="#about"
            className="text-slate-500 hover:text-slate-900 transition-colors pb-1"
          >
            About
          </a>
        </nav>

        {/* Search & User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200/80 rounded-full px-4 py-2 w-72 lg:w-80 transition-all focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-sm">
            <Search className="w-[18px] h-[18px] text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search books, mattresses, appliances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Quick Sell CTA if on other pages */}
          {pathname !== '/sell' && (
            <Link
              href="/sell"
              className="hidden sm:flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#f95721] hover:bg-[#e04815] text-white font-bold text-xs shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Sell Gear</span>
            </Link>
          )}

          {/* User Profile / Auth State Button */}
          <div className="relative">
            <button
              onClick={() => {
                if (student) {
                  setShowProfileMenu(!showProfileMenu);
                } else {
                  router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                }
              }}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title={student ? `${student.name} (${student.year || 'Student'})` : 'Student Login'}
            >
              {student?.name ? (
                <span className="font-extrabold text-xs text-[#f95721]">
                  {student.name.trim().charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5 text-slate-600 shrink-0" />
              )}
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && student && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-sm text-slate-900 truncate">{student.name}</p>
                  <p className="text-xs text-slate-400 truncate">{student.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-[#16a34a] bg-[#dff6e9] px-2 py-0.5 rounded-full">
                    {student.year || 'Verified Student'}
                  </span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>My Profile &amp; Listings</span>
                </Link>
                <Link
                  href="/interests"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Handshake className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Reserved Meetups</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Campus Admin</span>
                </Link>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
