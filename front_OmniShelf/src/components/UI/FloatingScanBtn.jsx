import { ScanBarcode } from "lucide-react";

const FloatingScanBtn = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-8 right-8 p-5 bg-accent text-bg-main rounded-2xl shadow-2xl shadow-accent/40 hover:scale-110 active:scale-95 transition-all z-40 flex items-center justify-center border border-white/10"
      aria-label="Scanner un code-barres"
    >
      <ScanBarcode size={32} strokeWidth={2.5} />
    </button>
  );
};

export default FloatingScanBtn;
