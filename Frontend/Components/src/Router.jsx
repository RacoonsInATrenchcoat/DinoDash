import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./Pages/HomePage";
import HighScoresPage from "./Pages/HighScores";
import AdminPage from "./Pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,                            // Navbar layout
    children: [
      { index: true, element: <HomePage /> },           // Default to home page
      { path: "highscorespage", element: <HighScoresPage /> },
      { path: "adminpage", element: <AdminPage /> },        // Protected later
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
