import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { User } from "lucide-react";
import QuickSearch from "./QuickSearch";
import CategoryLinks from "./CategoryLinks";

const NavBar = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    localStorage.setItem("lastSearchQuery", quickQuery);
    navigate(`/search?q=${encodeURIComponent(quickQuery)}`);
    setQuickQuery("");
  };

  return (
    <nav className="h-16 bg-bg-main/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 shadow-soft">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 md:px-6 gap-4">
        <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-black text-accent tracking-tighter italic leading-none shrink-0">
                OMNI<span className="text-text-main">SHELF</span>
            </Link>
        </div>
        <QuickSearch quickQuery={quickQuery} setQuickQuery={setQuickQuery} onSubmit={handleQuickSearch} />
        <div className="flex items-center space-x-1 md:space-x-4">
            <CategoryLinks />
            <Link to="/my-collections" className="text-text-main/80 hover:text-accent transition-all font-bold uppercase text-[10px] tracking-widest hidden xs:block">Collections</Link>
            <Link to="/wishlist" className="text-text-main/80 hover:text-accent transition-all font-bold uppercase text-[10px] tracking-widest hidden xs:block">Wishlist</Link>
            {isAuthenticated ? (
                <Link to="/profile" className="w-9 h-9 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center text-accent hover:bg-accent hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"><User size={18} /></Link>
            ) : (
                <div className="flex items-center space-x-2 md:space-x-3">
                    <Link to="/login" className="hidden sm:block text-text-main hover:text-accent transition-colors font-bold text-[11px] tracking-widest px-2">LOG_IN</Link>
                    <Link to="/register" className="bg-accent text-bg-main px-4 py-1.5 rounded-full font-black text-[11px] tracking-widest hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all uppercase leading-none">Sign Up</Link>
                </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
