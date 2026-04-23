import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const NavBar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="h-16 bg-surface/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 shadow-soft">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-black text-accent tracking-tighter italic">
                OMNI<span className="text-main">SHELF</span>
            </Link>
        </div>
        <div className="flex space-x-6 md:space-x-8 items-center">
            <Link to="/search" className="hidden sm:block text-main/80 hover:text-accent transition-all font-bold uppercase text-[10px] tracking-widest">Recherche</Link>
            <Link to="/my-collections" className="text-main/80 hover:text-accent transition-all font-bold uppercase text-[10px] tracking-widest">Collections</Link>
            <Link to="/wishlist" className="hidden sm:block text-main/80 hover:text-accent transition-all font-bold uppercase text-[10px] tracking-widest">Wishlist</Link>
            
            {isAuthenticated ? (
            <Link to="/profile" className="w-9 h-9 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-bg-main transition-all">
                <span className="font-black text-xs uppercase tracking-tighter">Me</span>
            </Link>
            ) : (
            <div className="flex space-x-2 md:space-x-4">
                <Link to="/login" className="hidden xs:block text-main hover:text-accent transition-colors font-bold text-[10px] tracking-widest px-2 py-2">LOG_IN</Link>
                <Link to="/register" className="bg-accent text-bg-main px-4 md:px-6 py-2 rounded-lg font-black text-[10px] tracking-widest hover:shadow-lg hover:shadow-accent/30 transition-all">SIGN_UP</Link>
            </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
