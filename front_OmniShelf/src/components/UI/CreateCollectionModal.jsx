import { useState } from "react";
import { X, Loader2, Plus, FolderPlus } from "lucide-react";

const CreateCollectionModal = ({ isOpen, onClose, onCreate, isPending }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name);
      setName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <form 
        onSubmit={handleSubmit}
        className="bg-bg-surface w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-text-main italic tracking-tighter">
            NOUVELLE <span className="text-accent">COLLECTION</span>
          </h2>
          <button type="button" onClick={onClose} className="text-text-dim hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim ml-1">
              Nom de la collection
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mes Mangas Favoris"
              className="w-full bg-bg-main border border-white/5 rounded-2xl p-4 text-text-main focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-bold placeholder:text-text-dim/30"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full bg-accent text-bg-main py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-accent/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:grayscale"
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
            <span>Créer la Collection</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCollectionModal;
