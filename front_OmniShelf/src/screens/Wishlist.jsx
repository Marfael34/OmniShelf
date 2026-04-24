import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";
import WishlistFilters from "../components/UI/WishlistFilters";

const Wishlist = () => {
  const { user } = useAuthStore();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => (await api.get(`/collection_items?user=/api/users/${user.id}&isWishlist=true`)).data['hydra:member'] || [],
    enabled: !!user?.id,
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-text-main tracking-tighter uppercase italic">MA <span className="text-accent">WISHLIST</span></h1>
        <p className="text-text-dim font-medium max-w-xl mx-auto italic opacity-70">Tout ce dont vous rêvez, au même endroit.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-bg-surface rounded-3xl h-72 animate-pulse border border-white/5" />)}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map(item => <ProductCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/5 rounded-4xl border-2 border-dashed border-white/5">
          <p className="text-xl text-text-dim font-bold">Votre wishlist est vide pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
