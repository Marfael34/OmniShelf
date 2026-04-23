import { useState, useCallback, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import axios from "axios";

const ScannerModal = ({ onClose }) => {
  const [scannedCode, setScannedCode] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const scannerRef = useRef(null);

  // TanStack Query for barcode
  const { data, error, isLoading } = useQuery({
    queryKey: ['scan', scannedCode],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/scan/${scannedCode}`);
      return res.data;
    },
    enabled: !!scannedCode,
    retry: false
  });

  const handleScanSuccess = useCallback((decodedText) => {
    if ("vibrate" in navigator) navigator.vibrate(200);
    setScannedCode(decodedText);
    if (scannerRef.current) {
        scannerRef.current.pause(true);
    }
  }, []);

  const toggleTorch = useCallback(async () => {
    if (!scannerRef.current) return;
    try {
      const settings = scannerRef.current.getRunningTrackCameraCapabilities();
      if (settings && settings.hasTorch()) {
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      }
    } catch (err) {
      console.warn("Torch not supported", err);
    }
  }, [torchOn]);

  const scannerNodeRef = useCallback((node) => {
    if (node) {
      const html5QrCode = new Html5Qrcode(node.id);
      scannerRef.current = html5QrCode;
      
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        handleScanSuccess,
        () => {
          // Ignore parse errors
        }
      ).catch((err) => {
        console.error("Camera start error", err);
      });

      return () => {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
        }
      };
    }
  }, [handleScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 z-50"
      >
        <X size={24} />
      </button>

      {!scannedCode ? (
        <div className="w-full max-w-md relative">
          <div id="reader" ref={scannerNodeRef} className="w-full rounded-2xl overflow-hidden border-2 border-(--color-accent)"></div>
          <div className="absolute inset-0 pointer-events-none border-4 border-(--color-accent)/50 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_red] animate-pulse"></div>
          </div>
          <button 
            onClick={toggleTorch} 
            className="mt-6 mx-auto block px-6 py-2 bg-gray-800 text-white rounded-full font-bold shadow-lg"
          >
            {torchOn ? "Éteindre Torche" : "Allumer Torche"}
          </button>
        </div>
      ) : (
        <div className="p-8 bg-(--bg-surface) rounded-2xl border border-gray-800 shadow-(--shadow-soft) text-center max-w-md w-full">
          {isLoading && (
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-(--color-accent) border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-(--color-accent) font-bold animate-pulse">Recherche dans la base de données...</p>
            </div>
          )}
          
          {error?.response?.status === 404 && (
             <div className="space-y-4">
                <div className="text-red-400 font-bold text-xl">Produit Inconnu</div>
                <p className="text-(--text-dim)">Le code-barres {scannedCode} n'est pas reconnu.</p>
                <button className="bg-(--color-accent) text-(--bg-main) px-6 py-3 rounded-xl font-bold w-full hover:opacity-90">
                  Ajout Manuel
                </button>
                <button onClick={() => setScannedCode(null)} className="text-(--text-dim) hover:text-(--text-main) underline mt-4 block mx-auto">
                  Réessayer
                </button>
             </div>
          )}

          {data && (
            <div className="space-y-4">
               <div className="text-green-400 font-bold text-xl">Produit Trouvé !</div>
               <p className="font-bold">{data.name}</p>
               <button className="bg-(--color-accent) text-(--bg-main) px-6 py-3 rounded-xl font-bold w-full hover:opacity-90 mt-4">
                 Voir les détails
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScannerModal;
