import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/HomePage";
import HighScores from "./Pages/HighScores";
import Admin from "./Pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,                            // Navbar layout
    children: [
      { index: true, element: <Home /> },           // Default to home page
      { path: "highscores", element: <HighScores /> },
      { path: "admin", element: <Admin /> },        // Protected later
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
