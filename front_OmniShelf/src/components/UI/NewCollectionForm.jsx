import { Loader2 } from "lucide-react";

const NewCollectionForm = ({ name, setName, onCreate, onCancel, isPending }) => {
  return (
    <div className="p-4 rounded-2xl bg-gray-900 border border-accent/30 space-y-4">
      <input 
        type="text" 
        placeholder="Nom de la collection..."
        className="w-full bg-transparent border-b border-gray-700 focus:border-accent outline-none py-2 font-bold"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <div className="flex space-x-2">
        <button 
          onClick={onCreate}
          className="flex-1 bg-accent text-bg-main py-2 rounded-xl font-bold flex items-center justify-center"
          disabled={isPending || !name}
        >
          {isPending ? <Loader2 className="animate-spin" size={16} /> : "Créer"}
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-800 rounded-xl font-bold text-white hover:bg-gray-700 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default NewCollectionForm;
