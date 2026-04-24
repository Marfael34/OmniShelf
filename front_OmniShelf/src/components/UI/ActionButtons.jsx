import { useOptimistic, useActionState, useTransition } from "react";
import api from "../../services/api";
import { useUiStore } from "../../store/uiStore";

const ActionButtons = ({ externalId, category }) => {
  const showToast = useUiStore((state) => state.showToast);
  const [isPending, startTransition] = useTransition();

  // État optimiste pour le bouton "Collection" et "Wishlist"
  const [optimisticState, setOptimisticState] = useOptimistic(
    { inCollection: false, inWishlist: false },
    (state, newState) => ({ ...state, ...newState })
  );

  const openCollectionModal = useUiStore((state) => state.openCollectionModal);

  const [formState, formAction] = useActionState(async (prevState, formData) => {
    const type = formData.get("type"); // "wishlist"
    const isWishlist = type === "wishlist";

    try {
      await api.post("/collection_items", {
        externalProductId: String(externalId),
        category: category,
        isWishlist: isWishlist
      });
      showToast("Ajouté à votre wishlist !", "success");
      return { success: true, type };
    } catch (err) {
      console.error("Erreur", err);
      showToast("Une erreur est survenue lors de l'ajout.", "error");
      return { success: false, error: err.message };
    }
  }, { success: false });

  const handleAdd = (type) => {
    if (type === "collection") {
      openCollectionModal({ id: externalId, category });
      return;
    }

    startTransition(() => {
      setOptimisticState({ inWishlist: true });
      const formData = new FormData();
      formData.append("type", type);
      formAction(formData);
    });
  };

  const inWishlist = optimisticState.inWishlist || (formState.success && formState.type === "wishlist");

  return (
    <div className="flex space-x-4">
      <button 
        onClick={() => handleAdd("collection")}
        className="flex-1 font-bold py-4 rounded-2xl bg-accent text-bg-main hover:opacity-90 shadow-lg shadow-accent/20 transition-all active:scale-95"
      >
        Ajouter à la collection
      </button>
      <button 
        onClick={() => handleAdd("wishlist")}
        disabled={isPending || inWishlist}
        className={`flex-1 font-bold py-4 rounded-2xl transition-all border-2 ${
            inWishlist
            ? "bg-purple-600 border-purple-600 text-white cursor-default"
            : "border-accent text-accent hover:bg-accent hover:text-bg-main active:scale-95"
        }`}
      >
        {isPending && optimisticState.inWishlist ? "Ajout..." : inWishlist ? "Dans la Wishlist" : "Wishlist"}
      </button>
    </div>
  );
};

export default ActionButtons;
