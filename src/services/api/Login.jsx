import axios, { Axios } from "axios";
import { login } from "../store/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await axios.post(
                    "http://localhost:8000/api/v1/users/login",
                    {
                        username: "testuser",
                        password: "testpass",
                        signal: controller.signal,
                    }
                );

                if (response.data.success) {
                    dispatch(login(response.data.user));
                }
                navigate("/");
                console.log(response.data);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request Canceled", error.message);
                    return;
                }
                setError(error.message);
                setLoading(false);
            }

            return () => {
                controller.abort();
            };
        })();
    }, []);

    return [data, error, loading];
};

export default Login;
