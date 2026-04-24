import { Folder } from "lucide-react";

const CollectionList = ({ collections, onSelect }) => {
  return (
    <div className="grid gap-3">
      <button 
        onClick={() => onSelect(null)}
        className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800/50 hover:bg-accent hover:text-bg-main transition-all group border border-gray-700/50 hover:border-accent"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center group-hover:bg-white/20">
          <Folder size={20} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold">Collection Principale</p>
          <p className="text-[10px] opacity-60 uppercase tracking-widest font-black">Défaut</p>
        </div>
      </button>

      {collections.map(col => (
        <button 
          key={col.id}
          onClick={() => onSelect(col.id)}
          className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800/50 hover:bg-accent hover:text-bg-main transition-all group border border-gray-700/50 hover:border-accent"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center group-hover:bg-white/20">
            <Folder size={20} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold">{col.name}</p>
            <p className="text-[10px] opacity-60 uppercase tracking-widest font-black">Collection perso</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CollectionList;
