import { GraduationCap, MapPin, Leaf, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="w-full border-t border-slate-100 bg-white py-6 mt-auto scroll-mt-6">
      <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Pillar 1 */}
        <div className="flex items-center gap-3.5 px-2 md:px-6">
          <GraduationCap className="text-slate-700 w-[26px] h-[26px] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Student Only</h4>
            <p className="text-[11px] text-slate-500">Verified college students</p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="flex items-center gap-3.5 px-2 md:px-6 pt-4 md:pt-0">
          <MapPin className="text-slate-700 w-[26px] h-[26px] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Local &amp; Nearby</h4>
            <p className="text-[11px] text-slate-500">Within campus &amp; nearby hostels</p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="flex items-center gap-3.5 px-2 md:px-6 pt-4 md:pt-0">
          <Leaf className="text-slate-700 w-[26px] h-[26px] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Sustainable</h4>
            <p className="text-[11px] text-slate-500">Reuse, reduce waste</p>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="flex items-center gap-3.5 px-2 md:px-6 pt-4 md:pt-0">
          <Users className="text-slate-700 w-[26px] h-[26px] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Stronger Campus</h4>
            <p className="text-[11px] text-slate-500">Students helping students</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1300px] mx-auto px-6 mt-4 pt-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <p>© {new Date().getFullYear()} CampusCart • BMSIT Yelahanka Peer-to-Peer Marketplace</p>
        <p className="flex items-center gap-1">
          <span>Safe physical exchange at campus security &amp; library points</span>
        </p>
      </div>
    </footer>
  );
}
