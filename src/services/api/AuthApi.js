import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/users",
});

export const apiAuthenticated = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const login = async (username, password) => {
    return await api.post(
        "/login",
        {
            username: username,
            password: password,
        },
        { withCredentials: true }
    );

};

export const logout = () => {
    return api.post("/logout");
};

export const refreshAccess = () => {
    return api.post("/refresh-token", {}, { withCredentials: true });
};

export default api;
