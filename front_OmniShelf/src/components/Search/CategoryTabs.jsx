const CategoryTabs = ({ category, setCategory }) => {
  const categories = [
    { id: 'all', label: 'Global' },
    { id: 'game', label: 'Jeux' },
    { id: 'manga', label: 'Mangas' },
    { id: 'vinyl', label: 'Vinyls' },
    { id: 'pop', label: 'Pops' },
  ];

  return (
    <div className="flex justify-center space-x-8 mb-6 overflow-x-auto no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => setCategory(cat.id)}
          className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative pb-2 ${
            category === cat.id ? 'text-accent' : 'text-text-dim hover:text-text-main'
          }`}
        >
          {cat.label}
          {category === cat.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full animate-in fade-in slide-in-from-left-2"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
