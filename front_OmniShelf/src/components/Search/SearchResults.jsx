import ProductCard from "../UI/ProductCard";
import { Loader2, ChevronDown, Search as SearchIcon } from "lucide-react";

const SearchResults = ({ 
    results, 
    isLoading, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage 
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <div key={i} className="bg-bg-surface rounded-2xl h-72 animate-pulse border border-gray-800"></div>
                ))}
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-24 bg-bg-surface rounded-3xl border-2 border-dashed border-gray-800">
                <SearchIcon size={64} className="mx-auto text-gray-700 mb-4" />
                <p className="text-xl text-text-dim font-bold">Lancez une recherche pour explorer le catalogue.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {results.map((item, idx) => (
                    <ProductCard key={`${item.category}-${item.id}-${idx}`} item={item} />
                ))}
            </div>
            
            {hasNextPage && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="bg-bg-surface border-2 border-gray-800 text-text-main px-8 py-4 rounded-2xl font-black flex items-center space-x-3 hover:border-accent transition-all group"
                    >
                        {isFetchingNextPage ? (
                            <Loader2 className="animate-spin text-accent" />
                        ) : (
                            <>
                                <span>CHARGER PLUS</span>
                                <ChevronDown className="group-hover:translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
