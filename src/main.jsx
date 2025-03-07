import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import vibeVerseStore from "./services/store/index.js";
import App from "./App.jsx";
import "./index.css";
import Home from "./pages/Home.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Profile from "./pages/Profile.jsx";
import History from "./pages/History.jsx";
import ProfileHome from "./components/ProfileHome.jsx";
import ProfileVideos from "./components/ProfileVideos.jsx";
import ProfilePlaylists from "./components/ProfilePlaylists.jsx";
import ProfileCommunity from "./components/ProfileCommunity.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import Settings from "./pages/Settings.jsx";
import CreateContent from "./pages/CreateContent.jsx";
import VideoView from "./pages/VideoView.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/subscriptions", element: <Subscriptions /> },
      {
        path: "/@username",
        element: <Profile />,
        children:[
          {path: "/@username", element: <ProfileHome />},
          {path: "/@username/videos", element: <ProfileVideos />},
          {path: "/@username/playlists", element: <ProfilePlaylists />},
          {path: "/@username/community", element: <ProfileCommunity />},
        ]
      },
      { path: "/history", element: <History /> },
      { path: "/liked", element: <LikedVideos /> },
      { path: "/settings", element: <Settings /> },
      { path: "/videos/:videoid", element: <VideoView /> },
      {
        path: "/create",
        element: <CreateContent />,
        children:[
          {path: "/create/video", element: <ProfileHome />},
          {path: "/create/post", element: <ProfileVideos />},
        ]
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={vibeVerseStore}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
