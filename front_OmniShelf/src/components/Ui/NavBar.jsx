import { Link } from "react-router-dom";
import { useScannerStore } from "../../store/useScannerStore";

export default function NavBar({ user, onLogout }) {
  const openScanner = useScannerStore((state) => state.openScanner);

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg border-b border-green-500/30 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black text-white font-mono tracking-widest flex items-center gap-2"
        >
          <span className="text-green-500">OMNI</span>SHELF
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link
            to="/search"
            className="text-gray-300 hover:text-green-400 font-mono text-sm tracking-wider uppercase transition-colors"
          >
            Recherche
          </Link>
          <Link
            to="/my-collections"
            className="text-gray-300 hover:text-green-400 font-mono text-sm tracking-wider uppercase transition-colors"
          >
            Mes Collections
          </Link>
          <Link
            to="/wishlist"
            className="text-gray-300 hover:text-green-400 font-mono text-sm tracking-wider uppercase transition-colors"
          >
            Wishlist
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openScanner}
            className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500 font-bold rounded hover:bg-green-500 hover:text-black transition-colors uppercase text-xs tracking-wider shadow-[0_0_10px_rgba(0,255,128,0.2)]"
          >
            [ SCAN ]
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="px-4 py-2 bg-gray-800 text-white border border-gray-600 font-bold rounded hover:bg-gray-700 transition-colors uppercase text-xs tracking-wider"
              >
                Profil
              </Link>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-red-400 hover:text-red-300 font-bold uppercase text-xs tracking-wider transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors uppercase text-xs tracking-wider"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
