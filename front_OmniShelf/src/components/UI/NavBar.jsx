import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { User } from "lucide-react";
import QuickSearch from "./QuickSearch";
import CategoryLinks from "./CategoryLinks";

const NavBar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="h-20 bg-bg-main/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center space-x-12">
            <Link to="/" className="text-xl md:text-2xl font-black text-accent tracking-tighter italic leading-none shrink-0">
                OMNI<span className="text-text-main">SHELF</span>
            </Link>
            <CategoryLinks />
        </div>
        <div className="flex items-center space-x-4 md:space-x-8">
            <Link to="/my-collections" className="text-text-main/80 hover:text-accent transition-all font-black uppercase text-[10px] tracking-widest hidden xs:block">Collections</Link>
            <Link to="/wishlist" className="text-text-main/80 hover:text-accent transition-all font-black uppercase text-[10px] tracking-widest hidden xs:block">Wishlist</Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
            {isAuthenticated ? (
                <Link to="/profile" className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-bg-main transition-all"><User size={18} /></Link>
            ) : (
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Link to="/login" className="hidden sm:block text-text-main/70 hover:text-accent transition-colors font-black text-[10px] tracking-[0.2em]">LOG_IN</Link>
                    <Link to="/register" className="bg-accent text-bg-main px-6 py-2 rounded-xl font-black text-[10px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all uppercase leading-none">S'inscrire</Link>
                </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
