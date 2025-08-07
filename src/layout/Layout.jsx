import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"; // Import Avatar components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
import Header from "./Header";
import { useSelector } from "react-redux";

export default function Layout() {
    const { sidebarOpen } = useSelector((store) => store.system);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate()
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content - automatically takes full width when sidebar is hidden */}
                <main
                    className={`flex-1 transition-all duration-100 ${
                        sidebarOpen ? "md:ml-64" : ""
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
