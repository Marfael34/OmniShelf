import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Placeholder title="Accueil" /> },
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
