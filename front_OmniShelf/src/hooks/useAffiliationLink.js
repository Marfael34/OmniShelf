export function useAffiliationLink(productName = "", fallbackEan = "") {
  // Identifiants d'affiliation via variables d'environnement
  const AMAZON_TAG = import.meta.env.VITE_AMAZON_TAG || "omnishelf-21";
  const FNAC_AWIN_ID = import.meta.env.VITE_FNAC_ID || "123456";

  const effectiveQuery = productName || fallbackEan;
  if (!effectiveQuery) return { amazon: null, fnac: null };

  const encodedQuery = encodeURIComponent(effectiveQuery);

  const amazon = `https://www.amazon.fr/s?k=${encodedQuery}&tag=${AMAZON_TAG}`;
  // Correction Fnac : Utilisation d'un lien direct si l'ID Awin est par défaut/invalide
  const fnac = `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodedQuery}`;

  return { amazon, fnac };
}