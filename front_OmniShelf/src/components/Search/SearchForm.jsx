import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";

const SearchForm = ({ query, setQuery, category, setCategory, onSearch, isFetching, filters, setFilters }) => {
    const placeholder = `Chercher un ${category === 'all' ? 'produit' : category === 'game' ? 'jeu' : category}...`;

    return (
        <div className="w-full max-w-4xl mx-auto mt-20 relative px-4">
            <CategoryTabs category={category} setCategory={setCategory} />
            
            <form onSubmit={onSearch} className="space-y-4">
                <SearchBar 
                    query={query} 
                    setQuery={setQuery} 
                    isFetching={isFetching} 
                    placeholder={placeholder} 
                    filters={filters}
                    setFilters={setFilters}
                />
            </form>

            <div className="mt-8 flex justify-center space-x-12 opacity-30">
                 {['API Realtime', 'Cloud Sync'].map(tag => (
                     <div key={tag} className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest">
                        <span className="w-1 h-1 bg-accent rounded-full"></span>
                        <span>{tag}</span>
                     </div>
                 ))}
            </div>
        </div>
    );
};

export default SearchForm;
