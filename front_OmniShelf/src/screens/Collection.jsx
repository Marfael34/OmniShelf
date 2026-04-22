import { useOptimistic } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Collection() {
  const queryClient = useQueryClient();

  // 1. Récupération de la collection (Live Data / Cache via TanStack Query)
  const {
    data: collection = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["collection"],
    queryFn: async () => {
      const res = await fetch("/api/collection");
      if (!res.ok) throw new Error("Erreur serveur lors de la récupération");
      return res.json();
    },
  });

  // 2. React 19 : UI Optimiste pour une sensation de vitesse instantanée
  const [optimisticCollection, dispatchOptimistic] = useOptimistic(
    collection,
    (state, idToRemove) => state.filter((item) => item.id !== idToRemove),
  );

  // 3. Mutation de suppression réelle
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/collection/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Impossible de supprimer la figurine");
    },
    onSuccess: () => {
      // Synchronise les données réelles en arrière-plan après le succès
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
  });

  const handleDelete = (id) => {
    // Mise à jour immédiate de l'interface (React 19)
    dispatchOptimistic(id);
    // Lancement de la requête asynchrone en arrière-plan
    deleteMutation.mutate(id);
  };

  if (isLoading)
    return (
      <div className="text-center mt-20 text-green-400 font-mono animate-pulse text-xl">
        Chargement des données sécurisées...
      </div>
    );
  if (isError)
    return (
      <div className="text-center mt-20 text-red-500 font-mono text-xl">
        Connexion aux serveurs échouée.
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-400 mb-8 font-mono tracking-widest border-b border-green-500/30 pb-4">
        BASE DE DONNÉES LOCALE
      </h1>

      {optimisticCollection.length === 0 ? (
        <p className="text-gray-400 text-center py-10 font-mono">
          La base de données est vide. Lancez le scanner pour initialiser la
          collecte.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {optimisticCollection.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg flex flex-col relative group transition-all hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(0,255,128,0.2)]"
            >
              <img
                src={item.figurine?.image_url}
                alt={item.figurine?.name}
                className="w-full h-48 object-cover rounded-lg mb-4 shadow-black shadow-inner bg-gray-800"
              />
              <h3 className="text-lg font-bold text-white leading-tight mb-1">
                {item.figurine?.name}
              </h3>
              <p className="text-xs text-green-400/80 uppercase tracking-widest mb-4">
                {item.figurine?.brand}
              </p>
              <button
                onClick={() => handleDelete(item.id)}
                className="mt-auto w-full py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/50 rounded transition-colors font-bold uppercase text-xs tracking-wider"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
