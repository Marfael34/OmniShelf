import { useParams } from "react-router-dom";

const MangaDetails = () => {
  const { id } = useParams();
  
  const manga = {
    title: "One Piece, Vol. 1",
    author: "Eiichiro Oda",
    genre: "Shonen",
    publisher: "Glénat",
    purchaseLink: "https://www.glenat.com",
    image: "https://via.placeholder.com/400x600?text=One+Piece"
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-(--bg-surface) rounded-2xl overflow-hidden border border-gray-800 shadow-(--shadow-soft) flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gray-900 min-h-[300px] flex items-center justify-center">
          <img src={manga.image} alt={manga.title} className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="p-8 md:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-extrabold text-(--text-main) mb-2">
                {manga.title} <span className="text-sm text-(--text-dim) ml-2">({id})</span>
              </h1>
              <span className="bg-indigo-900/40 text-indigo-400 px-3 py-1 rounded-full text-sm font-bold border border-indigo-500/30">{manga.genre}</span>
            </div>
            <div className="space-y-2 mt-6 text-(--text-dim)">
              <p><strong className="text-gray-300">Auteur:</strong> {manga.author}</p>
              <p><strong className="text-gray-300">Éditeur:</strong> {manga.publisher}</p>
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
            <a href={manga.purchaseLink} target="_blank" rel="noreferrer" className="block w-full text-center py-2 text-(--text-dim) hover:text-(--text-main) underline">
              Lien d'achat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
