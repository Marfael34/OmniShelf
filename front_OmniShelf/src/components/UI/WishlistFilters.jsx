const WishlistFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: "all", label: "Toutes" },
    { id: "game", label: "Jeux Vidéo" },
    { id: "manga", label: "Mangas" },
    { id: "vinyl", label: "Vinyles" },
    { id: "pop", label: "Figurines POP" },
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
            activeFilter === filter.id
              ? "bg-accent text-bg-main shadow-lg shadow-accent/20 scale-105"
              : "bg-bg-surface text-text-dim hover:text-text-main border border-white/5"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default WishlistFilters;
