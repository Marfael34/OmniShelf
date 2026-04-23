import { ScanBarcode } from "lucide-react";

const FloatingScanBtn = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 p-4 bg-(--color-accent) text-(--bg-main) rounded-full shadow-lg hover:scale-110 transition-transform z-40 flex items-center justify-center"
      aria-label="Scanner un code-barres"
    >
      <ScanBarcode size={28} />
    </button>
  );
};

export default FloatingScanBtn;
