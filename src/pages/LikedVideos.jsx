import { useState, useEffect, useMemo } from "react";
import { LikedVideoCard } from "../components/LikedVideoCard";
import { videosData } from "../data/videos";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, X, Trash2 } from "lucide-react";
import {
    useClearLikedVideosMutation,
    useGetLikedVideosQuery,
    useToggleVideoLikeMutation,
} from "../features/likes/likesApiSlice";
import { timeAgo } from "../utils/timeAgo";

export default function LikedVideosPage() {
    const [likedVideos, setLikedVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isSuccess, isLoading, refetch } = useGetLikedVideosQuery();
    const [toggleVideoLike] = useToggleVideoLikeMutation();
    const [clearLikedVideos] = useClearLikedVideosMutation();
    useEffect(() => {
        if (isSuccess) {
            setLikedVideos(data.data);
        }
        refetch();
    }, [isSuccess, isLoading, data, refetch]);

    const filteredVideos = useMemo(() => {
        if (!searchQuery) {
            return likedVideos;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return likedVideos.filter(
            (video) =>
                video.title.toLowerCase().includes(lowerCaseQuery) ||
                video.owner.fullName.toLowerCase().includes(lowerCaseQuery)
        );
    }, [likedVideos, searchQuery]);

    const handleClearLikedVideos = async () => {
        if (
            window.confirm("Are you sure you want to clear all liked videos?")
        ) {
            await clearLikedVideos();
            refetch();
        }
    };

    const handleRemoveVideo = async (idToRemove) => {
        await toggleVideoLike(idToRemove);
        refetch();
    };

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                {/* Main Liked Videos List */}
                <div className="space-y-4">
                    {filteredVideos.length === 0 ? (
                        <p className="text-muted-foreground">
                            {searchQuery
                                ? "No matching videos found in Liked Videos."
                                : "No videos liked yet."}
                        </p>
                    ) : (
                        filteredVideos.map((video) => (
                            <LikedVideoCard
                                key={video._id}
                                id={video._id}
                                thumbnail={video.thumbnail}
                                title={video.title}
                                channelName={video.owner.fullName}
                                views={video.views}
                                timestamp={timeAgo(video.createdAt)}
                                onRemove={handleRemoveVideo}
                            />
                        ))
                    )}
                </div>

                {/* Liked Videos Sidebar */}
                <div className="space-y-6 lg:border-l lg:pl-6">
                    {/* Search Liked Videos Input */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            Search Liked Videos
                        </h3>
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="Search liked videos"
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

                    {/* Liked Videos Controls */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            Liked Videos Controls
                        </h3>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={handleClearLikedVideos}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Clear all liked
                            videos
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
