import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const NavBar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="flex justify-between items-center p-4 bg-(--bg-surface) backdrop-blur-md sticky top-0 z-50 shadow-(--shadow-soft)">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-extrabold text-(--color-accent) tracking-tight">OmniShelf</Link>
      </div>
      <div className="flex space-x-6 items-center">
        <Link to="/search" className="text-(--text-main) hover:text-(--color-accent) transition-colors font-medium">Recherche</Link>
        <Link to="/my-collections" className="text-(--text-main) hover:text-(--color-accent) transition-colors font-medium">Mes Collections</Link>
        <Link to="/wishlist" className="text-(--text-main) hover:text-(--color-accent) transition-colors font-medium">Wishlist</Link>
        
        {isAuthenticated ? (
          <Link to="/profile" className="text-(--text-main) hover:text-(--color-accent) transition-colors font-medium">Profil</Link>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-(--text-main) hover:text-(--color-accent) transition-colors font-medium">Connexion</Link>
            <Link to="/register" className="bg-(--color-accent) text-(--bg-main) px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity">Inscription</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
