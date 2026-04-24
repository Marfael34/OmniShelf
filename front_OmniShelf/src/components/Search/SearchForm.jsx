import { Filter, Search as SearchIcon, Loader2 } from "lucide-react";

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
    return (
        <form 
          onSubmit={onSearch}
          className="space-y-4 mt-8"
        >
          <div className="flex bg-bg-surface rounded-2xl border-2 border-gray-800 overflow-hidden shadow-2xl focus-within:border-accent transition-all p-1">
            <select 
                className="bg-gray-800 text-text-main px-4 md:px-6 py-4 outline-none border-r border-gray-700 font-bold rounded-xl text-xs md:text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="all">Tout</option>
                <option value="game">Jeux</option>
                <option value="manga">Livres</option>
                <option value="vinyl">Vinyles</option>
                <option value="pop">Figurines POP</option>
            </select>
            <input 
                type="text" 
                placeholder="Titre, série, univers..."
                className="flex-1 bg-transparent text-text-main px-4 md:px-6 py-4 outline-none font-medium text-sm md:text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 flex items-center justify-center transition-colors ${showFilters ? 'text-accent' : 'text-text-dim hover:text-text-main'}`}
            >
                <Filter size={20} />
            </button>
            <button 
                type="submit"
                className="bg-accent text-bg-main px-6 md:px-10 py-4 font-black rounded-xl hover:opacity-90 transition-all flex items-center space-x-2"
            >
                {isFetching ? <Loader2 className="animate-spin" /> : <SearchIcon size={20} />}
                <span className="hidden md:inline">CHERCHER</span>
            </button>
          </div>
        </form>
    );
};

export default SearchForm;
