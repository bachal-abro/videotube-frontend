import { useState, useEffect, useMemo } from "react";
import { HistoryVideoCard } from "../components/HistoryVideoCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
    Search,
    X,
    PauseCircle,
    PlayCircle,
    Trash2,
    Settings,
} from "lucide-react"; // Added icons
import { useDispatch, useSelector } from "react-redux";
import {
    useClearHistoryMutation,
    useGetUserHistoryQuery,
    useRemoveVideoFromHistoryMutation,
} from "../features/users/usersApiSlice";
import { setHistory } from "../features/users/userSlice";
import { timeAgo } from "../utils/timeFormats";

export default function HistoryPage() {
    const [historyVideos, setHistoryVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isHistoryPaused, setIsHistoryPaused] = useState(false);

    const { history } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [
        removeVideoFromHistory,
        { isSuccess: isRemoved, isLoading: isRemoveLoading },
    ] = useRemoveVideoFromHistoryMutation();
    const { data, isLoading, isSuccess, isError, error, refetch } =
        useGetUserHistoryQuery();
    const [clearHistory] = useClearHistoryMutation();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setHistory(data.data));
        }
    }, [isSuccess, data, dispatch, history]);

    const filteredVideos = useMemo(() => {
        if (!searchQuery) {
            return history;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return history.filter(
            (video) =>
                video.title.toLowerCase().includes(lowerCaseQuery) ||
                video?.owner?.displayName.toLowerCase().includes(lowerCaseQuery)
        );
    }, [history, searchQuery]);

    const handleClearHistory = async () => {
        if (
            window.confirm("Are you sure you want to clear all watch history?")
        ) {
            await clearHistory();
            refetch();
        }
    };

    const handleRemoveVideo = async (videoId) => {
        await removeVideoFromHistory({ videoId });
        // Refetch latest playlists to reflect new state
        refetch();
    };

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <h1 className="text-2xl font-bold mb-6">Watch History</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                {/* Main History List */}
                <div className="space-y-4">
                    {filteredVideos.length === 0 ? (
                        <p className="text-muted-foreground">
                            {searchQuery
                                ? "No matching videos found in history."
                                : "No watch history found."}
                        </p>
                    ) : (
                        filteredVideos.map((video) => (
                            <HistoryVideoCard
                                key={video._id}
                                id={video._id}
                                thumbnail={video.thumbnail}
                                title={video.title}
                                channelName={video?.owner?.displayName}
                                views={video.views}
                                timestamp={timeAgo(video.createdAt)}
                                onRemove={handleRemoveVideo}
                            />
                        ))
                    )}
                </div>

                {/* History Sidebar */}
                <div className="space-y-6 lg:border-l lg:pl-6">
                    {/* Search History Input */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            Search History
                        </h3>
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="Search watch history"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-8"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-1 h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">
                                        Clear search
                                    </span>
                                </Button>
                            )}
                            {!searchQuery && (
                                <Search className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                            )}
                        </div>
                    </div>

                    <hr className="border-border" />

                    {/* History Controls */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            History Controls
                        </h3>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={handleClearHistory}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Clear all watch
                            history
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setIsHistoryPaused(!isHistoryPaused)}
                        >
                            {isHistoryPaused ? (
                                <PlayCircle className="mr-2 h-4 w-4" />
                            ) : (
                                <PauseCircle className="mr-2 h-4 w-4" />
                            )}{" "}
                            {isHistoryPaused
                                ? "Resume watch history"
                                : "Pause watch history"}
                        </Button>
                        {/* <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <Settings className="mr-2 h-4 w-4" /> Manage all
                            history
                        </Button> */}
                    </div>

                    <hr className="border-border" />

                    {/* History Type (Placeholder) */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">History Type</h3>
                        <Button
                            variant="secondary"
                            className="w-full justify-start"
                        >
                            Watch history
                        </Button>
                        {/* <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground"
                        >
                            Search history
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground"
                        >
                            Comment history
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground"
                        >
                            Live chat history
                        </Button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
