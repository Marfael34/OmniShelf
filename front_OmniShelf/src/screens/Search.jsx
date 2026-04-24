import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { proxyService } from "../services/api/proxy";
import SearchHeader from "../components/Search/SearchHeader";
import SearchForm from "../components/Search/SearchForm";
import SearchFilters from "../components/Search/SearchFilters";
import SearchResults from "../components/Search/SearchResults";
import ThematicTags from "../components/Search/ThematicTags";

const Search = () => {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [terms, setTerms] = useState(params.get("q") || "");
  const [activeCat, setActiveCat] = useState(params.get("category") || "all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ publisher: "", genre: "", platform: "" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useInfiniteQuery({
    queryKey: ["search", terms, activeCat, filters],
    queryFn: ({ pageParam = 1 }) => proxyService.search(terms, activeCat, pageParam, filters),
    getNextPageParam: (last) => last.hasMore ? last.page + 1 : undefined,
    initialPageParam: 1,
  });

  const handleSearch = (q = query) => { setTerms(q); setActiveCat(category); };
  const handleTheme = (theme) => { setQuery(theme); handleSearch(theme); };

  const results = data?.pages.flatMap(p => p.data || []).filter(Boolean).sort((a, b) => {
    if (filters.sortBy === 'Nom (Z-A)') return (b.title || "").localeCompare(a.title || "");
    if (filters.sortBy === 'Meilleures Notes') return (b.rating || 0) - (a.rating || 0);
    return (a.title || "").localeCompare(b.title || "");
  }) || [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <SearchHeader />
      <SearchForm query={query} setQuery={setQuery} category={category} setCategory={setCategory} showFilters={showFilters} setShowFilters={setShowFilters} onSearch={(e) => { e.preventDefault(); handleSearch(); }} isFetching={isFetching} />
      {showFilters && category === 'game' && <SearchFilters setFilters={setFilters} />}
      
      <div className="pt-8">
        <h2 className="text-3xl font-black text-text-main mb-8">{terms ? "Résultats" : "Tendances"}</h2>
        {!terms && <ThematicTags onSelect={handleTheme} />}
        <SearchResults results={results} isLoading={isLoading} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />
      </div>
    </div>
  );
};

export default Search;
