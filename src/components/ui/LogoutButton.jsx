import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/auth/authSlice";
import { useLogoutMutation } from "../../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap(); // Call backend to clear refresh token cookie
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            // Clear the auth state regardless of backend response
            dispatch(logOut());
            navigate("/login");
        }
    };

    return (
        <span onClick={handleLogout} disabled={isLoading} className="text-sm font-medium">
            Logout
        </span>
    );
};

export default LogoutButton;
