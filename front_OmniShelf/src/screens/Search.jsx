import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { proxyService } from "../services/api/proxy";
import SearchForm from "../components/Search/SearchForm";
import SearchFilters from "../components/Search/SearchFilters";
import SearchResults from "../components/Search/SearchResults";

const Search = () => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlCat = searchParams.get("category") || "all";

  const [query, setQuery] = useState(urlQuery || "");
  const [category, setCategory] = useState(urlCat || "all");
  
  // Termes appliqués pour la recherche réelle
  const [searchTerms, setSearchTerms] = useState(urlQuery || "");
  const [activeCategory, setActiveCategory] = useState(urlCat || "all");
  
  const [showFilters, setShowFilters] = useState(false);
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ publisher: "", genre: "", platform: "" });

  // Sync with URL changes (e.g. from NavBar)
  if (urlQuery !== searchTerms && urlQuery !== "") {
    setSearchTerms(urlQuery);
    setQuery(urlQuery);
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, status } = useInfiniteQuery({
    queryKey: ["search", searchTerms, activeCategory, appliedFilters],
    queryFn: async ({ pageParam = 1 }) => {
      return proxyService.search(searchTerms, activeCategory, pageParam, appliedFilters);
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: true,
    initialPageParam: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerms(query);
    setActiveCategory(category);
    setAppliedFilters({ publisher, genre, platform });
    localStorage.setItem("lastSearchQuery", query);
    localStorage.setItem("lastSearchCategory", category);
  };

  const results = data?.pages.flatMap(page => page.data || []).filter(Boolean) || [];

  return (
    <div className="relative max-w-6xl mx-auto py-12 space-y-12 px-4 overflow-hidden">
      {/* Background flair */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 blur-[120px] -z-10 rounded-full"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] -z-10 rounded-full"></div>

      <div className="text-center space-y-4 max-w-3xl mx-auto relative">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-main animate-in fade-in slide-in-from-bottom-4 duration-700">
            Recherche <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-purple-400">Avancée</span>
        </h1>
        <p className="text-xl text-text-dim font-medium italic opacity-70 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Explorez des millions de références à travers l'univers.
        </p>
        <SearchForm query={query} setQuery={setQuery} category={category} setCategory={setCategory} showFilters={showFilters} setShowFilters={setShowFilters} onSearch={handleSearch} isFetching={isFetching} />
        {showFilters && category === 'game' && <SearchFilters publisher={publisher} setPublisher={setPublisher} genre={genre} setGenre={setGenre} platform={platform} setPlatform={setPlatform} />}
        {status === "error" && <div className="mt-8 p-6 bg-red-900/20 border border-red-500/50 rounded-3xl text-red-400 font-bold animate-shake text-center">Oups ! Erreur de recherche. <br /><span className="text-xs opacity-70">Vérifiez votre connexion réseau ou réessayez plus tard.</span></div>}
      </div>
      <div className="pt-8">
        <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black text-text-main">{searchTerms || appliedFilters.publisher ? "Résultats" : "Tendances"}</h2>{results.length > 0 && <span className="text-text-dim font-bold">{results.length} références</span>}</div>
        <SearchResults results={results} isLoading={isLoading} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />
      </div>
    </div>
  );
};

export default Search;
