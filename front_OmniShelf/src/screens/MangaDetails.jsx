import { useParams } from "react-router-dom";
import ActionButtons from "../components/UI/ActionButtons.jsx";
import AffiliationButtons from "../components/UI/AffiliationButtons.jsx";

export default function MangaDetails() {
  const { id } = useParams();
  // Mock data
  const manga = {
    title: "Berserk - Tome 1",
    author: "Kentaro Miura",
    genre: "Seinen",
    publisher: "Glénat",
    image: "https://placehold.co/300x400/1e293b/6366f1?text=Berserk",
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">
      <img
        src={manga.image}
        alt={manga.title}
        className="w-full md:w-1/3 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] object-cover"
      />
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-slate-50 mb-2">
          {manga.title}
        </h1>
        <p className="text-xl text-slate-400 mb-4">Par {manga.author}</p>
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-indigo-400">
            {manga.genre}
          </span>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300">
            Édition: {manga.publisher}
          </span>
        </div>
        <AffiliationButtons
          productName={`${manga.title} ${manga.author}`}
          category="manga"
        />
        <ActionButtons />
      </div>
    </div>
  );
}
