export default function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
        Ajouter à la collection
      </button>
      <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-50 font-bold rounded-xl border border-slate-600 transition-all">
        Ajouter à la wishlist
      </button>
    </div>
  );
}
