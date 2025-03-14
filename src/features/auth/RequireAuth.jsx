import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./authSlice";

const RequireAuth = () => {
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser);
    console.log("Token from RequireAuth", token);

    const location = useLocation();

    return (
        // Todo: in first render token is not present thats why it always shows the login after refresh
        user ? (
            <Outlet />
        ) : (
            <Navigate to="/login" state={{ from: location }} replace />
        )
    );
};
export default RequireAuth;
