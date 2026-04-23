import { useParams } from "react-router-dom";
import ActionButtons from "../components/UI/ActionButtons.jsx";

export default function VinylDetails() {
  const { id } = useParams();
  // Mock data
  const vinyl = {
    title: "Discovery",
    artist: "Daft Punk",
    genre: "Électronique",
    image: "https://placehold.co/400x400/1e293b/a855f7?text=Discovery",
    tracks: [
      "One More Time",
      "Aerodynamic",
      "Digital Love",
      "Harder, Better, Faster, Stronger",
    ],
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">
      <img
        src={vinyl.image}
        alt={vinyl.title}
        className="w-full md:w-1/3 aspect-square rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] object-cover"
      />
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-slate-50 mb-2">
          {vinyl.title}
        </h1>
        <p className="text-xl text-slate-400 mb-4">{vinyl.artist}</p>
        <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-purple-400 w-fit mb-6">
          {vinyl.genre}
        </span>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
          <h3 className="font-bold text-slate-200 mb-2">Tracklist</h3>
          <ol className="list-decimal list-inside text-slate-400 text-sm space-y-1 ml-2">
            {vinyl.tracks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
        <ActionButtons />
      </div>
    </div>
  );
}
