import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

import Home from "../screens/Home.jsx";
import Profile from "../screens/Profile.jsx";
import MyCollections from "../screens/MyCollections.jsx";
import Wishlist from "../screens/Wishlist.jsx";
import Search from "../screens/Search.jsx";
import GameDetails from "../screens/GameDetails.jsx";
import MangaDetails from "../screens/MangaDetails.jsx";
import VinylDetails from "../screens/VinylDetails.jsx";
import PopDetails from "../screens/PopDetails.jsx";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/my-collections", element: <MyCollections /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/search", element: <Search /> },
      { path: "/details/game/:id", element: <GameDetails /> },
      { path: "/details/manga/:id", element: <MangaDetails /> },
      { path: "/details/vinyl/:id", element: <VinylDetails /> },
      { path: "/details/pop/:id", element: <PopDetails /> },
    ],
  },
]);
