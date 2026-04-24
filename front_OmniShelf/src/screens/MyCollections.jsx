import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Library } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";
import CollectionFilters from "../components/UI/CollectionFilters";
import CreateCollectionModal from "../components/UI/CreateCollectionModal";

const staticFilters = [
  { id: "all", label: "Toutes" },
  { id: "game", label: "Jeux Vidéo" },
  { id: "manga", label: "Mangas" },
  { id: "vinyl", label: "Vinyles" },
  { id: "pop", label: "Figurines POP" },
  { id: "wishlist", label: "Ma Wishlist" },
];

const MyCollections = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { showToast } = useUiStore();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["collection", user?.id],
    queryFn: async () => {
      const res = await api.get(`/collection_items?user=/api/users/${user.id}`);
      return res.data['hydra:member'] || res.data['member'] || res.data || [];
    },
    enabled: !!user?.id,
  });

  const { data: custom = [] } = useQuery({
    queryKey: ["user_collections", user?.id],
    queryFn: async () => {
      const res = await api.get(`/user_collections`);
      return res.data['hydra:member'] || res.data['member'] || res.data || [];
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (name) => api.post("/user_collections", { name, user: `/api/users/${user.id}` }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_collections"] });
      showToast("Collection créée !", "success");
      setIsModalOpen(false);
    },
  });

  const allFilters = [...staticFilters, ...custom.map(c => ({ id: `custom-${c.id}`, label: c.name }))];
  const filtered = items.filter(item => {
    if (activeFilter === "wishlist") return item.isWishlist;
    if (activeFilter === "all") return !item.isWishlist;
    if (activeFilter.startsWith("custom-")) return item.collection?.id === parseInt(activeFilter.split("-")[1]);
    return item.category === activeFilter && !item.isWishlist;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h1 className="text-4xl font-black text-text-main tracking-tighter italic">MA <span className="text-accent">BIBLIOTHÈQUE</span></h1>
        <div className="flex items-center space-x-4">
          <Link to="/search" className="flex items-center space-x-2 bg-white/5 border border-white/10 text-text-main px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"><Plus size={16} /><span>Chercher</span></Link>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-accent text-bg-main px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/20"><span>Nouvelle Collection</span></button>
        </div>
      </div>

      <CollectionFilters filters={allFilters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-bg-surface rounded-3xl h-72 animate-pulse border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map(item => <ProductCard key={item.id} item={item} onDelete={(id) => api.delete(`/collection_items/${id}`).then(() => queryClient.invalidateQueries(["collection"]))} showDelete />)}
        </div>
      )}

      <CreateCollectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={createMutation.mutate} isPending={createMutation.isPending} />
    </div>
  );
};

export default MyCollections;
