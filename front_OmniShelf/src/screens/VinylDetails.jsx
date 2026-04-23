import { useParams } from "react-router-dom";
import { useAffiliationLink } from "../hooks/useAffiliationLink";

const VinylDetails = () => {
  const { id } = useParams();
  
  const vinyl = {
    title: "Dark Side of the Moon",
    artist: "Pink Floyd",
    genre: "Rock Progressif",
    image: "https://via.placeholder.com/500x500?text=Pink+Floyd",
    tracklist: ["Speak to Me", "Breathe", "On the Run", "Time", "The Great Gig in the Sky", "Money", "Us and Them", "Any Colour You Like", "Brain Damage", "Eclipse"]
  };

  const { amazon, fnac } = useAffiliationLink(`${vinyl.artist} ${vinyl.title}`, "vinyl", id);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-(--bg-surface) rounded-2xl overflow-hidden border border-gray-800 shadow-(--shadow-soft) flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-900 min-h-[300px] flex items-center justify-center p-8">
          <div className="rounded-full overflow-hidden border-8 border-gray-800 w-full aspect-square relative animate-[spin_20s_linear_infinite]">
             <img src={vinyl.image} alt={vinyl.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/20 rounded-full"></div>
             <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-900 rounded-full border-4 border-gray-800"></div>
          </div>
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-(--text-main) mb-2">{vinyl.title} <span className="text-sm text-(--text-dim)">({id})</span></h1>
                <h2 className="text-xl text-purple-400 font-bold mb-4">{vinyl.artist}</h2>
              </div>
            </div>
            <p className="text-(--text-dim) mb-6"><strong className="text-gray-300">Genre:</strong> {vinyl.genre}</p>
            
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <h3 className="font-bold mb-3">Tracklist</h3>
              <ol className="list-decimal list-inside text-sm text-(--text-dim) space-y-1 max-h-40 overflow-y-auto pr-2">
                {vinyl.tracklist.map((track, i) => (
                  <li key={i}>{track}</li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex space-x-4">
              <button className="flex-1 bg-(--color-accent) text-(--bg-main) font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                Ajouter
              </button>
              <button className="flex-1 border-2 border-(--color-accent) text-(--color-accent) font-bold py-3 rounded-xl hover:bg-(--color-accent) hover:text-(--bg-main) transition-colors">
                Wishlist
              </button>
            </div>
            <div className="flex space-x-4 pt-4 border-t border-gray-800">
              <a href={amazon} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-[#FF9900] text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                Acheter sur Amazon
              </a>
              <a href={fnac} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-[#E1A925] text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                Acheter sur Fnac
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VinylDetails;
