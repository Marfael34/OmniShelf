import api from "../api";

/**
 * Service pour interagir avec le proxy de données (Jeux, Livres, POPs, Vinyles)
 */
export const proxyService = {
    /**
     * Recherche globale ou par catégorie
     */
    search: async (query, category = 'all', page = 1, filters = {}) => {
        let url = `/proxy/search?query=${encodeURIComponent(query)}&category=${category}&page=${page}`;
        
        if (filters.publisher) url += `&publisher=${encodeURIComponent(filters.publisher)}`;
        if (filters.genre) url += `&genre=${encodeURIComponent(filters.genre)}`;
        if (filters.platform) url += `&platform=${encodeURIComponent(filters.platform)}`;
        
        const res = await api.get(url);
        return res.data;
    },

    /**
     * Récupère les détails d'un produit externe
     */
    getDetails: async (externalId, category) => {
        const res = await api.get(`/proxy/details?external_id=${externalId}&category=${category}`);
        return res.data.data;
    },

    /**
     * Recherche spécifique IGDB (via le nouveau contrôleur)
     */
    igdbSearch: async (query, limit = 10) => {
        const res = await api.get(`/proxy/igdb/search?query=${encodeURIComponent(query)}&limit=${limit}`);
        return res.data.data;
    },

    /**
     * Détails spécifiques IGDB
     */
    igdbDetails: async (igdbId) => {
        const res = await api.get(`/proxy/igdb/details?external_id=${igdbId}`);
        return res.data.data;
    },

    /**
     * Scan de code-barres
     */
    scan: async (ean) => {
        const res = await api.get(`/proxy/scan?ean=${ean}`);
        return res.data.data;
    }
};
