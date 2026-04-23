import { useState } from "react";
import { Link } from "react-router-dom";

const dummyWishlist = [
  {
    id: "w1",
    title: "Final Fantasy XVI",
    category: "game",
    added: "2023-10-01",
  },
  { id: "w2", title: "Berserk Tome 1", category: "manga", added: "2023-10-05" },
  {
    id: "w3",
    title: "Daft Punk - Discovery",
    category: "vinyl",
    added: "2023-10-10",
  },
];

const filters = [
  { id: "all", label: "Toutes" },
  { id: "game", label: "Jeux Vidéo" },
  { id: "manga", label: "Mangas" },
  { id: "vinyl", label: "Vinyles" },
  { id: "pop", label: "Figurines POP" },
];

const Wishlist = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems =
    activeFilter === "all"
      ? dummyWishlist
      : dummyWishlist.filter((item) => item.category === activeFilter);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-text-text-main">
            Wishlist Commune
          </h1>
          <p className="text-(--text-text-dim) mt-2">
            Retrouvez tous vos souhaits au même endroit.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-800">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap border-b-2 ${
              activeFilter === filter.id
                ? "border-(--color-accent) text-(--color-accent)"
                : "border-transparent text-(--text-text-dim) hover:text-text-text-main"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-(--bg-bg-surface) rounded-xl overflow-hidden border border-gray-800 flex items-center p-4 space-x-4"
          >
            <div className="w-20 h-20 bg-gray-800 rounded-lg shrink-0"></div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate text-text-text-main">
                {item.title}
              </h3>
              <p className="text-sm text-(--text-text-dim) uppercase tracking-wider">
                {item.category}
              </p>
            </div>
            <Link
              to={`/details/${item.category}/${item.id}`}
              className="p-2 bg-(--color-primary) text-(--color-accent) rounded-full hover:bg-(--color-accent) hover:text-(--bg-bg-main) transition-colors"
            >
              Voir
            </Link>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-(--text-text-dim)">
          Votre wishlist est vide pour cette catégorie.
        </div>
      )}
    </div>
  );
};

export default Wishlist;
