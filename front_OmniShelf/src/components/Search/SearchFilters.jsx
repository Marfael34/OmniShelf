const SearchFilters = ({ 
    publisher, 
    setPublisher, 
    genre, 
    setGenre, 
    platform, 
    setPlatform 
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-bg-surface border-2 border-gray-800 rounded-2xl animate-slide-up">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Maison d'édition</label>
                <input 
                    type="text" 
                    placeholder="Ex: Nintendo, Ubisoft..." 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-accent"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Genre</label>
                <select 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-accent"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                >
                    <option value="">Tous les genres</option>
                    <option value="Role-playing (RPG)">RPG</option>
                    <option value="Adventure">Aventure</option>
                    <option value="Shooter">Shooter</option>
                    <option value="Strategy">Stratégie</option>
                    <option value="Racing">Course</option>
                    <option value="Sport">Sport</option>
                    <option value="Platform">Plateforme</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dim">Plateforme</label>
                <select 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-accent"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                >
                    <option value="">Toutes les plateformes</option>
                    <option value="PC (Microsoft Windows)">PC</option>
                    <option value="PlayStation 5">PS5</option>
                    <option value="PlayStation 4">PS4</option>
                    <option value="Xbox Series X|S">Xbox Series</option>
                    <option value="Nintendo Switch">Switch</option>
                </select>
            </div>
        </div>
    );
};

export default SearchFilters;
