import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    Share2,
    Download,
    MoreHorizontal,
    Bell,
    Plus,
    Flag,
    FileText,
    Check,
} from "lucide-react";

import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { VideoCard } from "@/components/VideoCard";
import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useToast } from "../hooks/use-toast"; // Import useToast
import { videosData } from "../data/videos";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentVideo } from "../features/videos/videoSlice";
import { useGetVideoByIdQuery } from "../features/videos/videosApiSlice";
import { timeAgo } from "../utils/timeFormats";
import { useToggleVideoLikeMutation } from "../features/likes/likesApiSlice";
import { useToggleVideoDislikeMutation } from "../features/dislikes/dislikesApiSlice";
import { useToggleSubscriptionMutation } from "../features/subscription/subscriptionApiSlice";
import CommentSection from "@/components/CommentSection";

export default function VideoDetailPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { videoId } = useParams();
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [isSavedToWatchLater, setIsSavedToWatchLater] = useState(false);
    const [isAddToPlaylistDialogOpen, setIsAddToPlaylistDialogOpen] =
        useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false); // State for description expansion
    const { data, isLoading, isSuccess, isError, error } =
        useGetVideoByIdQuery(videoId);
    const video = useSelector((store) => store.video.currentVideo);
    const [toggleVideoLike] = useToggleVideoLikeMutation();
    const [toggleVideoDislike] = useToggleVideoDislikeMutation();
    const [toggleSubscription] = useToggleSubscriptionMutation();

    useEffect(() => {
        if (data && isSuccess) {
            dispatch(setCurrentVideo(data?.data));
            setRelatedVideos(
                videosData.filter((v) => v.id !== videoId).slice(0, 5)
            );

            // Check if video is already in watch later
            const storedWatchLaterVideos =
                localStorage.getItem("watchLaterVideos");
            if (storedWatchLaterVideos) {
                const videoIds = JSON.parse(storedWatchLaterVideos);
                setIsSavedToWatchLater(videoIds.includes(video._id));
            }
        }
    }, [videoId, isSuccess, isLoading]);

    const handleToggleWatchLater = () => {
        const storedVideos = localStorage.getItem("watchLaterVideos");
        let videoIds = storedVideos ? JSON.parse(storedVideos) : [];

        if (isSavedToWatchLater) {
            videoIds = videoIds.filter((videoId) => videoId !== video.id);
            toast({
                title: "Removed from Watch Later",
                description: video.title,
            });
        } else {
            if (!videoIds.includes(video.id)) {
                videoIds.push(video.id);
            }
            toast({
                title: "Added to Watch Later",
                description: video.title,
            });
        }
        localStorage.setItem("watchLaterVideos", JSON.stringify(videoIds));
        setIsSavedToWatchLater(!isSavedToWatchLater);
    };

    const handleToggleLike = async (e) => {
        e.preventDefault();
        const updatedLike = await toggleVideoLike(video?._id).unwrap();

        if (video?.isLiked) {
            dispatch(
                setCurrentVideo({
                    ...video,
                    isLiked: updatedLike?.data?.isLiked,
                    likes: updatedLike?.data?.likes,
                })
            );

            toast({
                title: "Unliked video",
                description: video.title,
            });
        } else {
            // Like video
            dispatch(
                setCurrentVideo({
                    ...video,
                    isLiked: updatedLike?.data?.isLiked,
                    likes: updatedLike?.data?.likes,
                })
            );

            toast({
                title: "Liked video",
                description: video.title,
            });
        }
    };

    const handleToggleDislike = async (e) => {
        e.preventDefault();
        const updatedDislike = await toggleVideoDislike(video?._id).unwrap();

        if (video?.isDisliked) {
            dispatch(
                setCurrentVideo({
                    ...video,
                    isDisliked: updatedDislike?.data?.isDisliked,
                    dislikes: updatedDislike?.data?.dislikes,
                })
            );

            toast({
                title: "Video dislike removed",
                description: video.title,
            });
        } else {
            // Dislike video
            dispatch(
                setCurrentVideo({
                    ...video,
                    isDisliked: updatedDislike?.data?.isDisliked,
                    dislikes: updatedDislike?.data?.dislikes,
                })
            );

            toast({
                title: "Disliked video",
                description: video.title,
            });
        }
    };

    const handleShare = () => {
        if (navigator.clipboard && video) {
            const videoUrl = `${window.location.origin}/video/${video.id}`;
            navigator.clipboard.writeText(videoUrl).then(() => {
                toast({
                    title: "Link copied!",
                    description: "Video URL copied to clipboard.",
                    icon: <Check className="h-4 w-4" />,
                });
            });
        }
    };

    const handleDownload = () => {
        if (video && video.videoFile) {
            // Sanitize filename (remove special chars, spaces, etc.)
            const sanitizedTitle = (video.title || "video")
                .replace(/[^a-z0-9]/gi, "_") // Replace non-alphanumeric chars with underscore
                .toLowerCase();

            // Inject fl_attachment:filename into the Cloudinary URL
            const downloadUrl = video.videoFile.replace(
                "/upload/",
                `/upload/fl_attachment:${sanitizedTitle}/`
            );

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${sanitizedTitle}.mp4`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Download started",
                description: `Your video "${video.title}" is being downloaded.`,
            });
        }
    };

    const handleToggleSubscribe = async () => {
        const updatedSubscription = await toggleSubscription(
            video?.owner?._id
        ).unwrap();

        // Dispatch the new state
        const updatedVideo = {
            ...video,
            owner: {
                ...video.owner,
                subscribers: updatedSubscription.data?.subscribersCount, // your updated value
                isSubscribed: updatedSubscription.data?.isSubscribed, // true or false
            },
        };

        toast({
            title: video?.owner?.isSubscribed
                ? `Unsubscribed from ${video?.owner?.displayName}`
                : `Subscribed to ${video?.owner?.displayName}`,
            description: video?.owner?.isSubscribed
                ? "You will no longer receive notifications."
                : "You will now receive notifications.",
        });
        dispatch(setCurrentVideo(updatedVideo));
    };

    // Callback for when video is saved/removed from playlists
    const handlePlaylistSave = () => {
        toast({
            title: "Playlist updated",
            description: "Selected playlists has been updated.",
        });
    };

    if (!video) {
        return (
            <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
                <p>Loading video...</p>
            </div>
        );
    }

    const descriptionLines = video.description
        ? video.description.split("\n")
        : [];
    const displayDescription = showFullDescription
        ? descriptionLines.join("\n")
        : descriptionLines.slice(0, 3).join("\n");
    const needsTruncation =
        descriptionLines.length > 3 ||
        (video.description && video.description.length > 200); // Arbitrary length for truncation

    if (isLoading || !isSuccess || !video.title) {
        return <p>Video is loading</p>;
    }

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to videos
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content - Video and info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video player */}
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black shadow-lg">
                        <video
                            src={video.videoFile}
                            className="w-full h-full"
                            controls
                            autoPlay
                            poster={video.thumbnail}
                        />
                    </div>

                    {/* Video info */}
                    <div className="space-y-4">
                        <h1 className="text-xl md:text-2xl font-bold">
                            {video.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                    <AvatarImage
                                        src={
                                            video.owner.avatar ||
                                            "https://placehold.co/40x40"
                                        }
                                        alt={video.owner.displayName}
                                    />
                                    <AvatarFallback>
                                        {video.owner.displayName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {video.owner.displayName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {video.owner.subscribers} subscribers
                                    </p>
                                </div>
                                {/* Subscribe Button Section - Updated */}
                                <Button
                                    variant={
                                        video.owner.isSubscribed
                                            ? "secondary"
                                            : "youtube-subscribe"
                                    }
                                    size="sm"
                                    className={cn(
                                        "ml-2 transition-all duration-200",
                                        video.owner.isSubscribed &&
                                            "bg-gray-200 hover:bg-gray-300 text-gray-700 border"
                                    )}
                                    onClick={handleToggleSubscribe}
                                >
                                    {video.owner.isSubscribed ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Subscribed
                                        </>
                                    ) : (
                                        <>
                                            <Bell className="mr-2 h-4 w-4" />
                                            Subscribe
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {/* Like Button */}
                                <Button
                                    variant={
                                        video.isLiked
                                            ? "default"
                                            : "secondary-enhanced"
                                    }
                                    size="sm"
                                    className={cn(
                                        "transition-all duration-200",
                                        video.isLiked &&
                                            "bg-green-600 hover:bg-green-700 text-white"
                                    )}
                                    onClick={(e) => handleToggleLike(e)}
                                    type="button"
                                >
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    {video?.likes?.toLocaleString()}
                                </Button>

                                {/* Dislike Button */}
                                <Button
                                    variant={
                                        video.isDisliked
                                            ? "default"
                                            : "secondary-enhanced"
                                    }
                                    size="sm"
                                    className={cn(
                                        "transition-all duration-200",
                                        video.isDisliked &&
                                            "bg-red-600 hover:bg-red-700 text-white"
                                    )}
                                    onClick={(e) => handleToggleDislike(e)}
                                    type="button"
                                >
                                    <ThumbsDown className="mr-2 h-4 w-4" />
                                    {video?.dislikes?.toLocaleString()}
                                </Button>

                                {/* Share Button */}
                                <Button
                                    variant="secondary-enhanced"
                                    size="sm"
                                    className="hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={handleShare}
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>

                                {/* Download Button */}
                                <Button
                                    variant="secondary-enhanced"
                                    size="sm"
                                    className="hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-600 dark:hover:text-purple-400"
                                    onClick={handleDownload}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>

                                {/* Save Button */}
                                <Button
                                    variant="secondary-enhanced"
                                    size="sm"
                                    className="hover:bg-yellow-50 dark:hover:bg-yellow-950 hover:text-yellow-600 dark:hover:text-yellow-400"
                                    onClick={() =>
                                        setIsAddToPlaylistDialogOpen(true)
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Save
                                </Button>

                                {/* More Options Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="secondary-enhanced"
                                            size="sm"
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="bg-popover border border-border"
                                    >
                                        <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">
                                            <Flag className="mr-2 h-4 w-4" />
                                            Report
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Show Transcript
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Video details */}
                        <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 shadow-sm">
                            <div className="flex gap-2 text-sm mb-2">
                                <span className="font-medium">
                                    {video.views} views
                                </span>
                                <span>•</span>
                                <span>{timeAgo(video.createdAt)}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                                {displayDescription}
                            </p>
                            {needsTruncation && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="px-0 text-xs"
                                    onClick={() =>
                                        setShowFullDescription(
                                            !showFullDescription
                                        )
                                    }
                                >
                                    {showFullDescription
                                        ? "Show less"
                                        : "Show more"}
                                </Button>
                            )}
                        </div>

                        {/* Comments section */}
                        <CommentSection />
                    </div>
                </div>

                {/* Sidebar - Related videos */}
                <div className="space-y-4">
                    <h3 className="font-medium">Related Videos</h3>
                    <div className="space-y-4">
                        {relatedVideos.map((relatedVideo) => (
                            <VideoCard
                                key={relatedVideo.id}
                                id={relatedVideo.id}
                                thumbnail={relatedVideo.thumbnail}
                                title={relatedVideo.title}
                                channelName={relatedVideo.channelName}
                                channelAvatar={relatedVideo.channelAvatar}
                                views={relatedVideo.views}
                                timestamp={relatedVideo.timestamp}
                                duration={relatedVideo.duration}
                                className="!mb-0"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {video && (
                <AddToPlaylistDialog
                    isOpen={isAddToPlaylistDialogOpen}
                    onOpenChange={setIsAddToPlaylistDialogOpen}
                    video={video}
                    onSave={handlePlaylistSave}
                />
            )}
        </div>
    );
}
