import { useParams } from "react-router-dom";

const PopDetails = () => {
  const { id } = useParams();
  
  const pop = {
    number: "10",
    series: "Marvel",
    character: "Iron Man",
    image: "https://via.placeholder.com/400x500?text=Iron+Man+POP"
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-(--bg-surface) rounded-2xl overflow-hidden border border-gray-800 shadow-(--shadow-soft) flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-white min-h-[300px] flex items-center justify-center p-8">
          <img src={pop.image} alt={pop.character} className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
        <div className="p-8 md:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-extrabold text-(--text-main) mb-2">
                {pop.character} <span className="text-sm text-(--text-dim) ml-2">({id})</span>
              </h1>
              <span className="bg-teal-900/40 text-teal-400 px-3 py-1 rounded-full font-bold border border-teal-500/30 text-xl">#{pop.number}</span>
            </div>
            <div className="space-y-2 mt-6 text-(--text-dim)">
              <p><strong className="text-gray-300">Série:</strong> {pop.series}</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex space-x-4">
              <button className="flex-1 bg-(--color-accent) text-(--bg-main) font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                Ajouter à la collection
              </button>
              <button className="flex-1 border-2 border-(--color-accent) text-(--color-accent) font-bold py-3 rounded-xl hover:bg-(--color-accent) hover:text-(--bg-main) transition-colors">
                Ajouter à la wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopDetails;
