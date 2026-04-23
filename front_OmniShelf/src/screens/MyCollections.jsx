import { useState } from "react";

export default function MyCollections() {
  const [filter, setFilter] = useState("all");

  // Données factices pour l'UI en attendant l'API
  const items = [
    { id: 1, title: "Zelda: Breath of the Wild", type: "game", icon: "🎮" },
    { id: 2, title: "Naruto Vol. 1", type: "manga", icon: "📚" },
    { id: 3, title: "Daft Punk - Discovery", type: "vinyl", icon: "💿" },
    { id: 4, title: "Batman POP", type: "pop", icon: "🦸‍♂️" },
  ];

  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.type === filter);
  const filters = [
    { id: "all", label: "Tout" },
    { id: "game", label: "Jeux Vidéo" },
    { id: "manga", label: "Mangas" },
    { id: "vinyl", label: "Vinyles" },
    { id: "pop", label: "POP" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-50">Mes Collections</h1>

      {/* Filtres de catégorie */}
      <div className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all ${filter === f.id ? "bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grille de la collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl flex items-center gap-5 hover:border-cyan-500/50 hover:shadow-soft transition-all group"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="font-semibold text-lg text-slate-200">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
