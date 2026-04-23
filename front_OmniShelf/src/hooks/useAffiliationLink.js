export function useAffiliationLink(productName = "", fallbackEan = "") {
  // Identifiants d'affiliation via variables d'environnement
  const AMAZON_TAG = import.meta.env.VITE_AMAZON_TAG || "omnishelf-21";
  const FNAC_AWIN_ID = import.meta.env.VITE_FNAC_ID || "123456";

  const query = fallbackEan || productName;
  if (!query) return { amazon: null, fnac: null };

  const encodedQuery = encodeURIComponent(query);

  const amazon = `https://www.amazon.fr/s?k=${encodedQuery}&tag=${AMAZON_TAG}`;
  const fnacSearchUrl = encodeURIComponent(`https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodedQuery}`);
  const fnac = `https://www.awin1.com/cread.php?awinmid=${FNAC_AWIN_ID}&p=${fnacSearchUrl}`;

  return { amazon, fnac };
}