import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, FolderPlus, Plus, X, Loader2, Library } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";

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
  const [newCollectionName, setNewCollectionName] = useState("");
  
  const showToast = useUiStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // Fetch items de la collection
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["collection", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user.id}/collection_items`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  // Fetch les collections personnalisées
  const { data: customCollections = [] } = useQuery({
    queryKey: ["user_collections", user?.id],
    queryFn: async () => {
      const res = await api.get(`/user_collections`);
      // API Platform GetCollection might need filtering if not handled by security/owner
      return res.data['member'] || res.data || [];
    },
    enabled: !!user?.id,
  });

  const createCollectionMutation = useMutation({
    mutationFn: (name) => api.post("/user_collections", { 
        name,
        user: `/api/users/${user.id}` 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_collections", user?.id] });
      showToast("Collection créée !", "success");
      setIsModalOpen(false);
      setNewCollectionName("");
    },
    onError: () => showToast("Erreur lors de la création", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId) => api.delete(`/collection_items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection", user?.id] });
      showToast("Élément supprimé", "success");
    },
  });

  const allFilters = [
    ...staticFilters,
    ...customCollections.map(c => ({ id: `custom-${c.id}`, label: c.name }))
  ];

  const filteredItems = items.filter((item) => {
    if (activeFilter === "wishlist") return item.isWishlist;
    if (activeFilter === "all") return !item.isWishlist;
    if (activeFilter.startsWith("custom-")) {
        const customId = parseInt(activeFilter.split("-")[1]);
        return item.collection?.id === customId;
    }
    return item.category === activeFilter && !item.isWishlist;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-4xl font-black text-text-main tracking-tighter italic">
            MA <span className="text-accent">BIBLIOTHÈQUE</span>
            </h1>
            <p className="text-text-dim text-sm font-medium tracking-wide">Gérez vos objets, créez vos propres étagères virtuelles.</p>
        </div>
        
        <div className="flex items-center space-x-4">
            <Link to="/search" className="flex items-center space-x-2 bg-white/5 border border-white/10 text-text-main px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                <Plus size={16} />
                <span>Trouver un objet</span>
            </Link>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-accent text-bg-main px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/20"
            >
                <FolderPlus size={16} />
                <span>Nouvelle Collection</span>
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-fade-right">
        {allFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
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

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-bg-surface rounded-2xl overflow-hidden border border-white/5 h-72 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div
          key={activeFilter}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
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
        <div className="flex flex-col items-center justify-center py-32 space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-text-dim/20">
            <Library size={40} />
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-text-dim italic uppercase tracking-widest">Vide</p>
            <p className="text-sm text-text-dim/60">Commencez à remplir cette section.</p>
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-bg-surface w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-text-main italic tracking-tighter">NOUVELLE <span className="text-accent">COLLECTION</span></h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-text-dim hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim ml-1">Nom de la collection</label>
                        <input 
                            autoFocus
                            type="text" 
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="Ex: Mes Mangas Favoris"
                            className="w-full bg-bg-main border border-white/5 rounded-2xl p-4 text-text-main focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-bold placeholder:text-text-dim/30"
                        />
                    </div>

                    <button
                        onClick={() => createCollectionMutation.mutate(newCollectionName)}
                        disabled={!newCollectionName || createCollectionMutation.isPending}
                        className="w-full bg-accent text-bg-main py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-accent/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:grayscale"
                    >
                        {createCollectionMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                        <span>Créer la Collection</span>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MyCollections;
