import { useState } from "react";
import { Link } from "react-router-dom";

const dummyItems = [
  { id: "1", title: "The Legend of Zelda", category: "game" },
  { id: "2", title: "One Piece Vol. 1", category: "manga" },
  { id: "3", title: "Dark Side of the Moon", category: "vinyl" },
  { id: "4", title: "Iron Man #01", category: "pop" }
];

const filters = [
  { id: "all", label: "Toutes" },
  { id: "game", label: "Jeux Vidéo" },
  { id: "manga", label: "Mangas" },
  { id: "vinyl", label: "Vinyles" },
  { id: "pop", label: "Figurines POP" },
];

const MyCollections = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems = activeFilter === "all" 
    ? dummyItems 
    : dummyItems.filter(item => item.category === activeFilter);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-extrabold text-(--text-main)">Mes Collections</h1>
        <Link to="/search" className="bg-(--color-accent) text-(--bg-main) px-4 py-2 rounded-lg font-bold hover:opacity-90">
          + Ajouter un élément
        </Link>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter.id 
                ? "bg-(--color-accent) text-(--bg-main)" 
                : "bg-(--bg-surface) text-(--text-dim) hover:text-(--text-main)"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <Link 
            key={item.id} 
            to={`/details/${item.category}/${item.id}`}
            className="bg-(--bg-surface) rounded-xl overflow-hidden border border-gray-800 hover:border-(--color-accent) transition-colors flex flex-col h-64"
          >
            <div className="flex-1 bg-gray-800 flex items-center justify-center text-gray-500">
              Image Placeholder
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{item.title}</h3>
              <p className="text-sm text-(--text-dim) uppercase tracking-wider">{item.category}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-(--text-dim)">
          Aucun élément trouvé dans cette catégorie.
        </div>
      )}
    </div>
  );
};

export default MyCollections;
