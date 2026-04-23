import { Link } from "react-router-dom";

const categories = [
  { id: "game", name: "Jeux Vidéo", color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-400", path: "/search?category=game" },
  { id: "manga", name: "Mangas", color: "bg-indigo-900/40 border-indigo-500/30 text-indigo-400", path: "/search?category=manga" },
  { id: "vinyl", name: "Vinyles", color: "bg-purple-900/40 border-purple-500/30 text-purple-400", path: "/search?category=vinyl" },
  { id: "pop", name: "Figurines POP", color: "bg-teal-900/40 border-teal-500/30 text-teal-400", path: "/search?category=pop" },
];

import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import ProductCard from "../components/UI/ProductCard";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const user = useAuthStore((state) => state.user);

  const { data: recData, isLoading: isRecLoading } = useQuery({
    queryKey: ["recommendations", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user.id}/recommendations`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="flex flex-col items-center py-12 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tighter text-text-main">
          OMNI<span className="text-accent">SHELF</span>
        </h1>
        <p className="text-xl text-text-dim font-medium max-w-2xl mx-auto">
          Votre univers, digitalisé. Scannez, collectionnez et explorez vos passions en un instant.
        </p>
        <div className="pt-4">
          <Link 
            to="/search" 
            className="inline-flex items-center space-x-3 bg-accent text-bg-bg-main px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-xl shadow-accent/20"
          >
            <span>Démarrer l'exploration</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Section Recommandations (Live Data) */}
      {user && (
        <section className="w-full max-w-6xl px-4 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase">Suggestions</h2>
              <p className="text-accent font-mono text-[10px] tracking-widest">PROPULSÉ_PAR_IA</p>
            </div>
            <Link to="/search" className="text-accent font-bold hover:underline">Voir plus</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {isRecLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-bg-surface rounded-2xl h-72 animate-pulse border border-gray-800"></div>
              ))
            ) : (
              recData?.recommendations?.map((item, idx) => (
                <ProductCard key={idx} item={item} />
              ))
            )}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="w-full max-w-6xl px-4">
        <h2 className="text-3xl font-black mb-12 text-center text-text-main">Explorez par Univers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.path}
              className={`group relative flex flex-col items-center justify-center p-12 rounded-3xl border border-white/5 overflow-hidden transition-all hover:scale-[1.02] hover:-translate-y-2 ${cat.color}`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-2xl font-black z-10">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
