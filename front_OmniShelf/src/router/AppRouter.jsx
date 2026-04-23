import { RouterProvider } from "react-router-dom";
import { Router } from "./router.jsx";

export const AppRouter = () => {
  return <RouterProvider router={Router} />;
};
