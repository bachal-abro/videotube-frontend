import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar"; 
import { useEffect } from "react";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { setSmallScreenSidebar } from "../features/system/systemSlice";
export default function Layout() {
    const { user } = useSelector((store) => store.auth);
    const { sidebarOpen } = useSelector((store) => store.system);
    const dispatch = useDispatch();

    useEffect(() => {
        if (window.innerWidth < 768) {
            dispatch(setSmallScreenSidebar());
        }
    }, [dispatch]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main
                    className={`flex-1 transition-all duration-100 ${
                        sidebarOpen && user ? "md:ml-64" : ""
                    }`}
                >
                    <Outlet />
                </main>
            </div>

            <footer className="border-t py-4 text-center text-sm text-muted-foreground transition-colors duration-200">
                <div className="container mx-auto">
                    <p>
                        © {new Date().getFullYear()} VideoTube. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
