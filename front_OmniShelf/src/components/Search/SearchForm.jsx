import { Filter, Search as SearchIcon, Loader2, X } from "lucide-react";

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
        { id: 'all', label: 'Tout', icon: '🌟' },
        { id: 'game', label: 'Jeux Vidéo', icon: '🎮' },
        { id: 'manga', label: 'Mangas', icon: '📚' },
        { id: 'vinyl', label: 'Vinyles', icon: '💿' },
        { id: 'pop', label: 'Figurines POP', icon: '🧸' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 mt-12">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/5 w-fit mx-auto">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            category === cat.id 
                            ? 'bg-accent text-bg-main shadow-lg shadow-accent/20 scale-105' 
                            : 'text-text-dim hover:text-text-main hover:bg-white/5'
                        }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Search Bar */}
            <form onSubmit={onSearch} className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-accent/50 to-purple-500/50 rounded-4xl blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-700"></div>
                
                <div className="relative flex items-center bg-bg-surface/40 backdrop-blur-3xl rounded-4xl border border-white/10 p-2 shadow-2xl transition-all duration-500 group-focus-within:border-accent/50 group-focus-within:bg-bg-surface/60">
                    <div className="pl-6 text-text-dim group-focus-within:text-accent transition-colors">
                        <SearchIcon size={24} strokeWidth={2.5} />
                    </div>
                    
                    <input 
                        type="text" 
                        placeholder={`Chercher dans ${categories.find(c => c.id === category)?.label}...`}
                        className="flex-1 bg-transparent text-text-main px-6 py-6 outline-none font-bold text-lg placeholder:text-text-dim/30"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <div className="flex items-center pr-4 space-x-2">
                        {query && (
                            <button 
                                type="button"
                                onClick={() => setQuery("")}
                                className="p-3 text-text-dim hover:text-text-main transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                        
                        <div className="w-px h-8 bg-white/10 mx-2"></div>

                        <button 
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-4 rounded-2xl transition-all ${showFilters ? 'bg-accent text-bg-main shadow-lg shadow-accent/20' : 'text-text-dim hover:text-text-main hover:bg-white/5'}`}
                        >
                            <Filter size={20} />
                        </button>

                        <button 
                            type="submit"
                            disabled={isFetching}
                            className="bg-accent text-bg-main px-10 py-5 rounded-3xl font-black text-sm tracking-widest hover:scale-[1.02] active:scale-[0.95] transition-all disabled:opacity-50 shadow-xl shadow-accent/20 uppercase"
                        >
                            {isFetching ? <Loader2 className="animate-spin" /> : "Rechercher"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SearchForm;
