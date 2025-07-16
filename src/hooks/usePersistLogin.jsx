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
        const verifyRefreshToken = async () => {
            try {
                const data = await refreshAccessToken();
                dispatch(setCredentials({ token: data.data.accessToken }));
                const userData = await getUser().unwrap();
                dispatch(
                    setCredentials({
                        token: data.data.accessToken,
                        user: userData.data,
                    })
                );
                setPersistLoaded(true);
            } catch (err) {
                dispatch(logOut());
                setPersistLoaded(true);
            } finally {
                setPersistLoaded(true);
            }
        };
        if (token == null) {
            verifyRefreshToken();
        } else {
            setPersistLoaded(true);
            console.log("token");
        }
    }, [token, dispatch, refreshAccessToken, getUser]);
    return persistLoaded;
};

export default usePersistLogin;
