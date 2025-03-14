import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logOut } from "./features/auth/authSlice";
import {
    useGetUserMutation,
    useRefreshAccessTokenMutation,
} from "./features/auth/authApiSlice";

import {
    Home,
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

function App() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [refreshAccessToken] = useRefreshAccessTokenMutation();
    const [getUser] = useGetUserMutation();

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
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
