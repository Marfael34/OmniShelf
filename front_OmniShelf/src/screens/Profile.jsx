import { useAuthStore } from "../store/authStore.js";

export default function Profile() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-300">
          Veuillez vous connecter pour voir votre profil.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-4xl mx-auto">
      {/* En-tête du profil */}
      <div className="flex items-center gap-6 p-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-soft backdrop-blur-sm">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-50">
            {user?.name || "Utilisateur Anonyme"}
          </h1>
          <p className="text-slate-400">
            {user?.email || "user@omnishelf.com"}
          </p>
        </div>
      </div>

      {/* Vue d'ensemble des collections (Mock) */}
      <h2 className="text-2xl font-bold text-slate-50 border-b border-slate-800 pb-2">
        Vue d'ensemble
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: "Jeux Vidéo", count: 12, color: "text-cyan-400" },
          { label: "Mangas", count: 45, color: "text-indigo-400" },
          { label: "Vinyles", count: 8, color: "text-purple-400" },
          { label: "Figurines POP", count: 23, color: "text-teal-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex justify-between items-center shadow-soft hover:border-slate-500 transition-colors"
          >
            <span className="text-slate-300 font-medium text-lg">
              {stat.label}
            </span>
            <span className={`text-3xl font-black ${stat.color}`}>
              {stat.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
