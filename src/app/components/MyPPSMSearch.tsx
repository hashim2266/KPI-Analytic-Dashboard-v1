import { useState } from 'react';
import { Search, ExternalLink, Sparkles, FileText, BookOpen } from 'lucide-react';

export function MyPPSMSearch() {
  const [query, setQuery] = useState('');

  const quickChips = ['Cuti', 'LNPT', 'Kenaikan Pangkat', 'Tatatertib', 'Elaun', 'Perjawatan'];
  const categories = ['Pekeliling', 'Surat Edaran', 'Garis Panduan', 'Dasar JPA'];

  // Simulates a search by opening the MyPPSM portal
  const handleSearch = (e?: React.FormEvent, term?: string) => {
    e?.preventDefault();
    const searchTerm = term || query;
    if (!searchTerm) return;
    
    // In a real app, this might hit an API or pass the query to the MyPPSM search URL
    window.open(`https://myppsm.jpa.gov.my/`, '_blank');
  };

  return (
    <div className="relative rounded-[24px] bg-glass-surface backdrop-blur-[24px] border border-glass-border shadow-[0_12px_32px_0_rgba(0,0,0,0.6)] overflow-hidden p-6 group transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_12px_40px_0_rgba(16,185,129,0.15)] flex flex-col h-full">
      
      {/* Premium embedded edge lighting */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      
      {/* Background radial glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Sparkles className="size-4 text-emerald-400" />
          </div>
          <h3 className="font-medium text-sm text-emerald-100 uppercase tracking-wide">Carian Pekeliling & Dasar</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-[10px] text-emerald-300/70 font-medium uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          MyPPSM Live
        </div>
      </div>

      {/* Main Search Input */}
      <form onSubmit={handleSearch} className="relative z-10 mb-6 group/search">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 rounded-xl blur-md opacity-0 group-hover/search:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center bg-[#020a06]/60 border border-emerald-800/40 rounded-xl overflow-hidden focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300">
          <div className="pl-4 pr-2">
            <Search className="size-5 text-emerald-400/70 group-focus-within/search:text-emerald-400 transition-colors" />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pekeliling, garis panduan, dasar..." 
            className="w-full bg-transparent border-none py-3.5 text-sm text-emerald-50 placeholder:text-emerald-100/30 focus:outline-none focus:ring-0 font-light tracking-wide"
          />
          <button 
            type="submit"
            className="px-5 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide uppercase border-l border-emerald-800/40 transition-colors flex items-center gap-2"
          >
            Cari
          </button>
        </div>
      </form>

      {/* Intelligent Quick Chips */}
      <div className="relative z-10 mb-6 flex-1">
        <p className="text-[10px] uppercase tracking-widest font-medium text-emerald-200/40 mb-3">Topik Popular</p>
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setQuery(chip);
                handleSearch(undefined, chip);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-100/70 hover:bg-emerald-900/50 hover:text-emerald-300 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Categories */}
      <div className="relative z-10 pt-4 border-t border-emerald-800/20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((cat, i) => (
            <button key={cat} onClick={() => window.open('https://myppsm.jpa.gov.my/', '_blank')} className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#020a06]/40 border border-emerald-900/30 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors group/cat">
              {i % 2 === 0 ? <FileText className="size-3 text-emerald-500/60 group-hover/cat:text-emerald-400" /> : <BookOpen className="size-3 text-emerald-500/60 group-hover/cat:text-emerald-400" />}
              <span className="text-[10px] font-medium text-emerald-100/50 group-hover/cat:text-emerald-200 uppercase tracking-wide">{cat}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}