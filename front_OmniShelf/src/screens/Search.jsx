import { useState } from "react";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");

  const results = [
    {
      id: "1",
      title: "Batman: Arkham Knight",
      type: "Jeux Vidéo",
      icon: "🎮",
      link: "/details/game/1",
    },
    {
      id: "2",
      title: "Batman - The Dark Knight Returns",
      type: "Manga/Comics",
      icon: "📚",
      link: "/details/manga/2",
    },
    {
      id: "3",
      title: "Batman Funko POP #144",
      type: "Figurine POP",
      icon: "🦸‍♂️",
      link: "/details/pop/3",
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-50">Recherche Avancée</h1>

      {/* Barre de recherche Glassmorphism */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-soft backdrop-blur-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par Titre, Auteur, Éditeur, PEGI..."
          className="w-full bg-slate-900 border border-slate-600 rounded-xl px-6 py-4 text-slate-50 text-lg placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
        />
      </div>

      {/* Grille de résultats simulés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((r) => (
          <Link
            key={r.id}
            to={r.link}
            className="p-6 bg-slate-800 border border-slate-700 rounded-xl flex gap-5 items-center hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all group shadow-soft"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">
              {r.icon}
            </span>
            <div>
              <h3 className="font-bold text-slate-200 line-clamp-1">
                {r.title}
              </h3>
              <p className="text-sm text-cyan-400/80 font-medium">{r.type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
