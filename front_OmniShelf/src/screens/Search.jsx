import { useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-(--text-main)">Recherche Avancée</h1>
        <p className="text-(--text-dim)">Trouvez l'élément parfait à ajouter à votre étagère.</p>
        
        <div className="flex bg-(--bg-surface) rounded-full border border-gray-700 overflow-hidden shadow-lg mt-8 focus-within:border-(--color-accent) transition-colors">
          <select 
            className="bg-gray-800 text-(--text-main) px-4 py-3 outline-none border-r border-gray-700 font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            <option value="game">Jeux Vidéo</option>
            <option value="manga">Mangas</option>
            <option value="vinyl">Vinyles</option>
            <option value="pop">Figurines POP</option>
          </select>
          <input 
            type="text" 
            placeholder="Titre, Auteur, Éditeur..."
            className="flex-1 bg-transparent text-(--text-main) px-6 py-3 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-(--color-accent) text-(--bg-main) px-8 py-3 font-bold hover:opacity-90 transition-opacity">
            Chercher
          </button>
        </div>
      </div>

      <div className="pt-12">
        <h2 className="text-2xl font-bold mb-6">Résultats pour "{query || "Tout"}"</h2>
        
        {/* Grille de résultats mock */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Link 
              key={i} 
              to={`/details/game/${i}`}
              className="bg-(--bg-surface) rounded-xl overflow-hidden border border-gray-800 hover:border-(--color-accent) transition-colors flex flex-col h-56"
            >
              <div className="flex-1 bg-gray-800"></div>
              <div className="p-3">
                <h3 className="font-bold text-sm truncate">Résultat {i}</h3>
                <p className="text-xs text-(--text-dim) uppercase mt-1">{category === 'all' ? 'Mixte' : category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
