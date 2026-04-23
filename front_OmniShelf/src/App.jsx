import { Outlet } from "react-router-dom";
import NavBar from "./components/UI/NavBar";
import FloatingScanBtn from "./components/UI/FloatingScanBtn";
import ScannerModal from "./components/UI/ScannerModal";
import { useState } from "react";

const App = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-(--bg-main) text-(--text-main) font-sans relative">
      <NavBar />
      <main className="container mx-auto p-4 pb-24">
        <Outlet />
      </main>
      
      <FloatingScanBtn onOpen={() => setIsScannerOpen(true)} />
      {isScannerOpen && <ScannerModal onClose={() => setIsScannerOpen(false)} />}
    </div>
  );
};

export default App;