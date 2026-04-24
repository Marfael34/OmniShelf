import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";

const filters = [
  { id: "all", label: "Toutes" },
  { id: "game", label: "Jeux Vidéo" },
  { id: "manga", label: "Mangas" },
  { id: "vinyl", label: "Vinyles" },
  { id: "pop", label: "Figurines POP" },
];

const Wishlist = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const user = useAuthStore((state) => state.user);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user.id}/collection_items`);
      return res.data.filter(item => item.isWishlist);
    },
    enabled: !!user?.id,
  });

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text-text-main tracking-tighter">
            Ma Wishlist
          </h1>
          <p className="text-(--text-text-dim) mt-2 font-medium">
            Retrouvez tous vos souhaits au même endroit.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeFilter === filter.id
                ? "bg-accent text-(--bg-bg-main) shadow-lg shadow-accent/20 scale-105"
                : "bg-(--bg-bg-surface) text-(--text-text-dim) hover:text-text-text-main border border-gray-800"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-(--bg-bg-surface) rounded-xl h-64 animate-pulse border border-gray-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12 text-(--text-text-dim)">
          Votre wishlist est vide pour cette catégorie.
        </div>
      )}
    </div>
  );
};

export default Wishlist;
