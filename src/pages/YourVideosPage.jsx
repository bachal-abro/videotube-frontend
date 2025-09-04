import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    X,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    BarChart3,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useToast } from "../hooks/use-toast";
import {
    useDeleteVideoMutation,
    useGetAllVideosOfAuthUserQuery,
    useToggleVisibilityStatusMutation,
} from "../features/videos/videosApiSlice";
import { timeAgo, secondsToDuration } from "../utils/timeFormats";
export default function YourVideosPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // all, public, unlisted, private
    const { data, isSuccess, isLoading, refetch } =
        useGetAllVideosOfAuthUserQuery();
    const [toggleVisibilityStatus] = useToggleVisibilityStatusMutation();
    const [deleteVideo] = useDeleteVideoMutation();

    useEffect(() => {
        if (data?.data && isSuccess) {
            setUploadedVideos(data.data);
        }
        refetch();
    }, [isLoading, isSuccess, data?.data, refetch]);

    const filteredVideos = useMemo(() => {
        let filtered = uploadedVideos;

        // Filter by search query
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (video) =>
                    video.title.toLowerCase().includes(lowerCaseQuery) ||
                    video.description.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter(
                (video) => video.visibility === filterStatus
            );
        }

        return filtered;
    }, [uploadedVideos, searchQuery, filterStatus]);

    const handleDeleteVideo = async (video) => {
        if (
            window.confirm(`Are you sure you want to delete "${video.title}"?`)
        ) {
            await deleteVideo({ videoId: video._id });
            refetch();
            toast({
                title: "Video deleted",
                description: `"${video.title}" has been deleted.`,
            });
        }
    };

    const handleToggleVisibility = async (video) => {
        let visibility;
        if (video.visibility == "public") {
            visibility = "private";
        } else {
            visibility = "public";
        }
        await toggleVisibilityStatus({
            videoId: video._id,
            visibilityStatus: visibility,
        });
        refetch();
        toast({
            title: "Visibility updated",
            description: `Video is now ${visibility}.`,
        });
    };

    const getVisibilityBadge = (visibility) => {
        const variants = {
            public: { variant: "default", icon: Eye },
            unlisted: { variant: "secondary", icon: Eye },
            private: { variant: "outline", icon: EyeOff },
        };

        const config = variants[visibility] || variants.public;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="capitalize">
                <Icon className="mr-1 h-3 w-3" />
                {visibility}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Your Videos</h1>
                    <p className="text-muted-foreground">
                        Manage your uploaded content
                    </p>
                </div>

                <Button onClick={() => navigate("/upload")} size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Video
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                {/* Main Content */}
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search your videos"
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
                                </Button>
                            )}
                            {!searchQuery && (
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            )}
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background min-w-[120px]"
                        >
                            <option value="all">All Videos</option>
                            <option value="public">Public</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    {/* Videos List */}
                    {filteredVideos.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                    <Plus className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">
                                        {searchQuery
                                            ? "No matching videos found"
                                            : "No videos uploaded yet"}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {searchQuery
                                            ? "Try adjusting your search terms or filters."
                                            : "Upload your first video to get started."}
                                    </p>
                                </div>
                                {!searchQuery && (
                                    <Button onClick={() => navigate("/upload")}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Upload Video
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredVideos.map((video) => (
                                <Card
                                    key={video._id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-4 pt-4">
                                        <div className="flex gap-4 pt-4">
                                            {/* Thumbnail */}
                                            <div
                                                className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/video/${video._id}`
                                                    )
                                                }
                                            >
                                                <img
                                                    src={
                                                        video.thumbnail ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                                    {secondsToDuration(
                                                        video.duration
                                                    )}
                                                </div>
                                            </div>

                                            {/* Video Info */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 space-y-1">
                                                        <h3
                                                            className="font-medium leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/video/${video._id}`
                                                                )
                                                            }
                                                        >
                                                            {video.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {video.description ||
                                                                "No description"}
                                                        </p>
                                                    </div>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="rounded-full"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/video/${video._id}`
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />{" "}
                                                                View Video
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleToggleVisibility(
                                                                        video
                                                                    )
                                                                }
                                                            >
                                                                {video.visibility ===
                                                                "private" ? (
                                                                    <>
                                                                        <Eye className="mr-2 h-4 w-4" />{" "}
                                                                        Make
                                                                        Public
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <EyeOff className="mr-2 h-4 w-4" />{" "}
                                                                        Make
                                                                        Private
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDeleteVideo(
                                                                        video
                                                                    )
                                                                }
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />{" "}
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
                                                    <span>
                                                        {video.views} views
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {timeAgo(
                                                            video.createdAt
                                                        )}
                                                    </span>
                                                    <span>•</span>
                                                    {getVisibilityBadge(
                                                        video.visibility
                                                    )}
                                                </div>

                                                {video.tags &&
                                                    video.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {video.tags
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        index
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                index
                                                                            }
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </Badge>
                                                                    )
                                                                )}
                                                            {video.tags.length >
                                                                3 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    +
                                                                    {video.tags
                                                                        .length -
                                                                        3}{" "}
                                                                    more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6 lg:border-l lg:pl-6">
                    {/* Upload Stats */}
                    <Card>
                        <CardContent className="p-4 pt-4 space-y-4">
                            <h3 className="font-semibold">Upload Statistics</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Total Videos
                                    </span>
                                    <span className="font-medium">
                                        {uploadedVideos.length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Public
                                    </span>
                                    <span className="font-medium">
                                        {
                                            uploadedVideos.filter(
                                                (v) => v.visibility === "public"
                                            ).length
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Private
                                    </span>
                                    <span className="font-medium">
                                        {
                                            uploadedVideos.filter(
                                                (v) =>
                                                    v.visibility === "private"
                                            ).length
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Unlisted
                                    </span>
                                    <span className="font-medium">
                                        {
                                            uploadedVideos.filter(
                                                (v) =>
                                                    v.visibility === "unlisted"
                                            ).length
                                        }
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardContent className="p-4 pt-4 space-y-3">
                            <h3 className="font-semibold">Quick Actions</h3>
                            <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                onClick={() => navigate("/upload")}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Upload New
                                Video
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                disabled
                            >
                                <BarChart3 className="mr-2 h-4 w-4" /> View
                                Analytics
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
