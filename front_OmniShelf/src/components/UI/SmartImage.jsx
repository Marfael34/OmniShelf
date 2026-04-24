import { useState } from "react";
import { Package } from "lucide-react";

const SmartImage = ({ src, alt, title, category }) => {
  const [error, setError] = useState(false);
  const [fallbackCount, setFallbackCount] = useState(0);

  // Tentative de recherche alternative simple (via une source d'image générique par titre)
  const fallbackUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(title + " " + category)}`;

  if (!src || error) {
    return (
      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-700 p-8 text-center space-y-4">
        {fallbackCount < 1 && src ? (
            <img 
                src={fallbackUrl} 
                alt={alt} 
                className="w-full h-full object-cover" 
                onError={() => { setError(true); setFallbackCount(1); }}
            />
        ) : (
            <>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5"><Package size={32} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No Preview</span>
            </>
        )}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      onError={() => setError(true)}
    />
  );
};

export default SmartImage;
