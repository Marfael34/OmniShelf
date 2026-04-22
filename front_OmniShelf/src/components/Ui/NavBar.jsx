import { Link } from "react-router-dom";
import { create } from "zustand";

// NOTE: J'ai simulé ce store pour permettre la compilation.
// À remplacer par l'import de votre véritable store d'authentification Zustand (ex: useAuthStore)
const useMockAuthStore = create((set) => ({
  isAuthenticated: false, // Passer à true pour tester l'affichage conditionnel
}));

export const NavBar = () => {
  const { isAuthenticated } = useMockAuthStore();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 border-b border-green-500/30 shadow-[0_0_15px_rgba(0,255,128,0.5)]">
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wider text-green-400 drop-shadow-[0_0_5px_rgba(0,255,128,0.8)]"
        >
          OmniShelf
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/search"
              className="text-gray-300 hover:text-green-300 transition-colors"
            >
              Recherche
            </Link>
          </li>
          <li>
            <Link
              to="/wishlist"
              className="text-gray-300 hover:text-green-300 transition-colors"
            >
              Wishlist
            </Link>
          </li>
        </ul>
      </div>

      <div>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/my-collections"
              className="text-gray-300 hover:text-green-300 transition-colors"
            >
              Mes Collections
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 shadow-[0_0_10px_rgba(0,255,128,0.3)] transition-all"
            >
              Profil
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 shadow-[0_0_10px_rgba(0,255,128,0.3)] transition-all"
            >
              Inscription
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
