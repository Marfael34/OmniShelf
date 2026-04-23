import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [searchTerms, setSearchTerms] = useState("");

  const { data: results = [], isLoading, isFetching } = useQuery({
    queryKey: ["search", searchTerms, category],
    queryFn: async () => {
      if (!searchTerms) return [];
      const res = await api.get(`/proxy/search?query=${searchTerms}&category=${category}`);
      return res.data.data;
    },
    enabled: !!searchTerms,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerms(query);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 px-4">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter text-main">
          Recherche <span className="text-accent">Avancée</span>
        </h1>
        <p className="text-xl text-dim font-medium">Explorez des millions de références (RAWG, Discogs, Google Books).</p>
        
        <form 
          onSubmit={handleSearch}
          className="flex bg-surface rounded-2xl border-2 border-gray-800 overflow-hidden shadow-2xl mt-8 focus-within:border-accent transition-all p-1"
        >
          <select 
            className="bg-gray-800 text-main px-6 py-4 outline-none border-r border-gray-700 font-bold rounded-xl"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Tout</option>
            <option value="game">Jeux</option>
            <option value="manga">Livres</option>
            <option value="vinyl">Vinyles</option>
          </select>
          <input 
            type="text" 
            placeholder="Titre, artiste, plateforme..."
            className="flex-1 bg-transparent text-main px-6 py-4 outline-none font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-accent text-bg-main px-10 py-4 font-black rounded-xl hover:opacity-90 transition-all flex items-center space-x-2"
          >
            {isFetching ? <Loader2 className="animate-spin" /> : <SearchIcon size={20} />}
            <span>CHERCHER</span>
          </button>
        </form>
      </div>

      <div className="pt-8">
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-main">
                {searchTerms ? `Résultats pour "${searchTerms}"` : "Dernières tendances"}
            </h2>
            {results.length > 0 && <span className="text-dim font-bold">{results.length} références trouvées</span>}
        </div>
        
        {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <div key={i} className="bg-surface rounded-2xl h-72 animate-pulse border border-gray-800"></div>
                ))}
            </div>
        ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {results.map((item, idx) => (
                    <ProductCard key={item.id || idx} item={item} />
                ))}
            </div>
        ) : (
            <div className="text-center py-24 bg-surface rounded-3xl border-2 border-dashed border-gray-800">
                <SearchIcon size={64} className="mx-auto text-gray-700 mb-4" />
                <p className="text-xl text-dim font-bold">Entrez un titre pour lancer la recherche multi-sources.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Search;

