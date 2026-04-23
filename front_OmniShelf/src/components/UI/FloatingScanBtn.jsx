import { useUiStore } from "../../store/uiStore.js";

export default function FloatingScanBtn() {
  const openScanner = useUiStore((state) => state.openScanner);

  return (
    <button
      onClick={openScanner}
      className="fixed bottom-6 right-6 w-16 h-16 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center text-3xl hover:bg-cyan-400 transition-all hover:scale-110 z-40"
      aria-label="Scanner un code-barres"
    >
      📷
    </button>
  );
}
