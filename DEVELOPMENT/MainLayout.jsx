import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Scanner from "../../screens/Scanner";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <NavBar />
      <main className="max-w-7xl mx-auto w-full pt-8">
        <Outlet />
      </main>
      <Scanner />
    </div>
  );
}
