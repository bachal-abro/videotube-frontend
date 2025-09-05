import { Routes, Route } from "react-router-dom";
import {
    HomePage,
    LoginPage,
    SubscriptionsPage,
    ProfilePage,
    HistoryPage,
    WatchLaterPage,
    LikedVideosPage,
    SettingsPage,
    PlaylistsPage,
    PlaylistDetailPage,
    UploadPage,
    YourVideosPage,
    SignupPage,
    VideoDetailPage,
    DashboardPage,
} from "./pages/index";

import Layout from "./layout/Layout";
import RequireAuth from "./features/auth/RequireAuth";
import usePersistLogin from "./hooks/usePersistLogin";
import { Toaster } from "./components/Toast"; // Import Toaster
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
                        <Route index element={<HomePage />} />
                        <Route
                            path=":username"
                            element={<ProfilePage />}
                        ></Route>
                        <Route
                            path="subscriptions"
                            element={<SubscriptionsPage />}
                        />
                        <Route path="history" element={<HistoryPage />} />
                        <Route
                            path="watch-later"
                            element={<WatchLaterPage />}
                        />
                        <Route path="liked" element={<LikedVideosPage />} />
                        <Route path="playlists" element={<PlaylistsPage />} />
                        <Route
                            path="playlist/:id"
                            element={<PlaylistDetailPage />}
                        />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="logout" element={<LoginPage />} />
                        <Route path="upload" element={<UploadPage />} />
                        <Route
                            path="your-videos"
                            element={<YourVideosPage />}
                        />
                        <Route path="dashboard" element={<DashboardPage />} />
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
