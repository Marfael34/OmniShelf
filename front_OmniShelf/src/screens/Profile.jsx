import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      <section className="bg-(--bg-surface) p-8 rounded-2xl border border-gray-800 shadow-(--shadow-soft) flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-(--color-primary) rounded-full flex items-center justify-center text-3xl font-bold border-4 border-(--color-accent)">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-(--text-main)">{user?.name || "Utilisateur"}</h1>
            <p className="text-(--text-dim)">{user?.email || "utilisateur@omnishelf.com"}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="px-6 py-2 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
        >
          Déconnexion
        </button>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold">Vue d'ensemble de vos collections</h2>
          <Link to="/my-collections" className="text-(--color-accent) hover:underline font-medium">Voir tout →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-cyan-900/20 rounded-xl border border-cyan-900/50 text-center">
            <h3 className="text-cyan-400 font-bold mb-2">Jeux Vidéo</h3>
            <p className="text-3xl font-extrabold">12</p>
          </div>
          <div className="p-6 bg-indigo-900/20 rounded-xl border border-indigo-900/50 text-center">
            <h3 className="text-indigo-400 font-bold mb-2">Mangas</h3>
            <p className="text-3xl font-extrabold">45</p>
          </div>
          <div className="p-6 bg-purple-900/20 rounded-xl border border-purple-900/50 text-center">
            <h3 className="text-purple-400 font-bold mb-2">Vinyles</h3>
            <p className="text-3xl font-extrabold">8</p>
          </div>
          <div className="p-6 bg-teal-900/20 rounded-xl border border-teal-900/50 text-center">
            <h3 className="text-teal-400 font-bold mb-2">POP!</h3>
            <p className="text-3xl font-extrabold">3</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
