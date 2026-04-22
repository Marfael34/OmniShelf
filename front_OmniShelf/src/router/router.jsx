import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import Home from "../screens/Home.jsx";

// Composant temporaire pour les routes non développées
const Placeholder = ({ title }) => (
  <div className="p-8 text-center text-green-400 font-mono text-2xl uppercase tracking-widest">
    {title} (EN CONSTRUCTION)
  </div>
);

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile", element: <Placeholder title="Profil Utilisateur" /> },
      {
        path: "/my-collections",
        element: <Placeholder title="Mes Collections" />,
      },
      { path: "/wishlist", element: <Placeholder title="Wishlist Commune" /> },
      { path: "/search", element: <Placeholder title="Recherche avancée" /> },
      {
        path: "/details/game/:id",
        element: <Placeholder title="Détails Jeu Vidéo" />,
      },
      {
        path: "/details/manga/:id",
        element: <Placeholder title="Détails Manga" />,
      },
      {
        path: "/details/vinyl/:id",
        element: <Placeholder title="Détails Vinyle" />,
      },
      {
        path: "/details/pop/:id",
        element: <Placeholder title="Détails Figurine POP" />,
      },
    ],
  },
]);
