import { Search } from "lucide-react";

const QuickSearch = ({ quickQuery, setQuickQuery, onSubmit }) => {
    return (
        <form 
            onSubmit={onSubmit}
            className="flex-1 max-w-md hidden md:flex relative group"
        >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-dim group-focus-within:text-accent transition-colors">
                <Search size={16} />
            </div>
            <input 
                type="text"
                placeholder="Recherche rapide..."
                className="w-full bg-bg-surface/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-accent focus:bg-bg-surface/60 transition-all text-text-main placeholder:text-text-dim/50"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
            />
        </form>
    );
};

export default QuickSearch;
