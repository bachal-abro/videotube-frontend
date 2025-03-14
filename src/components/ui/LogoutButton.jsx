import React from "react";
import { logout as authLogout } from "../../services/api/AuthApi";
// import { login, logout } from "../../services/store/authSlice";
import { useDispatch } from "react-redux";
const LogoutButton = () => {
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        await authLogout();
        dispatch(login());
        console.log("After: ", data);
    };
    return (
        <button className="bg-cyan-600 text-white" onClick={logoutHandler}>
            Logout
        </button>
    );
};

export default LogoutButton;
