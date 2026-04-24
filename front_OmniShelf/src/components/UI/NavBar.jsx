import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { User, Menu, X } from "lucide-react";
import CategoryLinks from "./CategoryLinks";

const NavBar = () => {
  const { isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="h-20 bg-bg-main/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 md:px-8">
        {/* Logo - Toujours à gauche */}
        <Link to="/" className="text-xl md:text-2xl font-black text-accent tracking-tighter italic leading-none shrink-0 group">
            OMNI<span className="text-text-main group-hover:text-accent transition-colors">SHELF</span>
        </Link>

        {/* Desktop Navigation - Tout à droite */}
        <div className="hidden lg:flex items-center space-x-8">
            <CategoryLinks />
            <div className="flex items-center space-x-6">
                <Link to="/my-collections" className="text-text-main/70 hover:text-accent transition-all font-black uppercase text-[10px] tracking-widest">Collections</Link>
                <Link to="/wishlist" className="text-text-main/70 hover:text-accent transition-all font-black uppercase text-[10px] tracking-widest">Wishlist</Link>
            </div>
            
            <div className="h-4 w-px bg-white/10"></div>

            {isAuthenticated ? (
                <Link to="/profile" className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-bg-main transition-all">
                    <User size={18} />
                </Link>
            ) : (
                <div className="flex items-center space-x-6">
                    <Link to="/login" className="text-text-main/50 hover:text-accent transition-colors font-black text-[10px] tracking-[0.2em]">LOG_IN</Link>
                    <Link to="/register" className="bg-accent text-bg-main px-6 py-2 rounded-xl font-black text-[10px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all uppercase">S'inscrire</Link>
                </div>
            )}
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center space-x-4">
            {isAuthenticated && (
                <Link to="/profile" className="w-9 h-9 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent">
                    <User size={16} />
                </Link>
            )}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-text-main hover:text-accent transition-colors"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-bg-main/95 backdrop-blur-2xl border-b border-white/5 py-8 px-6 space-y-8 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Découvrir</p>
                <div className="grid grid-cols-2 gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <CategoryLinks isMobile />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">Ma Bibliothèque</p>
                <div className="flex flex-col space-y-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/my-collections" className="text-lg font-black text-text-main uppercase tracking-tighter italic">Collections</Link>
                    <Link to="/wishlist" className="text-lg font-black text-text-main uppercase tracking-tighter italic">Wishlist</Link>
                </div>
            </div>

            {!isAuthenticated && (
                <div className="pt-8 flex flex-col space-y-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/login" className="text-center p-4 rounded-xl border border-white/10 font-black uppercase text-xs tracking-widest text-text-main">Se connecter</Link>
                    <Link to="/register" className="text-center p-4 rounded-xl bg-accent text-bg-main font-black uppercase text-xs tracking-widest">S'inscrire</Link>
                </div>
            )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
