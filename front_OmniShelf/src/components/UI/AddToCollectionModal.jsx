import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUiStore } from "../../store/uiStore";
import api from "../../services/api";
import { X, Plus, Folder, Loader2, Check } from "lucide-react";

const AddToCollectionModal = () => {
  const { isCollectionModalOpen, closeCollectionModal, selectedProduct, showToast } = useUiStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const queryClient = useQueryClient();

  // Fetch user collections
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["user_collections"],
    queryFn: async () => {
      const res = await api.get("/user_collections");
      return res.data["member"] || res.data["hydra:member"] || [];
    },
    enabled: isCollectionModalOpen,
  });

  const createCollectionMutation = useMutation({
    mutationFn: (name) => api.post("/user_collections", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_collections"] });
      setIsCreating(false);
      setNewCollectionName("");
      showToast("Collection créée !", "success");
    },
  });

  const addToCollectionMutation = useMutation({
    mutationFn: (collectionId) => {
      const payload = {
        externalProductId: String(selectedProduct.id || selectedProduct.externalProductId),
        category: selectedProduct.category,
        isWishlist: false,
      };
      if (collectionId) {
        payload.collection = `/api/user_collections/${collectionId}`;
      }
      return api.post("/collection_items", payload);
    },
    onSuccess: () => {
      showToast("Ajouté à la collection !", "success");
      closeCollectionModal();
    },
    onError: (err) => {
      showToast("Erreur lors de l'ajout.", "error");
      console.error(err);
    }
  });

  if (!isCollectionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeCollectionModal}></div>
      
      <div className="relative bg-surface border border-gray-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-zoom-in">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-xl font-black tracking-tighter uppercase">Ajouter à une collection</h2>
          <button onClick={closeCollectionModal} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : (
            <div className="grid gap-3">
              <button 
                onClick={() => addToCollectionMutation.mutate(null)}
                className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800/50 hover:bg-accent hover:text-bg-main transition-all group border border-gray-700/50 hover:border-accent"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center group-hover:bg-white/20">
                  <Folder size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Collection Principale</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest font-black">Défaut</p>
                </div>
              </button>

              {collections.map(col => (
                <button 
                  key={col.id}
                  onClick={() => addToCollectionMutation.mutate(col.id)}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800/50 hover:bg-accent hover:text-bg-main transition-all group border border-gray-700/50 hover:border-accent"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center group-hover:bg-white/20">
                    <Folder size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold">{col.name}</p>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest font-black">Collection perso</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {isCreating ? (
            <div className="p-4 rounded-2xl bg-gray-900 border border-accent/30 space-y-4">
              <input 
                type="text" 
                placeholder="Nom de la collection..."
                className="w-full bg-transparent border-b border-gray-700 focus:border-accent outline-none py-2 font-bold"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                autoFocus
              />
              <div className="flex space-x-2">
                <button 
                  onClick={() => createCollectionMutation.mutate(newCollectionName)}
                  className="flex-1 bg-accent text-bg-main py-2 rounded-xl font-bold flex items-center justify-center"
                  disabled={createCollectionMutation.isPending || !newCollectionName}
                >
                  {createCollectionMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : "Créer"}
                </button>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-800 rounded-xl font-bold"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 border-dashed border-gray-800 text-gray-500 hover:border-accent hover:text-accent transition-all font-bold"
            >
              <Plus size={20} />
              <span>Créer une nouvelle collection</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
