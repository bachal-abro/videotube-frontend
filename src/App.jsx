import { Routes, Route } from "react-router-dom";
import {
    Home,
    VideoView,
    LoginPage,
    Subscriptions,
    Profile,
    History,
    WatchLaterPage,
    LikedVideos,
    Settings,
    PlaylistsPage,
    PlaylistDetailPage,
    UploadPage,
    YourVideosPage,
    SignupPage,
} from "./pages/index";

import Layout from "./layout/Layout";
import RequireAuth from "./features/auth/RequireAuth";
import ProfileHome from "./components/ProfileHome";
import usePersistLogin from "./hooks/usePersistLogin";
import LogoutButton from "./components/ui/LogoutButton";
import VideoDetailPage from "./pages/VideoDetailPage";
import { useState } from "react";
import { Toaster } from "./components/ui/toast"; // Import Toaster
function App() {
    const persistLoaded = usePersistLogin();
    if (!persistLoaded) return <p>Loading...</p>; // or a spinner

    return (
        <>
            {" "}
            {/* Use a fragment to wrap Routes and Toaster */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* public routes */}
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                    
                    {/* protected routes */}
                    <Route element={<RequireAuth />}>
                        <Route index element={<Home />} />
                        <Route path=":username" element={<Profile />}>
                            <Route element={<ProfileHome />} />
                        </Route>
                        <Route
                            path="subscriptions"
                            element={<Subscriptions />}
                        />
                        <Route path="history" element={<History />} />
                        <Route
                            path="watch-later"
                            element={<WatchLaterPage />}
                        />
                        <Route path="liked" element={<LikedVideos />} />
                        <Route path="playlists" element={<PlaylistsPage />} />
                        <Route
                            path="playlist/:id"
                            element={<PlaylistDetailPage />}
                        />
                        <Route path="settings" element={<Settings />} />
                        <Route path="logout" element={<LoginPage />} />
                        <Route path="upload" element={<UploadPage />} />
                        <Route
                            path="your-videos"
                            element={<YourVideosPage />}
                        />
                        {/* Videos */}
                        <Route
                            path="video/:videoId"
                            element={<VideoDetailPage />}
                        />
                    </Route>
                </Route>
            </Routes>
            <Toaster /> {/* Add Toaster component here */}
        </>
    );
}

export default App;
