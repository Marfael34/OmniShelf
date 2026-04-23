import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

export default function NavBar() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700 shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Glassmorphism */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition-transform"
        >
          OmniShelf
        </Link>

        {/* Navigation Centrale */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "text-cyan-400 font-medium"
                : "text-slate-300 hover:text-cyan-400 transition-colors"
            }
          >
            Recherche
          </NavLink>
          <NavLink
            to="/my-collections"
            className={({ isActive }) =>
              isActive
                ? "text-cyan-400 font-medium"
                : "text-slate-300 hover:text-cyan-400 transition-colors"
            }
          >
            Mes Collections
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive
                ? "text-cyan-400 font-medium"
                : "text-slate-300 hover:text-cyan-400 transition-colors"
            }
          >
            Wishlist
          </NavLink>

          {/* Actions d'Authentification */}
          <div className="ml-4 pl-4 border-l border-slate-700 flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className="text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  Profil
                </NavLink>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                  Connexion
                </button>
                <button className="px-4 py-2 text-sm font-bold text-slate-900 bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:bg-cyan-300 transition-colors">
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
