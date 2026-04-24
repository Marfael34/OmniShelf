import { X } from "lucide-react";

const SearchFilters = ({ 
    publisher, 
    setPublisher, 
    genre, 
    setGenre, 
    platform, 
    setPlatform 
}) => {
    const handleReset = () => {
        setPublisher("");
        setGenre("");
        setPlatform("");
    };

    return (
        <div className="relative mt-4 p-8 bg-bg-surface/40 backdrop-blur-md border border-white/10 rounded-4xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Filtres Avancés</h3>
                <button 
                    onClick={handleReset}
                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white transition-colors"
                >
                    <X size={14} />
                    <span>Réinitialiser</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim/70 ml-1">Maison d'édition / Studio</label>
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="Ex: Nintendo, Ubisoft..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-accent/50 focus:bg-white/10 transition-all placeholder:text-text-dim/30"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                        />
                        <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim/70 ml-1">Genre Préféré</label>
                    <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-accent/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <option value="" className="bg-bg-surface">Tous les genres</option>
                        <option value="Role-playing (RPG)" className="bg-bg-surface">RPG</option>
                        <option value="Adventure" className="bg-bg-surface">Aventure</option>
                        <option value="Shooter" className="bg-bg-surface">Shooter</option>
                        <option value="Strategy" className="bg-bg-surface">Stratégie</option>
                        <option value="Racing" className="bg-bg-surface">Course</option>
                        <option value="Sport" className="bg-bg-surface">Sport</option>
                        <option value="Platform" className="bg-bg-surface">Plateforme</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim/70 ml-1">Plateforme</label>
                    <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-accent/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                    >
                        <option value="" className="bg-bg-surface">Toutes les plateformes</option>
                        <option value="PC (Microsoft Windows)" className="bg-bg-surface">PC</option>
                        <option value="PlayStation 5" className="bg-bg-surface">PS5</option>
                        <option value="PlayStation 4" className="bg-bg-surface">PS4</option>
                        <option value="Xbox Series X|S" className="bg-bg-surface">Xbox Series</option>
                        <option value="Nintendo Switch" className="bg-bg-surface">Switch</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
