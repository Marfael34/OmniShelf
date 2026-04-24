import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { User, Menu, X } from "lucide-react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

const NavBar = () => {
  const { isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="h-20 bg-bg-main/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 md:px-8">
        <Link to="/" className="text-xl md:text-2xl font-black text-accent tracking-tighter italic leading-none group">
            OMNI<span className="text-text-main group-hover:text-accent transition-colors">SHELF</span>
        </Link>

        <DesktopMenu isAuthenticated={isAuthenticated} />

        <div className="flex lg:hidden items-center space-x-4">
          {isAuthenticated && (
            <Link to="/profile" className="w-9 h-9 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent">
              <User size={16} />
            </Link>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-main hover:text-accent transition-colors">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu 
          isAuthenticated={isAuthenticated} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </nav>
  );
};

export default NavBar;
