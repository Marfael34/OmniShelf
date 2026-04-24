import { X } from "lucide-react";
import { useState, useEffect } from "react";

const SearchFilters = ({ setFilters }) => {
    const [local, setLocal] = useState({ publisher: "", genre: "", platform: "" });

    useEffect(() => {
        const timer = setTimeout(() => setFilters(local), 500);
        return () => clearTimeout(timer);
    }, [local, setFilters]);

    const update = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));

    return (
        <div className="relative mt-4 p-8 bg-bg-surface/40 backdrop-blur-md border border-white/10 rounded-4xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Filtres Avancés</h3>
                <button onClick={() => setLocal({ publisher: "", genre: "", platform: "" })} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white transition-colors"><X size={14} /><span>Réinitialiser</span></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim/70 ml-1">Studio</label>
                    <input type="text" placeholder="Ex: Nintendo..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-accent/50 transition-all text-text-main" value={local.publisher} onChange={(e) => update('publisher', e.target.value)} />
                </div>

                {[ { label: 'Genre', key: 'genre', options: ['RPG', 'Adventure', 'Shooter', 'Strategy', 'Racing', 'Sport', 'Platform'] },
                   { label: 'Plateforme', key: 'platform', options: ['PC', 'PS5', 'PS4', 'Xbox Series', 'Switch'] },
                   { label: 'Trier par', key: 'sortBy', options: ['Nom (A-Z)', 'Nom (Z-A)', 'Meilleures Notes'] }
                ].map(group => (
                    <div key={group.key} className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-dim/70 ml-1">{group.label}</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-accent/50 cursor-pointer text-text-main" value={local[group.key]} onChange={(e) => update(group.key, e.target.value)}>
                            <option value="" className="bg-bg-surface">Par défaut</option>
                            {group.options.map(opt => <option key={opt} value={opt} className="bg-bg-surface">{opt}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchFilters;
