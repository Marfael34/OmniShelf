import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

const CollectionHeader = ({ onNew, onDeleteCustom, isCustom }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <h1 className="text-4xl font-black text-text-main tracking-tighter italic">
      MA <span className="text-accent">BIBLIOTHÈQUE</span>
    </h1>
    <div className="flex items-center space-x-4">
      {isCustom && (
        <button 
          onClick={onDeleteCustom}
          className="flex items-center space-x-2 bg-red-900/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-900/40 transition-all"
        >
          <Trash2 size={16} />
          <span>Supprimer la Collection</span>
        </button>
      )}
      <Link to="/search" className="flex items-center space-x-2 bg-white/5 border border-white/10 text-text-main px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
        <Plus size={16} />
        <span>Chercher</span>
      </Link>
      <button onClick={onNew} className="flex items-center space-x-2 bg-accent text-bg-main px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/20">
        <span>Nouvelle Collection</span>
      </button>
    </div>
  </div>
);

export default CollectionHeader;
