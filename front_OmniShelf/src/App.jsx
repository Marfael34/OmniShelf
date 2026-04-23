import { Outlet } from "react-router-dom";
import NavBar from "./components/UI/NavBar";

const App = () => {
  return (
    <div className="min-h-screen bg-(--bg-main) text-(--text-main) font-sans">
      <NavBar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default App;