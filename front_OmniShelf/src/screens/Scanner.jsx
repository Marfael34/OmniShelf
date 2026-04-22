import { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useQuery } from "@tanstack/react-query";
import { useScannerStore } from "../../store/useScannerStore";

export default function Scanner() {
  const { isOpen, closeScanner } = useScannerStore();
  const [scannedBarcode, setScannedBarcode] = useState(null);

  // React Query : Appelé uniquement lorsque 'scannedBarcode' n'est pas null
  const {
    data: figurine,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["scan", scannedBarcode],
    queryFn: async () => {
      // L'appel au BFF (Backend For Frontend) Symfony
      const response = await fetch(`/api/scan/${scannedBarcode}`);
      if (!response.ok) {
        throw new Error("Produit introuvable dans la base ou via API tierce.");
      }
      return response.json();
    },
    enabled: !!scannedBarcode,
    staleTime: 1000 * 60 * 5, // Cache les données pendant 5 minutes
  });

  // React 19 : Nettoyage directement via le retour de la fonction de la Ref
  const scannerRef = (node) => {
    if (!node || !isOpen || scannedBarcode) return;

    const html5QrCode = new Html5Qrcode(node.id);

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Vibration Haptique Mobile (Cahier des charges)
          if ("vibrate" in navigator) navigator.vibrate(200);

          // Arrêt immédiat de la caméra au succès
          html5QrCode
            .stop()
            .then(() => {
              setScannedBarcode(decodedText);
            })
            .catch(console.error);
        },
        () => {
          // Ignorer les erreurs de lecture de frame
        },
      )
      .catch((err) => console.error("Erreur de démarrage du scanner", err));

    // React 19 exécute ce retour quand le composant se démonte ou que la ref change
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <button
        onClick={closeScanner}
        className="absolute top-6 right-6 text-white text-3xl font-bold"
      >
        &times;
      </button>

      {!scannedBarcode ? (
        <div className="relative w-full max-w-md flex flex-col items-center">
          <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono tracking-widest uppercase">
            SCANNER ACTIF
          </h2>
          <div
            id="reader"
            ref={scannerRef}
            className="w-full overflow-hidden rounded-2xl border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,128,0.6)]"
          ></div>
          <p className="mt-8 text-green-400/70 font-mono text-center animate-pulse">
            Alignez le code-barres EAN-13 au centre
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md p-6 bg-gray-900 border border-green-500 rounded-xl shadow-[0_0_15px_rgba(0,255,128,0.5)]">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-6 py-8">
              <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-green-400 font-mono animate-pulse tracking-widest text-center">
                ANALYSE DES
                <br />
                RÉSEAUX EXTERNES...
              </p>
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-4">
              <p className="font-mono mb-4">{error.message}</p>
              <button
                onClick={() => setScannedBarcode(null)}
                className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500/20 font-bold uppercase transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <img
                src={figurine?.image_url}
                alt={figurine?.name}
                className="w-40 h-40 object-cover rounded-lg mb-6 shadow-lg shadow-black"
              />
              <h2 className="text-2xl font-bold text-center text-green-400 mb-2">
                {figurine?.name}
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">
                {figurine?.brand}
              </p>
              <button
                onClick={() => setScannedBarcode(null)}
                className="w-full px-4 py-3 border border-gray-600 text-gray-300 rounded font-bold hover:bg-gray-800 transition-colors mb-3 uppercase"
              >
                Scanner à nouveau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
