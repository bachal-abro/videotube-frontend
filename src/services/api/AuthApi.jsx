import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/users",
});

export const login = async () => {
    return await api.post("/login", {
        username: "testuser",
        password: "testpass",
    });
};
