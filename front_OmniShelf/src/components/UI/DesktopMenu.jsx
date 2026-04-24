import { Link } from "react-router-dom";
import { User, Home, Library, Heart } from "lucide-react";
import CategoryLinks from "./CategoryLinks";

const DesktopMenu = ({ isAuthenticated }) => (
  <div className="hidden lg:flex items-center space-x-8">
    <Link to="/" className="flex items-center space-x-2 text-text-main/70 hover:text-accent transition-all group">
      <Home size={14} className="group-hover:scale-110 transition-transform" />
      <span className="font-black uppercase text-[10px] tracking-widest">Accueil</span>
    </Link>
    
    <CategoryLinks />

    <div className="flex items-center space-x-6">
      <Link to="/my-collections" className="flex items-center space-x-2 text-text-main/70 hover:text-accent transition-all group">
        <Library size={14} className="group-hover:scale-110 transition-transform" />
        <span className="font-black uppercase text-[10px] tracking-widest">Collections</span>
      </Link>
      <Link to="/wishlist" className="flex items-center space-x-2 text-text-main/70 hover:text-accent transition-all group">
        <Heart size={14} className="group-hover:scale-110 transition-transform" />
        <span className="font-black uppercase text-[10px] tracking-widest">Wishlist</span>
      </Link>
    </div>
    
    {isAuthenticated ? (
      <Link to="/profile" className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-bg-main transition-all">
        <User size={18} />
      </Link>
    ) : (
      <div className="flex items-center space-x-6">
        <Link to="/login" className="text-text-main/50 hover:text-accent font-black text-[10px] tracking-[0.2em]">LOG_IN</Link>
        <Link to="/register" className="bg-linear-to-r from-accent to-accent/80 text-bg-main px-6 py-2 rounded-xl font-black text-[10px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all uppercase">S'inscrire</Link>
      </div>
    )}
  </div>
);

export default DesktopMenu;
