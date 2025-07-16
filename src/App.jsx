import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Home,
    VideoView,
    Subscriptions,
    Profile,
    History,
    LikedVideos,
    Settings,
} from "./pages/index";

import Layout from "./layout/Layout";
import Login from "./pages/Login";
import RequireAuth from "./features/auth/RequireAuth";
import ProfileHome from "./components/ProfileHome";
import usePersistLogin from "./hooks/usePersistLogin";
import LogoutButton from "./components/ui/LogoutButton";
import VideoDetailPage from "./pages/VideoDetailPage";
import { useState } from "react";

function App() {
    const persistLoaded = usePersistLogin();
    if (!persistLoaded) return <p>Loading...</p>; // or a spinner

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route path="login" element={<Login />} />
                {/* protected routes */}
                <Route element={<RequireAuth />}>
                    <Route index element={<Home />} />
                    <Route path=":username" element={<Profile />}>
                        <Route element={<ProfileHome />} />
                    </Route>
                    <Route path="subscriptions" element={<Subscriptions />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="logout" element={<Login />} />

                    {/* Videos */}
                    <Route
                        path="videos/:videoId"
                        element={<VideoDetailPage />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
