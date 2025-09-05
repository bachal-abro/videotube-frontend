import { useState, useEffect, useMemo } from "react";
import { WatchLaterVideoCard } from "../components/WatchLaterVideoCard";
import { videosData } from "../data/videos";
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button";
import { Search, X, Trash2 } from "lucide-react";

export default function WatchLaterPage() {
    const [watchLaterVideos, setWatchLaterVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Load watch later videos from localStorage on mount
        const storedVideos = localStorage.getItem("watchLaterVideos");
        if (storedVideos) {
            const videoIds = JSON.parse(storedVideos);
            // Filter videosData to get the actual video objects
            const videos = videosData.filter((video) =>
                videoIds.includes(video.id)
            );
            setWatchLaterVideos(videos);
        }
    }, []);

    // Save watch later videos to localStorage whenever the state changes
    useEffect(() => {
        const videoIds = watchLaterVideos.map((video) => video.id);
        localStorage.setItem("watchLaterVideos", JSON.stringify(videoIds));
    }, [watchLaterVideos]);

    const filteredVideos = useMemo(() => {
        if (!searchQuery) {
            return watchLaterVideos;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return watchLaterVideos.filter(
            (video) =>
                video.title.toLowerCase().includes(lowerCaseQuery) ||
                video.channelName.toLowerCase().includes(lowerCaseQuery)
        );
    }, [watchLaterVideos, searchQuery]);

    const handleClearWatchLater = () => {
        if (
            window.confirm(
                "Are you sure you want to clear all videos from Watch Later?"
            )
        ) {
            setWatchLaterVideos([]);
        }
    };

    const handleRemoveVideo = (idToRemove) => {
        setWatchLaterVideos((prevVideos) =>
            prevVideos.filter((video) => video.id !== idToRemove)
        );
    };

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <h1 className="text-2xl font-bold mb-6">Watch Later</h1>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                {/* Main Watch Later List */}
                <div className="space-y-4">
                    {filteredVideos.length === 0 ? (
                        <p className="text-muted-foreground">
                            {searchQuery
                                ? "No matching videos found in Watch Later."
                                : "No videos saved for later."}
                        </p>
                    ) : (
                        filteredVideos.map((video) => (
                            <WatchLaterVideoCard
                                key={video.id}
                                id={video.id}
                                thumbnail={video.thumbnail}
                                title={video.title}
                                channelName={video.channelName}
                                views={video.views}
                                timestamp={video.timestamp}
                                onRemove={handleRemoveVideo}
                            />
                        ))
                    )}
                </div>

                {/* Watch Later Sidebar */}
                <div className="space-y-6 lg:border-l lg:pl-6">
                    {/* Search Watch Later Input */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            Search Watch Later
                        </h3>
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="Search saved videos"
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

                    {/* Watch Later Controls */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            Watch Later Controls
                        </h3>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={handleClearWatchLater}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Clear all Watch
                            Later videos
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
