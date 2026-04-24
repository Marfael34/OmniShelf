import { Outlet } from "react-router-dom";
import NavBar from "./components/UI/NavBar";
import FloatingScanBtn from "./components/UI/FloatingScanBtn";
import ScannerModal from "./components/UI/ScannerModal";
import Toast from "./components/UI/Toast";
import Loader from "./components/UI/Loader";
import ErrorBoundary from "./components/UI/ErrorBoundary";
import { useState, useEffect, Suspense } from "react";
import { useUiStore } from "./store/uiStore";
import AddToCollectionModal from "./components/UI/AddToCollectionModal";

const App = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const toast = useUiStore((state) => state.toast);
  const hideToast = useUiStore((state) => state.hideToast);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-main text-main font-sans relative">
      {isOffline && (
        <div className="bg-orange-600 text-white text-center py-1 text-sm font-bold sticky top-0 z-100 animate-pulse">
          Mode Hors-ligne : Affichage des données locales uniquement
        </div>
      )}
      <NavBar />
      <main className="container mx-auto p-4 pb-24">
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      
      <FloatingScanBtn onOpen={() => setIsScannerOpen(true)} />
      {isScannerOpen && <ScannerModal onClose={() => setIsScannerOpen(false)} />}
      <AddToCollectionModal />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
    </div>
  );
};

export default App;