import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./Pages/HomePage";
import HighScoresPage from "./Pages/HighScores";
import AdminPage from "./Pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,  // ✅ Layout is already wrapped in AppContextProvider
    children: [
      { index: true, element: <HomePage /> },
      { path: "highscorespage", element: <HighScoresPage /> },
      //{ path: "adminpage", element: <AdminPage /> },
    ],
  },
]);



const AppRouter = () => {

  try {
    return <RouterProvider router={router} />;
  } catch (error) {
    console.error("❌ RouterProvider failed to mount:", error);
    return <div>Router failed to load</div>;
  }
};

export default AppRouter;
