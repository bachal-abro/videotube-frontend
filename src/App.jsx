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

function App() {
    const persistLoaded = usePersistLogin();

    if (!persistLoaded) {
        return <div>Loading...</div>; // Show loader until auth check completes
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                {/* protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="@username" element={<Profile />}>
                        <Route path="@username/" element={<ProfileHome />} />
                    </Route>
                    <Route path="subscriptions" element={<Subscriptions />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="logout" element={<LogoutButton />} />

                    {/* Videos */}
                    <Route path="videos/:videoId" element={<VideoDetailPage/>} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
