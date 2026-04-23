import { useState, useCallback, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useQuery } from "@tanstack/react-query";
import { X, Zap, Loader2 } from "lucide-react";
import api from "../../services/api";
import { useUiStore } from "../../store/uiStore";

const ScannerModal = ({ onClose = () => {} }) => {
  const [scannedCode, setScannedCode] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const showToast = useUiStore((state) => state.showToast);
  const scannerRef = useRef(null);

  // TanStack Query for barcode
  const { data, error, isLoading } = useQuery({
    queryKey: ['scan', scannedCode],
    queryFn: async () => {
      const res = await api.get(`/proxy/scan?ean=${scannedCode}`);
      return res.data.data;
    },
    enabled: !!scannedCode,
    retry: false
  });

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await api.post("/collection_items", {
        externalProductId: data.externalProductId,
        category: data.category || "mixed"
      });
      showToast(`${data.title} ajouté !`, "success");
      onClose();
    } catch (err) {
      console.error("Erreur d'ajout", err);
      showToast("Erreur lors de l'ajout.", "error");
    } finally {
      setIsAdding(false);
    }
  };

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
    if (!node) return;
    
    const html5QrCode = new Html5Qrcode(node.id);
    scannerRef.current = html5QrCode;
    
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      handleScanSuccess,
      () => {}
    ).catch((err) => {
      console.error("Camera start error", err);
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, [handleScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface rounded-3xl overflow-hidden border border-accent/30 shadow-2xl shadow-accent/20">
        
        {/* Header HUD */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-black text-accent tracking-tighter">SCANNER_HUD</h2>
            <p className="text-[10px] text-accent/50 font-mono">READY_TO_DETECT</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent/10 rounded-full text-accent transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!scannedCode ? (
          <div className="p-6 space-y-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border-2 border-accent/20">
              <div id="reader" ref={scannerNodeRef} className="w-full h-full"></div>
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent"></div>
                <div className="absolute left-0 right-0 h-0.5 bg-accent/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-scan"></div>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={toggleTorch}
                className={`p-4 rounded-full transition-all ${
                  torchOn ? "bg-accent text-bg-main shadow-lg shadow-accent/40" : "bg-gray-800 text-gray-400"
                }`}
              >
                <Zap size={24} fill={torchOn ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="bg-accent/5 p-4 flex items-center space-x-3 rounded-xl border border-accent/10">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <p className="text-xs font-mono text-accent/70 uppercase tracking-widest">
                Positionnez le code-barres dans le cadre
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-6">
            {isLoading && (
              <div className="py-12 space-y-4">
                <Loader2 size={48} className="text-accent animate-spin mx-auto" />
                <p className="text-accent font-bold animate-pulse">Identification du produit...</p>
              </div>
            )}

            {error && (
              <div className="space-y-4 py-8">
                <div className="text-red-400 font-black text-2xl">NOT_FOUND</div>
                <p className="text-dim">Le code {scannedCode} ne correspond à aucun produit connu.</p>
                <button 
                  onClick={() => setScannedCode(null)}
                  className="bg-accent text-bg-main px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  RÉESSAYER
                </button>
              </div>
            )}

            {data && (
              <div className="space-y-6 animate-zoom-in">
                <div className="flex justify-center">
                   {data.imageUrl ? (
                     <img src={data.imageUrl} alt={data.title} className="w-32 h-40 object-cover rounded-lg shadow-xl border border-accent/20" />
                   ) : (
                     <div className="w-32 h-40 bg-gray-800 rounded-lg flex items-center justify-center text-accent/20">No Img</div>
                   )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{data.title}</h3>
                  <p className="text-accent/50 text-xs font-mono uppercase tracking-widest mt-1">{data.category}</p>
                </div>
                <button 
                  onClick={handleAdd}
                  disabled={isAdding}
                  className="w-full bg-accent text-bg-main py-4 rounded-2xl font-black uppercase tracking-tighter hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
                >
                  {isAdding ? "Synchronisation..." : "Ajouter à ma collection"}
                </button>
                <button 
                  onClick={() => setScannedCode(null)}
                  className="text-xs text-accent/50 underline hover:text-accent font-mono"
                >
                  ANNULER_ET_RESCANNER
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerModal;
