export function useAffiliationLink(productName, category, fallbackEan = "") {
  // Identifiants d'affiliation (à extraire dans un .env côté production)
  const AMAZON_TAG = "omnishelf-21";
  const FNAC_AWIN_ID = "123456";

  const query = fallbackEan || productName;
  const encodedQuery = encodeURIComponent(query);

  const amazon = `https://www.amazon.fr/s?k=${encodedQuery}&tag=${AMAZON_TAG}`;
  const fnacSearchUrl = encodeURIComponent(`https://www.fnac.com/SearchResult/ResultList.aspx?Search=${encodedQuery}`);
  const fnac = `https://www.awin1.com/cread.php?awinmid=${FNAC_AWIN_ID}&clickref=&p=${fnacSearchUrl}`;

  return { amazon, fnac };
}