import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { useAffiliationLink } from "../hooks/useAffiliationLink";
import ActionButtons from "../components/UI/ActionButtons";
import { Loader2, ArrowLeft, Star, Globe, Cpu } from "lucide-react";

const GameDetails = () => {
  const { id } = useParams();
  
  const { data: game, isLoading, error } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const res = await api.get(`/proxy/details?external_id=${id}&category=game`);
      return res.data.data;
    },
    enabled: !!id,
  });

  const { amazon, fnac } = useAffiliationLink(game?.name || "Game", "game", id);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 className="animate-spin text-accent" size={48} />
      <p className="text-(--text-dim) font-bold animate-pulse">Chargement des données RAWG...</p>
    </div>
  );

  if (error || !game) return (
    <div className="text-center py-24 space-y-6">
        <h1 className="text-4xl font-black">Oups !</h1>
        <p className="text-xl text-(--text-dim)">Impossible de récupérer les détails de ce jeu.</p>
        <button onClick={() => navigate('/search')} className="inline-block px-8 py-3 bg-gray-800 rounded-xl font-bold">Retour à la recherche</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-(--text-dim) hover:text-accent font-bold transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Retour
      </button>

      <div className="bg-(--bg-surface) rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col md:flex-row relative">
        <div className="md:w-1/2 bg-gray-900 overflow-hidden group">
          <img 
            src={game.background_image} 
            alt={game.name} 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
        
        <div className="p-10 md:w-1/2 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-5xl font-black text-(--text-main) leading-tight tracking-tighter">
                {game.name}
              </h1>
              {game.metacritic && (
                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-2xl border border-green-500/30 text-center">
                    <div className="text-2xl font-black">{game.metacritic}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest">METASCORE</div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
                {game.genres?.map(g => (
                    <span key={g.id} className="bg-cyan-900/20 text-cyan-400 px-3 py-1 rounded-lg text-xs font-black border border-cyan-500/10 uppercase tracking-wider">{g.name}</span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800/50">
              <div className="space-y-1">
                <div className="flex items-center text-(--text-dim) text-xs font-bold uppercase tracking-widest mb-1">
                    <Star size={12} className="mr-2 text-yellow-500" /> Note RAWG
                </div>
                <div className="text-xl font-black text-(--text-main)">{game.rating} / 5</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-(--text-dim) text-xs font-bold uppercase tracking-widest mb-1">
                    <Cpu size={12} className="mr-2 text-purple-500" /> Plateformes
                </div>
                <div className="text-sm font-bold text-(--text-main) line-clamp-1">
                    {game.platforms?.map(p => p.platform.name).join(", ")}
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
                <p className="text-(--text-dim) leading-relaxed line-clamp-4 hover:line-clamp-none transition-all cursor-pointer" dangerouslySetInnerHTML={{ __html: game.description }}></p>
            </div>
          </div>
          
          <div className="space-y-6">
            <ActionButtons externalId={id} category="game" />
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
              <a href={amazon} target="_blank" rel="noreferrer" className="flex items-center justify-center py-4 bg-[#FF9900] text-black font-black rounded-2xl hover:opacity-90 transition-all shadow-xl hover:scale-[1.02]">
                AMAZON
              </a>
              <a href={fnac} target="_blank" rel="noreferrer" className="flex items-center justify-center py-4 bg-[#E1A925] text-black font-black rounded-2xl hover:opacity-90 transition-all shadow-xl hover:scale-[1.02]">
                FNAC
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;

