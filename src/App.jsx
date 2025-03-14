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

function App() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [refreshAccessToken] = useRefreshAccessTokenMutation();
    const [getUser] = useGetUserMutation();

    useEffect(() => {
        // If no access token is found in Redux state, attempt to refresh it.
        if (!token) {
            refreshAccessToken()
                .unwrap()
                .then((data) => {
                    // Store the token using the key "token"
                    dispatch(setCredentials({ token: data.data.accessToken }));
                    getUser()
                        .unwrap()
                        .then((userData) => {
                            console.log(
                                "New access token:",
                                data.data.accessToken
                            );

                            dispatch(
                                setCredentials({
                                    token: data.data.accessToken,
                                    user: userData.data,
                                })
                            );
                        })
                        .catch((error) => {
                            console.error("Failed to fetch user info:", error);
                            dispatch(logOut());
                        });
                })
                .catch((err) => {
                    console.error("Token refresh failed:", err);
                    dispatch(logOut());
                });
        }
    }, [token, dispatch, refreshAccessToken, getUser]);

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
