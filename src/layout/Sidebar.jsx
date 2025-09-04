import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    TrendingUp,
    Music,
    Film,
    Gamepad2,
    Newspaper,
    Trophy,
    Lightbulb,
    Shirt,
    History,
    Clock,
    Tv,
    ThumbsUp,
    PlaySquare,
    Settings,
    HelpCircle,
    Flag,
    ChevronDown,
    ChevronRight,
    ListVideo,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "../features/system/systemSlice";

const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Tv, label: "Subscriptions", path: "/subscriptions" },
    { icon: History, label: "History", path: "/history" },
    { icon: Clock, label: "Watch Later", path: "/watch-later" },
    { icon: ThumbsUp, label: "Liked Videos", path: "/liked" },
    { icon: ListVideo, label: "Playlists", path: "/playlists" },
    { icon: PlaySquare, label: "Your Videos", path: "/your-videos" },
];

const subscriptions = [
    {
        name: "Code Masters",
        avatar: "https://placehold.co/32x32/orange/white?text=CM",
        subscribers: "1.2M",
    },
    {
        name: "React Tutorials",
        avatar: "https://placehold.co/32x32/3b82f6/white?text=RT",
        subscribers: "856K",
    },
    {
        name: "Tech Insights",
        avatar: "https://placehold.co/32x32/6366f1/white?text=TI",
        subscribers: "3.4M",
    },
    {
        name: "Web Design Pro",
        avatar: "https://placehold.co/32x32/06b6d4/white?text=WD",
        subscribers: "427K",
    },
    {
        name: "JS Mastery",
        avatar: "https://placehold.co/32x32/f59e0b/white?text=JS",
        subscribers: "982K",
    },
];

const settingsItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help", path: "/help" },
    { icon: Flag, label: "Send Feedback", path: "/feedback" },
];

export function Sidebar() {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [subscriptionsExpanded, setSubscriptionsExpanded] = useState(true);
    const { sidebarOpen } = useSelector((store) => store.system);

    const onClose = () => {
        if (sidebarOpen) {
            dispatch(setSidebarOpen());
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    const SidebarItem = ({
        icon: Icon,
        label,
        path,
        isActive,
        onClick,
        children,
    }) => (
        <button
            onClick={onClick || (() => handleNavigation(path))}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground group",
                isActive && "bg-accent text-accent-foreground shadow-sm",
                !isActive && "text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{label}</span>
            {children}
        </button>
    );

    const SubscriptionItem = ({ name, avatar, subscribers }) => (
        <button
            onClick={() =>
                handleNavigation(
                    `/channel/${name.toLowerCase().replace(/\s+/g, "-")}`
                )
            }
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground group"
        >
            <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                <AvatarFallback className="text-xs">
                    {name.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left truncate">
                <p className="font-medium text-foreground/90 group-hover:text-foreground truncate">
                    {name}
                </p>
                <p className="text-xs text-muted-foreground">
                    {subscribers} subscribers
                </p>
            </div>
        </button>
    );

    // Don't render sidebar if it's closed
    if (!sidebarOpen) {
        return null;
    }

    return (
        user && (
            <>
                {/* Mobile overlay - only show on mobile when sidebar is open */}
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />

                {/* Sidebar */}
                <aside className="fixed bg-background left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <div className="p-4 space-y-6 bg-background">
                        {/* Main Navigation */}
                        <div className="space-y-1">
                            {navigationItems.map((item) => (
                                <SidebarItem
                                    key={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    path={item.path}
                                    isActive={location.pathname === item.path}
                                />
                            ))}
                        </div>

                        <hr className="border-border" />

                        {/* Subscriptions */}
                        <div className="space-y-1">
                            <SidebarItem
                                icon={
                                    subscriptionsExpanded
                                        ? ChevronDown
                                        : ChevronRight
                                }
                                label="Subscriptions"
                                onClick={() =>
                                    setSubscriptionsExpanded(
                                        !subscriptionsExpanded
                                    )
                                }
                            />

                            {subscriptionsExpanded && (
                                <div className="space-y-1 ml-2">
                                    {subscriptions.map((subscription) => (
                                        <SubscriptionItem
                                            key={subscription.name}
                                            name={subscription.name}
                                            avatar={subscription.avatar}
                                            subscribers={
                                                subscription.subscribers
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="border-border" />

                        {/* Settings */}
                        <div className="space-y-1">
                            {settingsItems.map((item) => (
                                <SidebarItem
                                    key={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    path={item.path}
                                    isActive={location.pathname === item.path}
                                />
                            ))}
                        </div>

                        {/* Footer info */}
                        <div className="px-3 pt-4 text-xs text-muted-foreground space-y-2">
                            <p>About Press Copyright</p>
                            <p>Contact us Creators</p>
                            <p>Advertise Developers</p>
                            <p className="pt-2">
                                Terms Privacy Policy & Safety
                            </p>
                            <p>How VideoTube works</p>
                            <p className="pt-2">© 2024 VideoTube</p>
                        </div>
                    </div>
                </aside>
            </>
        )
    );
}
