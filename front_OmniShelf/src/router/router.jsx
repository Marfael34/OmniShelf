import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import MyCollections from "../screens/MyCollections";
import Wishlist from "../screens/Wishlist";
import Search from "../screens/Search";
import GameDetails from "../screens/GameDetails";
import MangaDetails from "../screens/MangaDetails";
import VinylDetails from "../screens/VinylDetails";
import PopDetails from "../screens/PopDetails";

export const Router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/my-collections", element: <MyCollections /> },
  { path: "/wishlist", element: <Wishlist /> },
  { path: "/search", element: <Search /> },
  { path: "/details/game/:id", element: <GameDetails /> },
  { path: "/details/manga/:id", element: <MangaDetails /> },
  { path: "/details/vinyl/:id", element: <VinylDetails /> },
  { path: "/details/pop/:id", element: <PopDetails /> },
]);
