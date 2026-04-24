import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUiStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import api from "../../services/api";
import { X, Plus, Loader2 } from "lucide-react";
import CollectionList from "./CollectionList";
import NewCollectionForm from "./NewCollectionForm";

const AddToCollectionModal = () => {
  const { isCollectionModalOpen, closeCollectionModal, selectedProduct, showToast } = useUiStore();
  const { user } = useAuthStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["user_collections"],
    queryFn: async () => (await api.get("/user_collections")).data["hydra:member"] || [],
    enabled: isCollectionModalOpen,
  });

  const createMutation = useMutation({
    mutationFn: (name) => api.post("/user_collections", { name, user: `/api/users/${user.id}` }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_collections"] });
      setIsCreating(false);
      setNewCollectionName("");
      showToast("Collection créée !", "success");
    },
  });

  const addMutation = useMutation({
    mutationFn: (colId) => api.post("/collection_items", {
      externalProductId: String(selectedProduct.id || selectedProduct.externalProductId),
      category: selectedProduct.category,
      isWishlist: false,
      collection: colId ? `/api/user_collections/${colId}` : null,
      user: `/api/users/${user.id}`
    }),
    onSuccess: () => { showToast("Ajouté !", "success"); closeCollectionModal(); },
    onError: () => showToast("Erreur lors de l'ajout.", "error")
  });

  if (!isCollectionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeCollectionModal}></div>
      <div className="relative bg-bg-surface border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-black tracking-tighter uppercase">Ajouter à une collection</h2>
          <button onClick={closeCollectionModal} className="text-text-dim hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" size={32} /></div> : <CollectionList collections={collections} onSelect={addMutation.mutate} />}
          {isCreating ? <NewCollectionForm name={newCollectionName} setName={setNewCollectionName} onCreate={() => createMutation.mutate(newCollectionName)} onCancel={() => setIsCreating(false)} isPending={createMutation.isPending} /> : 
          <button onClick={() => setIsCreating(true)} className="w-full flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 border-dashed border-white/10 text-text-dim hover:border-accent hover:text-accent transition-all font-bold"><Plus size={20} /><span>Créer une nouvelle collection</span></button>}
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
