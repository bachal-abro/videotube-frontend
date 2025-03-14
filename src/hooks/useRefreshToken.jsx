import { useDispatch, useSelector } from "react-redux";
import {
    login as authLogin,
    refreshAccess as authRefreshAccess,
} from "../services/api/AuthApi";

const useRefreshToken = () => {
    const authData = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const refresh = async () => {
        try {
            const response = await authRefreshAccess();
            console.log("Refresh: ", response);
            
        } catch (error) {
            console.log(error.message);
        }
    };
    return refresh;
};

export default useRefreshToken;
