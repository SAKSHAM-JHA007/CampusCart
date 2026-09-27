import { Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata = {
  title: 'CampusCart - Pre-loved essentials. A better campus.',
  description: 'Verified student circular marketplace for BMSIT and neighboring colleges. Buy, sell, or donate textbooks, hostel essentials, and appliances.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${caveat.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen flex flex-col justify-between selection:bg-[#ffece3] selection:text-[#f95721] text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
