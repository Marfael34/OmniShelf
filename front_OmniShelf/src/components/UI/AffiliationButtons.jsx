import { useAffiliationLink } from "../../hooks/useAffiliationLink";
import { ShoppingCart, ExternalLink } from "lucide-react";

const AffiliationButtons = ({ productName = "", ean = "" }) => {
  const { amazon, fnac } = useAffiliationLink(productName, ean);

  if (!amazon && !fnac) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-main flex items-center space-x-2">
        <ShoppingCart size={20} className="text-accent" />
        <span>ACHETER SUR LE MARCHÉ</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {amazon && (
          <a 
            href={amazon} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl hover:bg-orange-500/20 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <span className="font-bold text-orange-500">Amazon.fr</span>
            </div>
            <ExternalLink size={16} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        )}
        
        {fnac && (
          <a 
            href={fnac} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl hover:bg-yellow-500/20 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <span className="font-bold text-yellow-600 font-serif italic">Fnac</span>
            </div>
            <ExternalLink size={16} className="text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AffiliationButtons;
