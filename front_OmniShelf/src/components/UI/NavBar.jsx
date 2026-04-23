import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const NavBar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-surface/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 shadow-soft">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-black text-accent tracking-tighter italic">OMNI<span className="text-main">SHELF</span></Link>
      </div>
      <div className="flex space-x-8 items-center">
        <Link to="/search" className="text-main/80 hover:text-accent transition-all font-bold uppercase text-[11px] tracking-widest">Recherche</Link>
        <Link to="/my-collections" className="text-main/80 hover:text-accent transition-all font-bold uppercase text-[11px] tracking-widest">Collections</Link>
        <Link to="/wishlist" className="text-main/80 hover:text-accent transition-all font-bold uppercase text-[11px] tracking-widest">Wishlist</Link>
        
        {isAuthenticated ? (
          <Link to="/profile" className="w-10 h-10 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-bg-main transition-all">
            <span className="font-black text-xs">OS</span>
          </Link>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-main hover:text-accent transition-colors font-bold text-xs tracking-widest px-4 py-2">LOG_IN</Link>
            <Link to="/register" className="bg-accent text-bg-main px-6 py-2 rounded-xl font-black text-xs tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20">SIGN_UP</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
