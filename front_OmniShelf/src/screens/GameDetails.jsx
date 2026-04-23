import { useParams } from "react-router-dom";
import ActionButtons from "../components/UI/ActionButtons.jsx";
import AffiliationButtons from "../components/UI/AffiliationButtons.jsx";

export default function GameDetails() {
  const { id } = useParams();
  // Mock data
  const game = {
    title: "The Legend of Zelda",
    genre: "Aventure",
    publisher: "Nintendo",
    pegi: "12",
    image: "https://placehold.co/300x400/1e293b/06b6d4?text=Zelda",
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">
      <img
        src={game.image}
        alt={game.title}
        className="w-full md:w-1/3 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] object-cover"
      />
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-slate-50 mb-2">
          {game.title}
        </h1>
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-cyan-400">
            {game.genre}
          </span>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300">
            Éditeur: {game.publisher}
          </span>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm font-bold text-orange-400">
            PEGI {game.pegi}
          </span>
        </div>
        <AffiliationButtons productName={game.title} category="game" />
        <ActionButtons />
      </div>
    </div>
  );
}
