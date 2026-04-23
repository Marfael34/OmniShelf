import { useState } from "react";
import api from "../../services/api";
import { useUiStore } from "../../store/uiStore";

const ActionButtons = ({ externalId, category }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const showToast = useUiStore((state) => state.showToast);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await api.post("/collection_items", {
        externalProductId: externalId,
        category: category
      });
      setSuccess(true);
      showToast("Ajouté à votre collection !", "success");
    } catch (err) {
      console.error("Erreur d'ajout", err);
      showToast("Une erreur est survenue lors de l'ajout.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const [isWishlisting, setIsWishlisting] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);

  const handleWishlist = async () => {
    setIsWishlisting(true);
    try {
      await api.post("/collection_items", {
        externalProductId: externalId,
        category: category,
        isWishlist: true
      });
      setWishlistSuccess(true);
      showToast("Ajouté à votre wishlist !", "success");
    } catch (err) {
      console.error("Erreur wishlist", err);
      showToast("Une erreur est survenue lors de l'ajout.", "error");
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <div className="flex space-x-4">
      <button 
        onClick={handleAdd}
        disabled={isAdding || success}
        className={`flex-1 font-bold py-3 rounded-xl transition-all ${
            success 
            ? "bg-green-600 text-white cursor-default" 
            : "bg-accent text-(--bg-main) hover:opacity-90 shadow-lg shadow-accent/20"
        }`}
      >
        {isAdding ? "Ajout..." : success ? "Possédé" : "Ajouter à la collection"}
      </button>
      <button 
        onClick={handleWishlist}
        disabled={isWishlisting || wishlistSuccess}
        className={`flex-1 font-bold py-3 rounded-xl transition-all border-2 ${
            wishlistSuccess
            ? "bg-purple-600 border-purple-600 text-white cursor-default"
            : "border-accent text-accent hover:bg-accent hover:text-(--bg-main)"
        }`}
      >
        {isWishlisting ? "Ajout..." : wishlistSuccess ? "Dans la Wishlist" : "Wishlist"}
      </button>
    </div>
  );
};

export default ActionButtons;
