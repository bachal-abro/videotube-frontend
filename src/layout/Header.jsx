import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"; // Import Avatar components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
import {
    Menu,
    Search,
    X,
    Bell,
    User,
    Settings,
    LogOut,
    Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setSidebarOpen } from "../features/system/systemSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import { logOut } from "../features/auth/authSlice";

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    const handleRedirectToProfile = () => {
        navigate(`/@${user?.username}`);
    };
    const [logout] = useLogoutMutation();
    const handleLogOut = async () => {
        await logout();
        dispatch(logOut());
        navigate("/login");
    };

    return (
        user && (
            <header className="sticky top-0 z-20 border-b header-gradient flex-shrink-0">
                <div className="container mx-auto py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Menu button - visible on all screen sizes */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => dispatch(setSidebarOpen())}
                            className="flex-shrink-0"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <a href="/" className="flex items-center">
                            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center mr-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    className="w-5 h-5"
                                >
                                    <path d="M4 4l16 8-16 8z" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl">VideoTube</span>
                        </a>
                    </div>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 max-w-xl mx-4 hidden md:flex"
                    >
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Button
                            type="submit"
                            className="rounded-l-none border-l border-input"
                        >
                            <Search className="h-5 w-5 mx-4" />
                        </Button>
                    </form>

                    <div className="flex items-center gap-4">
                        {/* Mobile Search Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full w-9 h-9"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span className="sr-only">
                                        Notifications
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4">
                                <h4 className="font-semibold mb-2">
                                    Notifications
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    No new notifications.
                                </p>
                                {/* You can add a list of notifications here */}
                            </PopoverContent>
                        </Popover>

                        {/* Profile Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full w-9 h-9 p-0"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={user?.avatar}
                                            alt="User Avatar"
                                        />
                                        <AvatarFallback>
                                            {user?.displayName?.charAt(0) ||
                                                user?.username?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">
                                        User Profile
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-2">
                                <div className="flex items-center gap-3 p-2 mb-2 border-b pb-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={user?.avatar}
                                            alt="User Avatar"
                                        />
                                        <AvatarFallback>
                                            {user?.displayName?.charAt(0) ||
                                                user?.username?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {user?.displayName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            @{user?.username}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-sm"
                                        onClick={handleRedirectToProfile}
                                    >
                                        <User className="mr-2 h-4 w-4" /> Your
                                        Channel
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-sm"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />{" "}
                                        YouTube Studio
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-sm"
                                        onClick={handleLogOut}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" /> Sign
                                        Out
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        {/* <ThemeToggle /> */}
                    </div>
                </div>
            </header>
        )
    );
};

export default Header;
