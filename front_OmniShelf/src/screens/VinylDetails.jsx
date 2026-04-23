import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { useAffiliationLink } from "../hooks/useAffiliationLink";
import ActionButtons from "../components/UI/ActionButtons";
import { Loader2, ArrowLeft, Disc, Music, Layers } from "lucide-react";

const VinylDetails = () => {
  const { id } = useParams();
  
  const { data: release, isLoading, error } = useQuery({
    queryKey: ["vinyl", id],
    queryFn: async () => {
      const res = await api.get(`/proxy/details?external_id=${id}&category=vinyl`);
      return res.data.data;
    },
    enabled: !!id,
  });

  const { amazon, fnac } = useAffiliationLink(`${release?.artists_sort} ${release?.title}`, "vinyl", id);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 className="animate-spin text-accent" size={48} />
      <p className="text-(--text-dim) font-bold animate-pulse">Chargement des données Discogs...</p>
    </div>
  );

  if (error || !release) return (
    <div className="text-center py-24 space-y-6">
        <h1 className="text-4xl font-black">Oups !</h1>
        <p className="text-xl text-(--text-dim)">Impossible de récupérer les détails de ce vinyle.</p>
        <button onClick={() => navigate('/search')} className="inline-block px-8 py-3 bg-gray-800 rounded-xl font-bold">Retour à la recherche</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-(--text-dim) hover:text-accent font-bold transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Retour
      </button>

      <div className="bg-(--bg-surface) rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col md:flex-row relative">
        <div className="md:w-1/2 bg-gray-900 min-h-[400px] flex items-center justify-center p-12">
          <div className="relative group w-full max-w-[320px]">
            <div className="absolute -inset-4 bg-purple-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="rounded-full overflow-hidden border-12 border-gray-800 w-full aspect-square relative shadow-2xl animate-[spin_30s_linear_infinite]">
                 <img src={release.images?.[0]?.resource_url || release.thumb} alt={release.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/10 rounded-full"></div>
                 <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-900 rounded-full border-4 border-gray-800 z-20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                 </div>
            </div>
          </div>
        </div>
        
        <div className="p-10 md:w-1/2 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-black text-(--text-main) leading-tight tracking-tighter mb-2">
                {release.title}
              </h1>
              <h2 className="text-2xl text-purple-400 font-bold">{release.artists_sort}</h2>
            </div>

            <div className="flex flex-wrap gap-3">
                {release.genres?.map((g, i) => (
                    <span key={i} className="bg-purple-900/20 text-purple-400 px-3 py-1 rounded-lg text-xs font-black border border-purple-500/10 uppercase tracking-wider">{g}</span>
                ))}
                {release.released && (
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-xs font-black border border-gray-700 uppercase tracking-wider">{release.released}</span>
                )}
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-2 font-black text-xs uppercase tracking-widest text-(--text-dim) mb-4">
                <Music size={14} />
                <span>Tracklist</span>
              </div>
              <ul className="space-y-3 max-h-48 overflow-y-auto pr-4 custom-scrollbar">
                {release.tracklist?.map((track, i) => (
                  <li key={i} className="flex justify-between text-sm font-bold border-b border-white/5 pb-2 last:border-0">
                    <span className="text-gray-300">{track.position}. {track.title}</span>
                    <span className="text-(--text-dim)">{track.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <ActionButtons externalId={id} category="vinyl" />
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
              <a href={amazon} target="_blank" rel="noreferrer" className="flex items-center justify-center py-4 bg-[#FF9900] text-black font-black rounded-2xl hover:opacity-90 transition-all shadow-xl">
                AMAZON
              </a>
              <a href={fnac} target="_blank" rel="noreferrer" className="flex items-center justify-center py-4 bg-[#E1A925] text-black font-black rounded-2xl hover:opacity-90 transition-all shadow-xl">
                FNAC
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VinylDetails;

