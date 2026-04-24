import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { proxyService } from "../services/api/proxy";
import { useAffiliationLink } from "../hooks/useAffiliationLink";
import ActionButtons from "../components/UI/ActionButtons";
import { ArrowLeft, Box, Tag, Loader2 } from "lucide-react";

const PopDetails = () => {
  const { id } = useParams();
  
  const { data: pop, isLoading, error } = useQuery({
    queryKey: ["pop", id],
    queryFn: async () => {
      return proxyService.getDetails(id, "pop");
    },
    enabled: !!id,
  });

  const { amazon, fnac } = useAffiliationLink(`Funko POP ${pop?.name || ""}`, "pop", id);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 className="animate-spin text-accent" size={48} />
      <p className="text-text-dim font-bold animate-pulse">Chargement des données POP...</p>
    </div>
  );

  if (error || !pop) return (
    <div className="text-center py-24 space-y-6">
        <h1 className="text-4xl font-black">Oups !</h1>
        <p className="text-xl text-text-dim">Figurine introuvable dans la base.</p>
        <button onClick={() => navigate('/search')} className="inline-block px-8 py-3 bg-gray-800 rounded-xl font-bold">Retour à la recherche</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <button 
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')} 
        className="flex items-center text-text-dim hover:text-accent font-bold transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> Retour
      </button>

      <div className="bg-bg-surface rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col md:flex-row relative">
        <div className="md:w-1/3 bg-white flex items-center justify-center p-12">
          <img src={pop.imageUrl} alt={pop.name} className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500" />
        </div>
        
        <div className="p-10 md:w-2/3 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-5xl font-black text-text-main leading-tight tracking-tighter mb-2">
                {pop.name}
              </h1>
              {pop.brand && (
                <span className="bg-teal-500 text-bg-main px-5 py-2 rounded-2xl font-black text-xl shadow-lg transform rotate-3">
                    {pop.brand.split(',')[0]}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
                <span className="bg-teal-900/20 text-teal-400 px-4 py-2 rounded-xl text-sm font-black border border-teal-500/20 uppercase tracking-widest">
                    {pop.categories?.[0]?.replace('en:', '').replace(/-/g, ' ') || "Figurine Collection"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800/50">
              <div className="space-y-1">
                <div className="flex items-center text-text-dim text-xs font-bold uppercase tracking-widest mb-1">
                    <Box size={12} className="mr-2" /> Code Produit
                </div>
                <div className="text-sm font-bold text-text-main">{pop.id}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-text-dim text-xs font-bold uppercase tracking-widest mb-1">
                    <Tag size={12} className="mr-2" /> Marque
                </div>
                <div className="text-sm font-bold text-text-main">{pop.brand || "Funko"}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <ActionButtons externalId={id} category="pop" />
            
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

export default PopDetails;
