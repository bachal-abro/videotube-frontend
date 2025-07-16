import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { Input } from "../components/ui/Input"; // Import Input component
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"; // Import Avatar components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
import { Menu, Search, X, Bell, User, Settings, LogOut } from "lucide-react";
import Header from "./Header";

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
        // In a real app, you'd navigate or filter videos here
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

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
