import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { proxyService } from "../services/api/proxy";
import { useAffiliationLink } from "../hooks/useAffiliationLink";
import ActionButtons from "../components/UI/ActionButtons";
import { Loader2, ArrowLeft, BookOpen, User, Building } from "lucide-react";

const MangaDetails = () => {
  const { id } = useParams();
  
  const { data: book, isLoading, error } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      return proxyService.getDetails(id, "manga");
    },
    enabled: !!id,
  });

  const { amazon, fnac } = useAffiliationLink(book?.name || "Livre", "manga", id);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 className="animate-spin text-accent" size={48} />
      <p className="text-text-dim font-bold animate-pulse">Chargement des données Google Books...</p>
    </div>
  );

  if (error || !book) return (
    <div className="text-center py-24 space-y-6">
        <h1 className="text-4xl font-black">Oups !</h1>
        <p className="text-xl text-text-dim">Impossible de récupérer les détails de ce livre.</p>
        <button onClick={() => navigate('/search')} className="inline-block px-8 py-3 bg-gray-800 rounded-xl font-bold">Retour à la recherche</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-between">
          <button 
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/search')}
            className="flex items-center space-x-2 text-accent hover:opacity-80 transition-all font-bold"
          >
            <ArrowLeft size={20} />
            <span>RETOUR</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <span className="text-[10px] font-mono text-accent opacity-50 uppercase tracking-widest">Book_Proxy_Active</span>
          </div>
        </div>

      <div className="bg-bg-surface rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col md:flex-row relative">
        <div className="md:w-1/3 bg-gray-900 flex items-center justify-center p-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-accent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
                src={book.backgroundImage} 
                alt={book.name} 
                className="relative z-10 w-full max-w-[240px] shadow-2xl rounded-lg transform group-hover:rotate-1 transition-transform duration-500" 
            />
          </div>
        </div>
        
        <div className="p-10 md:w-2/3 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-black text-text-main leading-tight tracking-tighter mb-4">
                {book.name}
              </h1>
              <div className="flex items-center text-accent font-black text-lg">
                <User size={20} className="mr-2" />
                {book.author || "Auteur inconnu"}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {book.categories?.map((c, i) => (
                    <span key={i} className="bg-purple-900/20 text-purple-400 px-3 py-1 rounded-lg text-xs font-black border border-purple-500/10 uppercase tracking-wider">{c}</span>
                ))}
                {book.pageCount && (
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-xs font-black border border-gray-700 uppercase tracking-wider">{book.pageCount} pages</span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800/50">
              <div className="space-y-1">
                <div className="flex items-center text-text-dim text-xs font-bold uppercase tracking-widest mb-1">
                    <Building size={12} className="mr-2" /> Éditeur
                </div>
                <div className="text-sm font-bold text-text-main">{book.publisher || "N/A"} ({book.releaseYear})</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-text-dim text-xs font-bold uppercase tracking-widest mb-1">
                    <BookOpen size={12} className="mr-2" /> Format
                </div>
                <div className="text-sm font-bold text-text-main uppercase tracking-tighter">
                    Volume
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
                <p className="text-text-dim leading-relaxed line-clamp-6 hover:line-clamp-none transition-all cursor-pointer" dangerouslySetInnerHTML={{ __html: book.description }}></p>
            </div>
          </div>
          
          <div className="space-y-6">
            <ActionButtons externalId={id} category="manga" />
            
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

export default MangaDetails;
