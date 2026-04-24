import { Link } from "react-router-dom";
import { Home, Library, Heart } from "lucide-react";
import CategoryLinks from "./CategoryLinks";

const MobileMenu = ({ isAuthenticated, onClose }) => (
  <div className="lg:hidden absolute top-20 left-0 right-0 bg-bg-main/95 backdrop-blur-2xl border-b border-white/5 py-8 px-6 space-y-8 animate-in slide-in-from-top-4 duration-300">
    <div className="space-y-4">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Navigation</p>
      <div className="flex flex-col space-y-4" onClick={onClose}>
        <Link to="/" className="flex items-center space-x-4 text-lg font-black text-text-main uppercase tracking-tighter italic">
          <Home size={20} className="text-accent" />
          <span>Accueil</span>
        </Link>
        <div className="grid grid-cols-1 gap-4"><CategoryLinks isMobile /></div>
      </div>
    </div>

    <div className="space-y-4 pt-4 border-t border-white/5">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Ma Bibliothèque</p>
      <div className="flex flex-col space-y-4" onClick={onClose}>
        <Link to="/my-collections" className="flex items-center space-x-4 text-lg font-black text-text-main uppercase tracking-tighter italic">
          <Library size={20} className="text-accent" />
          <span>Collections</span>
        </Link>
        <Link to="/wishlist" className="flex items-center space-x-4 text-lg font-black text-text-main uppercase tracking-tighter italic">
          <Heart size={20} className="text-accent" />
          <span>Wishlist</span>
        </Link>
      </div>
    </div>

    {!isAuthenticated && (
      <div className="pt-8 flex flex-col space-y-4" onClick={onClose}>
        <Link to="/login" className="text-center p-4 rounded-xl border border-white/10 font-black uppercase text-xs tracking-widest text-text-main">Se connecter</Link>
        <Link to="/register" className="text-center p-4 rounded-xl bg-accent text-bg-main font-black uppercase text-xs tracking-widest">S'inscrire</Link>
      </div>
    )}
  </div>
);

export default MobileMenu;
