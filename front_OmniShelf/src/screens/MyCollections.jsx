import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";

const filters = [
  { id: "all", label: "Toutes" },
  { id: "game", label: "Jeux Vidéo" },
  { id: "manga", label: "Mangas" },
  { id: "vinyl", label: "Vinyles" },
  { id: "pop", label: "Figurines POP" },
  { id: "wishlist", label: "Ma Wishlist" },
];

const MyCollections = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const showToast = useUiStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["collection", user?.id],
    queryFn: async () => {
      try {
        const res = await api.get(`/users/${user.id}/collection_items`);
        localStorage.setItem(`collection_${user.id}`, JSON.stringify(res.data));
        return res.data;
      } catch (err) {
        const cached = localStorage.getItem(`collection_${user.id}`);
        if (cached) return JSON.parse(cached);
        throw err;
      }
    },
    enabled: !!user?.id,
    initialData: () => {
      const cached = localStorage.getItem(`collection_${user?.id}`);
      return cached ? JSON.parse(cached) : undefined;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId) => api.delete(`/collection_items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection", user?.id] });
      showToast("Élément supprimé avec succès", "success");
    },
    onError: () => {
      showToast("Erreur lors de la suppression", "error");
    },
  });

  const filteredItems = items.filter((item) => {
    if (activeFilter === "wishlist") return item.isWishlist;
    if (activeFilter === "all") return !item.isWishlist;
    return item.category === activeFilter && !item.isWishlist;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-black text-text-text-main tracking-tighter">
          Mes Collections
        </h1>
        <Link
          to="/search"
          className="bg-accent text-(--bg-bg-main) px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
        >
          + Ajouter un élément
        </Link>
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
            <div
              key={i}
              className="bg-(--bg-bg-surface) rounded-xl overflow-hidden border border-gray-800 h-64 animate-pulse"
            >
              <div className="flex-1 bg-gray-800 h-40"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          key={activeFilter}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in animate-slide-up"
        >
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onDelete={(id) => deleteMutation.mutate(id)}
              showDelete={true}
            />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12 text-(--text-text-dim)">
          Aucun élément trouvé dans cette catégorie.
        </div>
      )}
    </div>
  );
};

export default MyCollections;
