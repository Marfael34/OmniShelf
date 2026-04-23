import { useAffiliationLink } from "../../hooks/useAffiliationLink.js";

export default function AffiliationButtons({
  productName,
  category,
  fallbackEan,
}) {
  const links = useAffiliationLink(productName, category, fallbackEan);

  return (
    <div className="flex gap-3 mb-2 mt-2">
      <a
        href={links.amazon}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-slate-800 text-[#FF9900] border border-[#FF9900]/30 rounded-lg hover:bg-[#FF9900]/10 transition-colors text-sm font-bold flex items-center gap-2 shadow-soft"
      >
        🛒 Amazon
      </a>
      <a
        href={links.fnac}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-slate-800 text-[#E1A925] border border-[#E1A925]/30 rounded-lg hover:bg-[#E1A925]/10 transition-colors text-sm font-bold flex items-center gap-2 shadow-soft"
      >
        🛒 Fnac
      </a>
    </div>
  );
}
