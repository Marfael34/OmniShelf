import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { LogOut, Package, Star, Calendar, ArrowRight } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: items = [] } = useQuery({
    queryKey: ["collection", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user.id}/collection_items`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getCountByCategory = (cat) => items.filter(i => i.category === cat).length;

  const stats = [
    { label: "Items possédés", value: items.length, icon: Package, color: "text-cyan-400" },
    { label: "Catégories", value: new Set(items.map(i => i.category)).size, icon: Star, color: "text-yellow-400" },
    { label: "Membre depuis", value: "Avril 2024", icon: Calendar, color: "text-purple-400" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      {/* Header Profile */}
      <div className="bg-(--bg-surface) p-8 rounded-3xl border border-gray-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="flex items-center space-x-6 z-10">
          <div className="w-24 h-24 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(6,182,212,0.3)] rotate-3">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-(--text-main)">{user?.email}</h1>
            <p className="text-(--text-dim) flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Collectionneur OmniShelf
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-6 py-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl font-bold hover:bg-red-900/40 transition-all z-10"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-(--bg-surface) p-6 rounded-2xl border border-gray-800 text-center space-y-2 hover:border-gray-700 transition-colors">
            <stat.icon className={`mx-auto ${stat.color}`} size={24} />
            <div className="text-2xl font-bold text-(--text-main)">{stat.value}</div>
            <div className="text-xs text-(--text-dim) uppercase tracking-wider font-bold">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Categories Detail */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-(--text-main)">Répartition par univers</h2>
          <Link to="/my-collections" className="text-accent hover:underline font-bold flex items-center">
            Gérer ma collection <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "game", label: "Jeux Vidéo", color: "bg-cyan-900/20 text-cyan-400 border-cyan-500/20" },
            { id: "manga", label: "Mangas", color: "bg-indigo-900/20 text-indigo-400 border-indigo-500/20" },
            { id: "vinyl", label: "Vinyles", color: "bg-purple-900/20 text-purple-400 border-purple-500/20" },
            { id: "pop", label: "POP!", color: "bg-teal-900/20 text-teal-400 border-teal-500/20" },
          ].map(cat => (
            <div key={cat.id} className={`${cat.color} p-6 rounded-2xl border text-center transition-transform hover:-translate-y-1`}>
              <div className="text-3xl font-black mb-1">{getCountByCategory(cat.id)}</div>
              <div className="text-[10px] font-black uppercase tracking-tighter opacity-80">{cat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;

