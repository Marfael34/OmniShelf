import { useParams, useNavigate } from "react-router-dom";
import { useAffiliationLink } from "../hooks/useAffiliationLink";
import ActionButtons from "../components/UI/ActionButtons";
import { ArrowLeft, Box, Tag } from "lucide-react";

const PopDetails = () => {
  const { id } = useParams();
  
  const pop = {
    number: "10",
    series: "Marvel",
    character: "Iron Man",
    image: "https://via.placeholder.com/400x500?text=Iron+Man+POP"
  };

  const { amazon, fnac } = useAffiliationLink(`Funko POP ${pop.character}`, "pop", id);
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-(--text-dim) hover:text-accent font-bold transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Retour
      </button>

      <div className="bg-(--bg-surface) rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col md:flex-row relative">
        <div className="md:w-1/3 bg-white/95 flex items-center justify-center p-12">
          <img src={pop.image} alt={pop.character} className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500" />
        </div>
        
        <div className="p-10 md:w-2/3 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter mb-2">
                {pop.character}
              </h1>
              <span className="bg-teal-500 text-white px-5 py-2 rounded-2xl font-black text-2xl shadow-lg transform rotate-3">#{pop.number}</span>
            </div>

            <div className="flex items-center space-x-4">
                <span className="bg-teal-900/20 text-teal-400 px-4 py-2 rounded-xl text-sm font-black border border-teal-500/20 uppercase tracking-widest">
                    Collection {pop.series}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800/50">
              <div className="space-y-1">
                <div className="flex items-center text-(--text-dim) text-xs font-bold uppercase tracking-widest mb-1">
                    <Box size={12} className="mr-2" /> Format
                </div>
                <div className="text-sm font-bold text-(--text-main)">Figurine Vinyle (9cm)</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-(--text-dim) text-xs font-bold uppercase tracking-widest mb-1">
                    <Tag size={12} className="mr-2" /> Marque
                </div>
                <div className="text-sm font-bold text-(--text-main)">Funko POP!</div>
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

