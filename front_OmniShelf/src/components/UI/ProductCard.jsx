import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ExternalLink, Package } from "lucide-react";

const ProductCard = ({ item = {}, onDelete = null, showDelete = false }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      to={`/details/${item.category}/${item.externalProductId || item.id}`}
      className="group relative bg-bg-surface rounded-2xl overflow-hidden border border-gray-800 hover:border-accent transition-all duration-300 flex flex-col h-72 shadow-lg hover:shadow-accent/10 animate-zoom-in"
    >
      {showDelete && onDelete && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="absolute top-3 right-3 p-2 bg-red-900/50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all z-10 backdrop-blur-md"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="flex-1 overflow-hidden relative">
        {item.imageUrl && !imageError ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-700 p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent/20 group-hover:bg-accent/5 transition-all">
                <Package size={32} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No Preview</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
      </div>

      <div className="p-4 bg-bg-surface/50 backdrop-blur-sm space-y-1">
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent/70">
                {item.category === 'manga' ? 'Livre' : 
                 item.category === 'game' ? 'Jeu Vidéo' : 
                 item.category === 'pop' ? 'Figurine' : 
                 item.category === 'vinyl' ? 'Vinyle' : item.category}
            </span>
            {item.rating && (
                <span className="text-[10px] font-bold text-yellow-500">★ {item.rating.toFixed(1)}</span>
            )}
        </div>
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-accent transition-colors">
          {item.title || "Produit sans titre"}
        </h3>
        <p className="text-[10px] text-text-dim truncate">
            {item.metadata?.platform && <span className="text-accent/90">{item.metadata.platform}</span>}
            {item.metadata?.releaseYear && ` (${item.metadata.releaseYear})`}
            {(item.metadata?.platform || item.metadata?.releaseYear) && " • "}
            {item.author || item.metadata?.publisher || item.metadata?.genre || "OmniShelf Collection"}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
