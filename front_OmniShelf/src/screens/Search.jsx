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
  const [terms, setTerms] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [filters, setFilters] = useState({ sortBy: "Nom (A-Z)", genre: "" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useInfiniteQuery({
    queryKey: ["search", terms, category, filters],
    queryFn: ({ pageParam = 1 }) => proxyService.search(terms, category, pageParam, filters),
    getNextPageParam: (last) => last.hasMore ? last.page + 1 : undefined,
    initialPageParam: 1,
  });

  const handleSearch = () => { setTerms(query); };

  const results = data?.pages.flatMap(p => p.data || []).filter(Boolean).sort((a, b) => {
    if (filters.sortBy === 'Nom (Z-A)') return (b.title || "").localeCompare(a.title || "");
    if (filters.sortBy === 'Meilleures Notes') return (b.rating || 0) - (a.rating || 0);
    return (a.title || "").localeCompare(b.title || "");
  }) || [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <SearchHeader />
      <SearchForm 
        query={query} 
        setQuery={setQuery} 
        category={category} 
        setCategory={setCategory} 
        onSearch={(e) => { e.preventDefault(); handleSearch(); }} 
        isFetching={isFetching} 
        filters={filters}
        setFilters={setFilters}
      />
      
      <div className="pt-8">
        <h2 className="text-3xl font-black text-text-main mb-8">{terms ? "Résultats" : "Tendances"}</h2>
        <SearchResults results={results} isLoading={isLoading} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />
      </div>
    </div>
  );
};

export default Search;
