import { useState } from "react";

export default function Wishlist() {
  const [filter, setFilter] = useState("all");

  const items = [
    {
      id: 1,
      title: "The Last of Us Part II",
      type: "game",
      icon: "🎮",
      color: "hover:border-cyan-500",
    },
    {
      id: 2,
      title: "One Piece - Tome 100",
      type: "manga",
      icon: "📚",
      color: "hover:border-indigo-500",
    },
    {
      id: 3,
      title: "Michael Jackson - Thriller",
      type: "vinyl",
      icon: "💿",
      color: "hover:border-purple-500",
    },
    {
      id: 4,
      title: "Iron Man POP",
      type: "pop",
      icon: "🦸‍♂️",
      color: "hover:border-teal-500",
    },
  ];

  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.type === filter);
  const filters = [
    { id: "all", label: "Tout" },
    { id: "game", label: "Jeux" },
    { id: "manga", label: "Mangas" },
    { id: "vinyl", label: "Vinyles" },
    { id: "pop", label: "POP" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-50">Wishlist Commune</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-5 transition-all shadow-soft group ${item.color}`}
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
