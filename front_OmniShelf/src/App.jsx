import { Outlet } from "react-router-dom";
import NavBar from "./components/UI/NavBar.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navigation persistante gérée grâce à <Outlet /> */}
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
