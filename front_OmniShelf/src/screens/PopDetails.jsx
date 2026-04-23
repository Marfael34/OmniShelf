import { useParams } from "react-router-dom";
import ActionButtons from "../components/UI/ActionButtons.jsx";

export default function PopDetails() {
  const { id } = useParams();
  // Mock data
  const pop = {
    title: "Batman",
    number: "144",
    series: "DC Comics",
    image: "https://placehold.co/300x400/1e293b/14b8a6?text=Batman+POP",
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">
      <img
        src={pop.image}
        alt={pop.title}
        className="w-full md:w-1/3 rounded-xl border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)] object-cover bg-white"
      />
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-slate-50 mb-2">
          {pop.title}
        </h1>
        <p className="text-xl text-slate-400 mb-6">{pop.series}</p>
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-4 py-2 bg-slate-800 border border-teal-500/50 rounded-lg text-lg font-black text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
            N° {pop.number}
          </span>
        </div>
        <ActionButtons />
      </div>
    </div>
  );
}
