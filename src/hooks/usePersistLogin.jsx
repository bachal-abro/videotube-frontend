import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logOut } from "../features/auth/authSlice";
import {
    useRefreshAccessTokenMutation,
    useGetUserMutation,
} from "../features/auth/authApiSlice";

const usePersistLogin = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const [persistLoaded, setPersistLoaded] = useState(false);
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
                            dispatch(
                                setCredentials({
                                    token: data.data.accessToken,
                                    user: userData.data,
                                })
                            );
                            setPersistLoaded(true);
                        })
                        .catch((error) => {
                            console.error("Failed to fetch user info:", error);
                            dispatch(logOut());
                            setPersistLoaded(true);
                        });
                })
                .catch((err) => {
                    console.error("Token refresh failed:", err);
                    dispatch(logOut());
                    setPersistLoaded(true);
                });
        }
    }, [token, dispatch, refreshAccessToken, getUser]);

    return persistLoaded;
};

export default usePersistLogin;
