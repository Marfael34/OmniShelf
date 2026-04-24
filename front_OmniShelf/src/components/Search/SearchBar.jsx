import { Search as SearchIcon, Loader2, X, Filter, ChevronDown } from "lucide-react";
import { useState } from "react";

const SearchBar = ({ query, setQuery, isFetching, placeholder, filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  return (
    <div className="relative group">
      <div className="relative flex items-center bg-bg-surface/80 backdrop-blur-2xl border border-white/5 rounded-full p-2 pl-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 focus-within:border-accent/30">
        <div className="flex items-center text-text-dim group-focus-within:text-accent transition-colors">
          {isFetching ? <Loader2 size={22} className="animate-spin" /> : <SearchIcon size={22} strokeWidth={2.5} />}
        </div>

        <input 
          type="text" 
          placeholder={placeholder}
          className="flex-1 bg-transparent text-text-main px-6 py-4 outline-none font-bold text-lg placeholder:text-text-dim/20 tracking-tight"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center space-x-2 mr-2">
          {query && <button type="button" onClick={() => setQuery("")} className="p-2 text-text-dim hover:text-white transition-colors"><X size={18} /></button>}
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          
          <button 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all ${isOpen ? 'bg-accent text-bg-main' : 'bg-white/5 text-text-dim hover:text-white'}`}
          >
            <Filter size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Filtres</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <button type="submit" className="bg-accent text-bg-main px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all shadow-lg shadow-accent/20">Explorer</button>
        </div>
      </div>

      {/* Dropdown Filters Integrated */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 p-6 bg-bg-surface/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-accent mb-2 block">Trier par</label>
                    <select className="w-full bg-bg-main border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-accent/30 appearance-none cursor-pointer" value={filters?.sortBy || ""} onChange={(e) => update('sortBy', e.target.value)}>
                        <option className="bg-bg-surface" value="">Par défaut</option>
                        <option className="bg-bg-surface" value="Nom (A-Z)">Nom (A-Z)</option>
                        <option className="bg-bg-surface" value="Nom (Z-A)">Nom (Z-A)</option>
                        <option className="bg-bg-surface" value="Meilleures Notes">Meilleures Notes</option>
                    </select>
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-accent mb-2 block">Genre</label>
                    <select className="w-full bg-bg-main border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-accent/30 appearance-none cursor-pointer" value={filters?.genre || ""} onChange={(e) => update('genre', e.target.value)}>
                        <option className="bg-bg-surface" value="">Tous</option>
                        {['RPG', 'Action', 'Aventure', 'Horreur'].map(g => <option key={g} className="bg-bg-surface" value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button onClick={() => setFilters({})} className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white transition-colors">Réinitialiser</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
