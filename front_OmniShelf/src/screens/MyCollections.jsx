import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";
import CollectionFilters from "../components/UI/CollectionFilters";
import CollectionHeader from "../components/UI/CollectionHeader";
import CreateCollectionModal from "../components/UI/CreateCollectionModal";

const staticFilters = [
  { id: "all", label: "Toutes" }, { id: "game", label: "Jeux Vidéo" }, { id: "manga", label: "Mangas" },
  { id: "vinyl", label: "Vinyles" }, { id: "pop", label: "Figurines POP" }, { id: "wishlist", label: "Ma Wishlist" }
];

const MyCollections = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { showToast } = useUiStore();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({ queryKey: ["collection", user?.id], queryFn: async () => (await api.get(`/collection_items?user=/api/users/${user.id}`)).data['hydra:member'] || [], enabled: !!user?.id });
  const { data: custom = [] } = useQuery({ queryKey: ["user_collections"], queryFn: async () => (await api.get(`/user_collections`)).data['hydra:member'] || [] });

  const deleteColMutation = useMutation({
    mutationFn: (id) => api.delete(`/user_collections/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["user_collections"] }); setActiveFilter("all"); showToast("Collection supprimée", "success"); }
  });

  const allFilters = [...staticFilters, ...custom.map(c => ({ id: `custom-${c.id}`, label: c.name }))];
  const filtered = items.filter(i => activeFilter === "wishlist" ? i.isWishlist : (activeFilter === "all" ? !i.isWishlist : (activeFilter.startsWith("custom-") ? i.collection?.id === parseInt(activeFilter.split("-")[1]) : (i.category === activeFilter && !i.isWishlist))));

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <CollectionHeader onNew={() => setIsModalOpen(true)} isCustom={activeFilter.startsWith("custom-")} onDeleteCustom={() => deleteColMutation.mutate(activeFilter.split("-")[1])} />
      <CollectionFilters filters={allFilters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      {isLoading ? <div className="grid grid-cols-2 md:grid-cols-5 gap-6">{[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-bg-surface rounded-3xl h-72 animate-pulse border border-white/5" />)}</div> :
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">{filtered.map(i => <ProductCard key={i.id} item={i} onDelete={(id) => api.delete(`/collection_items/${id}`).then(() => queryClient.invalidateQueries(["collection"]))} showDelete />)}</div>}
      <CreateCollectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={(name) => api.post("/user_collections", { name, user: `/api/users/${user.id}` }).then(() => queryClient.invalidateQueries(["user_collections"]))} isPending={false} />
    </div>
  );
};

export default MyCollections;
