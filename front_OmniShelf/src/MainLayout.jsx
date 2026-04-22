import { Outlet } from "react-router-dom";
import NavBar from "../Ui/NavBar";
import Scanner from "../../screens/Scanner";
import useAuthStore from "../../store/authStore";

export default function MainLayout() {
  // Remplacement de useContext(AuthContext) par Zustand (useAuthStore)
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 pb-20">
      <NavBar user={user} onLogout={logout} />
      <main className="flex-1 w-full max-w-7xl mx-auto pt-8 text-white">
        <Outlet context={{ user }} />
      </main>
      <Scanner />
    </div>
  );
}
