const CollectionFilters = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-fade-right">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
            activeFilter === filter.id
              ? "bg-accent text-bg-main border-accent shadow-xl shadow-accent/20 scale-105"
              : "bg-bg-surface text-text-dim hover:text-text-main border-white/5 hover:border-white/20"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default CollectionFilters;
