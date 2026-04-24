import { Filter, Search as SearchIcon, Loader2, X, ChevronDown } from "lucide-react";

const SearchForm = ({ 
    query, 
    setQuery, 
    category, 
    setCategory, 
    showFilters, 
    setShowFilters, 
    onSearch, 
    isFetching 
}) => {
    const categories = [
        { id: 'all', label: 'Global', icon: '🌟' },
        { id: 'game', label: 'Jeux', icon: '🎮' },
        { id: 'manga', label: 'Mangas', icon: '📚' },
        { id: 'vinyl', label: 'Vinyls', icon: '💿' },
        { id: 'pop', label: 'Pops', icon: '🧸' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mt-20 relative px-4">
            {/* Minimalist Floating Categories */}
            <div className="flex justify-center space-x-8 mb-6 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative pb-2 ${
                            category === cat.id ? 'text-accent' : 'text-text-dim hover:text-text-main'
                        }`}
                    >
                        {cat.label}
                        {category === cat.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full animate-in fade-in slide-in-from-left-2"></span>
                        )}
                    </button>
                ))}
            </div>

            <form onSubmit={onSearch} className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-accent/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative flex items-center bg-bg-surface/80 backdrop-blur-2xl border border-white/5 rounded-full p-2 pl-6 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500 group-focus-within:border-accent/30">
                    <div className="flex items-center text-text-dim group-focus-within:text-accent transition-colors">
                        {isFetching ? <Loader2 size={22} className="animate-spin" /> : <SearchIcon size={22} strokeWidth={2.5} />}
                    </div>

                    <input 
                        type="text" 
                        placeholder={`Chercher un ${categories.find(c => c.id === category)?.label.toLowerCase()}...`}
                        className="flex-1 bg-transparent text-text-main px-6 py-4 outline-none font-bold text-lg placeholder:text-text-dim/20 tracking-tight"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <div className="flex items-center space-x-2">
                        {query && (
                            <button 
                                type="button"
                                onClick={() => setQuery("")}
                                className="p-2 text-text-dim hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}

                        <div className="w-px h-6 bg-white/10 mx-2"></div>

                        <button 
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-3 rounded-full transition-all ${showFilters ? 'bg-accent text-bg-main' : 'text-text-dim hover:text-text-main hover:bg-white/5'}`}
                            title="Filtres"
                        >
                            <Filter size={18} />
                        </button>

                        <button 
                            type="submit"
                            className="bg-accent text-bg-main px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all shadow-lg shadow-accent/20"
                        >
                            Explorer
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-8 flex justify-center space-x-12 opacity-30">
                 <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest">
                    <span className="w-1 h-1 bg-accent rounded-full"></span>
                    <span>API Realtime</span>
                 </div>
                 <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest">
                    <span className="w-1 h-1 bg-accent rounded-full"></span>
                    <span>Cloud Sync</span>
                 </div>
            </div>
        </div>
    );
};

export default SearchForm;
