import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { apiAuthenticated } from "../services/api/AuthApi";

const useInterceptor = () => {
    const refresh = useRefreshToken();

    useEffect(() => {
        // Ensure credentials (cookies) are always included in requests
        apiAuthenticated.defaults.withCredentials = true;

        const responseIntercept = apiAuthenticated.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    await refresh(); // Refresh tokens (cookies are automatically updated)
                    return apiAuthenticated(prevRequest); // Retry the failed request
                }
                return Promise.reject(error);
            }
        );

        return () => {
            apiAuthenticated.interceptors.response.eject(responseIntercept);
        };
    }, [refresh]);

    return apiAuthenticated;
};

export default useInterceptor;
