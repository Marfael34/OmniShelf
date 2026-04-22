import { createBrowserRouter, Outlet } from "react-router-dom";
import { NavBar } from "../components/Ui/NavBar";

// Import des écrans (placeholders à compléter pour la suite)
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import MyCollections from "../screens/MyCollections";
import Wishlist from "../screens/Wishlist";
import Search from "../screens/Search";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white dark">
      <NavBar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/my-collections", element: <MyCollections /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/search", element: <Search /> },
      {
        path: "/details/game/:id",
        element: <div className="p-4 text-green-400">Détail Jeu Vidéo</div>,
      },
      {
        path: "/details/manga/:id",
        element: <div className="p-4 text-green-400">Détail Manga</div>,
      },
      {
        path: "/details/vinyl/:id",
        element: <div className="p-4 text-green-400">Détail Vinyle</div>,
      },
      {
        path: "/details/pop/:id",
        element: <div className="p-4 text-green-400">Détail Figurine POP</div>,
      },
    ],
  },
]);
