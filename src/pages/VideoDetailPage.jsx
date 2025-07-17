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
    Send,
    Plus,
    Flag,
    FileText,
    Check,
} from "lucide-react";

import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { VideoCard } from "../components/video-card";
import { AddToPlaylistDialog } from "../components/AddToPlaylistDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useToast } from "../hooks/use-toast"; // Import useToast
import { videosData } from "../data/videos";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentVideo } from "../features/videos/videoSlice";
import { useGetVideoByIdQuery } from "../features/videos/videosApiSlice";
import { timeAgo } from "../utils/timeAgo";

export default function VideoDetailPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { videoId } = useParams();
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [isSavedToWatchLater, setIsSavedToWatchLater] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false); // New state for disliked status
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0); // New state for dislike count
    const [isAddToPlaylistDialogOpen, setIsAddToPlaylistDialogOpen] =
        useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false); // State for description expansion
    const [commentText, setCommentText] = useState(""); // State for comment input
    const [isSubscribed, setIsSubscribed] = useState(false); // State for subscribe button

    const { data, isLoading, isSuccess, isError, error } =
        useGetVideoByIdQuery(videoId);
    const video = useSelector((store) => store.video.currentVideo);

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

            // Check if video is already liked
            const storedLikedVideos = localStorage.getItem("likedVideos");
            if (storedLikedVideos) {
                const likedVideoIds = JSON.parse(storedLikedVideos);
                setIsLiked(likedVideoIds.includes(video._id));
            }

            // Check if video is already disliked (for persistent state)
            const storedDislikedVideos = localStorage.getItem("dislikedVideos");
            if (storedDislikedVideos) {
                const dislikedVideoIds = JSON.parse(storedDislikedVideos);
                setIsDisliked(dislikedVideoIds.includes(video._id));
            }

            // Simulate subscription status
            const storedSubscription = localStorage.getItem(
                `subscribed-${video?.owner?.username}`
            );
            setIsSubscribed(storedSubscription === "true");
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

    const handleToggleLike = () => {
        const storedLikedVideos = localStorage.getItem("likedVideos");
        let likedVideoIds = storedLikedVideos
            ? JSON.parse(storedLikedVideos)
            : [];

        const storedDislikedVideos = localStorage.getItem("dislikedVideos");
        let dislikedVideoIds = storedDislikedVideos
            ? JSON.parse(storedDislikedVideos)
            : [];

        if (isLiked) {
            // Unlike video
            likedVideoIds = likedVideoIds.filter(
                (videoId) => videoId !== video.id
            );
            setLikeCount((prev) => prev - 1);
            toast({
                title: "Unliked video",
                description: video.title,
            });
        } else {
            // Like video
            if (!likedVideoIds.includes(video.id)) {
                likedVideoIds.push(video.id);
            }
            setLikeCount((prev) => prev + 1);
            toast({
                title: "Liked video",
                description: video.title,
            });

            // If currently disliked, remove dislike
            if (isDisliked) {
                dislikedVideoIds = dislikedVideoIds.filter(
                    (videoId) => videoId !== video.id
                );
                setDislikeCount((prev) => prev - 1);
                setIsDisliked(false);
                localStorage.setItem(
                    "dislikedVideos",
                    JSON.stringify(dislikedVideoIds)
                );
            }
        }
        localStorage.setItem("likedVideos", JSON.stringify(likedVideoIds));
        setIsLiked(!isLiked);
    };

    const handleToggleDislike = () => {
        const storedDislikedVideos = localStorage.getItem("dislikedVideos");
        let dislikedVideoIds = storedDislikedVideos
            ? JSON.parse(storedDislikedVideos)
            : [];

        const storedLikedVideos = localStorage.getItem("likedVideos");
        let likedVideoIds = storedLikedVideos
            ? JSON.parse(storedLikedVideos)
            : [];

        if (isDisliked) {
            // Undislike video
            dislikedVideoIds = dislikedVideoIds.filter(
                (videoId) => videoId !== video.id
            );
            setDislikeCount((prev) => prev - 1);
            toast({
                title: "Removed dislike",
                description: video.title,
            });
        } else {
            // Dislike video
            if (!dislikedVideoIds.includes(video.id)) {
                dislikedVideoIds.push(video.id);
            }
            setDislikeCount((prev) => prev + 1);
            toast({
                title: "Disliked video",
                description: video.title,
            });

            // If currently liked, remove like
            if (isLiked) {
                likedVideoIds = likedVideoIds.filter(
                    (videoId) => videoId !== video.id
                );
                setLikeCount((prev) => prev - 1);
                setIsLiked(false);
                localStorage.setItem(
                    "likedVideos",
                    JSON.stringify(likedVideoIds)
                );
            }
        }
        localStorage.setItem(
            "dislikedVideos",
            JSON.stringify(dislikedVideoIds)
        );
        setIsDisliked(!isDisliked);
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
        if (video && video.videoPreview) {
            // In a real app, this would trigger a server-side download or a direct file download.
            // For simulation, we'll just open the video URL in a new tab.
            window.open(video.videoPreview, "_blank");
            toast({
                title: "Download initiated",
                description: "Video download should start shortly.",
            });
        }
    };

    const handlePostComment = () => {
        if (commentText.trim()) {
            console.log("Posting comment:", commentText);
            toast({
                title: "Comment posted!",
                description: "Your comment has been added.",
            });
            setCommentText(""); // Clear input after posting
        }
    };

    const handleToggleSubscribe = () => {
        setIsSubscribed(!isSubscribed);
        localStorage.setItem(`subscribed-${video.channelName}`, !isSubscribed);
        toast({
            title: isSubscribed
                ? `Unsubscribed from ${video.channelName}`
                : `Subscribed to ${video.channelName}`,
            description: isSubscribed
                ? "You will no longer receive notifications."
                : "You will now receive notifications.",
        });
    };

    // Callback for when video is saved/removed from playlists
    const handlePlaylistSave = () => {
        toast({
            title: "Playlist updated",
            description: "Video added/removed from selected playlists.",
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
        return <p>Video is loading</p>
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
                                        alt={video.owner.fullName}
                                    />
                                    <AvatarFallback>
                                        {video.owner.fullName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {video.owner.fullName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {video.owner.subscribers} subscribers
                                    </p>
                                </div>
                                <Button
                                    variant={
                                        video.owner.isSubscribed ? "secondary" : "outline"
                                    }
                                    size="sm"
                                    className="ml-2 bg-transparent"
                                    onClick={handleToggleSubscribe}
                                >
                                    {video.owner.isSubscribed ? (
                                        <Check className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Bell className="mr-2 h-4 w-4" />
                                    )}{" "}
                                    {video.owner.isSubscribed ? "Subscribed" : "Subscribe"}
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className={cn(
                                        "bg-secondary/80 hover:bg-secondary",
                                        video.isLiked &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                    onClick={handleToggleLike}
                                >
                                    <ThumbsUp className="mr-2 h-4 w-4" />{" "}
                                    {video?.likeCount?.toLocaleString()}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className={cn(
                                        "bg-secondary/80 hover:bg-secondary",
                                        video.isDisliked &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                    onClick={handleToggleDislike}
                                >
                                    <ThumbsDown className="mr-2 h-4 w-4" />{" "}
                                    {dislikeCount?.toLocaleString()}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/80 hover:bg-secondary"
                                    onClick={handleShare}
                                >
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/80 hover:bg-secondary"
                                    onClick={handleDownload}
                                >
                                    <Download className="mr-2 h-4 w-4" />{" "}
                                    Download
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/80 hover:bg-secondary"
                                    onClick={() =>
                                        setIsAddToPlaylistDialogOpen(true)
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Save
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="bg-secondary/80 hover:bg-secondary"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Flag className="mr-2 h-4 w-4" />{" "}
                                            Report
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <FileText className="mr-2 h-4 w-4" />{" "}
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
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium">Comments</h3>
                                <span className="text-sm text-muted-foreground">
                                    1.2K
                                </span>
                            </div>

                            {/* Comment input */}
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src="https://placehold.co/32x32"
                                        alt="Your avatar"
                                    />
                                    <AvatarFallback>YA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder="Add a comment..."
                                        className="resize-none"
                                        value={commentText}
                                        onChange={(e) =>
                                            setCommentText(e.target.value)
                                        }
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setCommentText("")}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handlePostComment}
                                            disabled={!commentText.trim()}
                                        >
                                            <Send className="mr-2 h-4 w-4" />{" "}
                                            Comment
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Comments list */}
                            <div className="space-y-4 pt-4">
                                {[1, 2, 3].map((comment) => (
                                    <div key={comment} className="flex gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={`https://placehold.co/32x32?text=U${comment}`}
                                                alt="User avatar"
                                            />
                                            <AvatarFallback>
                                                U{comment}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">
                                                    User {comment}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {comment} days ago
                                                </span>
                                            </div>
                                            <p className="text-sm">
                                                This is an amazing video! I
                                                learned so much from it and
                                                can't wait to apply these
                                                techniques in my own projects.
                                            </p>
                                            <div className="flex items-center gap-3 text-xs">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2"
                                                >
                                                    <ThumbsUp className="mr-1 h-3 w-3" />{" "}
                                                    {comment * 24}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2"
                                                >
                                                    <ThumbsDown className="mr-1 h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2"
                                                >
                                                    Reply
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
