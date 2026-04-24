import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { proxyService } from "../services/api/proxy";
import { useAffiliationLink } from "../hooks/useAffiliationLink";
import ActionButtons from "../components/UI/ActionButtons";
import { Loader2, ArrowLeft, Star, Globe, Cpu, Play, Image as ImageIcon, LayoutGrid } from "lucide-react";

const GameDetails = () => {
  const { id } = useParams();
  
  const { data: game, isLoading, error } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      return proxyService.getDetails(id, "game");
    },
    enabled: !!id,
  });

  const { amazon, fnac } = useAffiliationLink(game?.name || "Game", "game", id);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 className="animate-spin text-accent" size={48} />
      <p className="text-text-dim font-bold animate-pulse">Chargement des données de l'univers...</p>
    </div>
  );

  if (error || !game) return (
    <div className="text-center py-24 space-y-6">
        <h1 className="text-4xl font-black">Oups !</h1>
        <p className="text-xl text-text-dim">Impossible de récupérer les détails de ce jeu.</p>
        <button onClick={() => navigate('/search')} className="inline-block px-8 py-3 bg-gray-800 rounded-xl font-bold">Retour à la recherche</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12 animate-fade-in">
      <button 
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')} 
        className="flex items-center text-text-dim hover:text-accent font-bold transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Retour
      </button>

      <div className="bg-bg-surface rounded-[2.5rem] overflow-hidden border border-gray-800/50 shadow-2xl flex flex-col lg:flex-row relative">
        <div className="lg:w-1/2 bg-gray-900 overflow-hidden relative group min-h-[400px]">
          <img 
            src={game.backgroundImage} 
            alt={game.name} 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg-surface via-transparent to-transparent"></div>
        </div>
        
        <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-4xl lg:text-6xl font-black text-text-main leading-tight tracking-tighter">
                {game.name}
              </h1>
              {game.metacritic && (
                <div className="bg-accent/20 text-accent px-4 py-2 rounded-2xl border border-accent/30 text-center shrink-0">
                    <div className="text-2xl font-black">{game.metacritic}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest">METASCORE</div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
                {game.genres?.map((g, idx) => (
                    <span key={idx} className="bg-cyan-900/10 text-accent px-3 py-1 rounded-full text-[10px] font-black border border-accent/10 uppercase tracking-widest">{g.name}</span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-800/50">
              <div className="space-y-2">
                <div className="flex items-center text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">
                    <Star size={14} className="mr-2 text-yellow-500 fill-yellow-500" /> Note Joueurs
                </div>
                <div className="text-2xl font-black text-text-main">{game.rating || "N/A"} <span className="text-sm text-text-dim">/ 5</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">
                    <Cpu size={14} className="mr-2 text-purple-500" /> Plateformes
                </div>
                <div className="text-sm font-bold text-text-main line-clamp-2">
                    {game.platforms?.map(p => p.platform.name).join(", ")}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-text-dim text-[10px] font-black uppercase tracking-widest">
                {game.releaseYear && (
                    <span className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                        🗓️ {game.releaseYear}
                    </span>
                )}
                {game.publishers?.[0] && (
                    <span className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                        🏢 {game.publishers[0].name}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Synopsis</h3>
                <p className="text-text-dim leading-relaxed text-sm line-clamp-4 hover:line-clamp-none transition-all cursor-pointer bg-white/5 p-4 rounded-2xl border border-white/5" dangerouslySetInnerHTML={{ __html: game.description }}></p>
            </div>
          </div>
          
          <div className="space-y-6">
            <ActionButtons externalId={id} category="game" />
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
              <a href={amazon} target="_blank" rel="noreferrer" className="flex items-center justify-center py-4 bg-[#FF9900] text-black font-black text-xs rounded-2xl hover:opacity-90 transition-all shadow-xl hover:scale-[1.02] tracking-widest uppercase">
                Acheter sur Amazon
              </a>
              <a href={fnac} target="_blank" rel="noreferrer" className="flex items-center justify-center py-4 bg-[#E1A925] text-black font-black text-xs rounded-2xl hover:opacity-90 transition-all shadow-xl hover:scale-[1.02] tracking-widest uppercase">
                Acheter sur Fnac
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
            {game.screenshots && game.screenshots.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <ImageIcon className="text-accent" size={24} />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Captures d'écran</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {game.screenshots.slice(0, 4).map((src, i) => (
                            <div key={i} className="aspect-video rounded-3xl overflow-hidden border border-gray-800 group">
                                <img src={typeof src === 'string' ? src : src.image} alt="Screenshot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {game.videos && game.videos.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Play className="text-accent" size={24} />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Trailer Officiel</h2>
                    </div>
                    <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl bg-black">
                        <iframe 
                            src={game.videos[0]} 
                            title="Trailer"
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </section>
            )}

            {game.storyline && (
                <section className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <LayoutGrid className="text-accent" size={24} />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">L'histoire</h2>
                    </div>
                    <div className="bg-bg-surface p-8 rounded-4xl border border-gray-800 text-text-dim leading-loose italic relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                        "{game.storyline}"
                    </div>
                </section>
            )}
        </div>

        <aside className="space-y-8">
            {game.similar_games && game.similar_games.length > 0 && (
                <div className="bg-bg-surface p-8 rounded-[2.5rem] border border-gray-800 sticky top-8">
                    <h2 className="text-xl font-black mb-8 tracking-tighter uppercase flex items-center">
                        <span className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse"></span>
                        Jeux Similaires
                    </h2>
                    <div className="space-y-6">
                        {game.similar_games.slice(0, 5).map((sg) => (
                            <Link 
                                key={sg.id} 
                                to={`/details/game/${sg.id}`}
                                className="flex items-center space-x-4 group"
                            >
                                <div className="w-16 h-20 rounded-xl overflow-hidden border border-gray-800 shrink-0">
                                    <img src={sg.imageUrl} alt={sg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-text-main group-hover:text-accent transition-colors line-clamp-2">
                                        {sg.name}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </aside>
      </div>
    </div>
  );
};

export default GameDetails;
