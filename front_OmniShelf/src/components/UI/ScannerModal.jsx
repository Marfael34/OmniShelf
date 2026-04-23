import { useState, useCallback } from "react";
import { useUiStore } from "../../store/uiStore.js";
import { useScanBarcode } from "../../hooks/useScanBarcode.js";

export default function ScannerModal() {
  const { isScannerOpen, closeScanner } = useUiStore();
  const [scannedCode, setScannedCode] = useState(null);
  const { data, error, isLoading } = useScanBarcode(scannedCode);

  const scannerRef = useCallback((node) => {
    if (!node) return;
    let scanner;
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode(node.id);
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decoded) => {
            if (navigator.vibrate) navigator.vibrate(200); // Feedback haptique
            scanner.stop().then(() => setScannedCode(decoded));
          },
          () => {}, // Ignore parse errors
        )
        .catch(console.error);
    });
    // Nettoyage standard React 19 via callback ref
    return () => {
      if (scanner?.isScanning) scanner.stop().catch(() => {});
    };
  }, []);

  if (!isScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <button
        onClick={() => {
          closeScanner();
          setScannedCode(null);
        }}
        className="absolute top-6 right-6 text-white text-xl bg-slate-800 p-4 rounded-full border border-slate-600 hover:bg-slate-700 z-50"
      >
        ✕
      </button>
      {!scannedCode ? (
        <>
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] bg-black">
            <div
              id="scanner-reader"
              ref={scannerRef}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1/2 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] opacity-50 pointer-events-none" />
          </div>
          <p className="mt-8 text-slate-300 font-medium">
            Scannez un code EAN-13 (Torch auto-géré)
          </p>
        </>
      ) : (
        <div className="text-center flex flex-col gap-4">
          {isLoading && (
            <p className="text-cyan-400 text-2xl font-bold animate-pulse">
              HUD: Résolution API...
            </p>
          )}
          {error?.message === "NOT_FOUND" && (
            <>
              <p className="text-red-400 text-xl">Produit Inconnu (404).</p>
              <button className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                Ajout Manuel
              </button>
            </>
          )}
          {data && (
            <p className="text-green-400 text-xl font-bold">
              Produit trouvé : {data.name || data.title}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
