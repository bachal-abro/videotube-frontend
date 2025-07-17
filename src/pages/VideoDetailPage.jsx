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
} from "lucide-react"; // Added Plus icon
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { VideoCard } from "../components/video-card";
import { videosData } from "../data/videos";
import { AddToPlaylistDialog } from "../components/AddToPlaylistDialog";

export default function VideoDetailPage() {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [isSavedToWatchLater, setIsSavedToWatchLater] = useState(false);
    const [isLiked, setIsLiked] = useState(false); // New state for liked status
    const [likeCount, setLikeCount] = useState(0); // State for like count
    const [isAddToPlaylistDialogOpen, setIsAddToPlaylistDialogOpen] =
        useState(false); // New state for playlist dialog

    useEffect(() => {
        // Find the video with the matching videoId
        const foundVideo = videosData.find((v) => v.id === videoId);

        if (foundVideo) {
            setVideo(foundVideo);
            // Get related videos (excluding current video)
            setRelatedVideos(
                videosData.filter((v) => v.id !== videoId).slice(0, 5)
            );

            // Initialize like count from video data (or a more dynamic source)
            // For demonstration, we'll parse the views as a base for likes
            const baseLikes =
                (Number.parseInt(foundVideo.views.replace(/[KM]/g, "")) *
                    (foundVideo.views.includes("M") ? 1000000 : 1000)) /
                10; // Example: 10% of views
            setLikeCount(baseLikes);

            const storedWatchLaterVideos =
                localStorage.getItem("watchLaterVideos");
            if (storedWatchLaterVideos) {
                const videoIds = JSON.parse(storedWatchLaterVideos);
                setIsSavedToWatchLater(videoIds.includes(foundVideo.id));
            }

            // Check if video is already liked
            const storedLikedVideos = localStorage.getItem("likedVideos");
            if (storedLikedVideos) {
                const likedVideoIds = JSON.parse(storedLikedVideos);
                setIsLiked(likedVideoIds.includes(foundVideo.id));
            }
        }
    }, [videoId]);

    const handleToggleWatchLater = () => {
        const storedVideos = localStorage.getItem("watchLaterVideos");
        let videoIds = storedVideos ? JSON.parse(storedVideos) : [];

        if (isSavedToWatchLater) {
            // Remove from watch later
            videoIds = videoIds.filter((videoId) => videoId !== video.id);
        } else {
            // Add to watch later
            if (!videoIds.includes(video.id)) {
                videoIds.push(video.id);
            }
        }
        localStorage.setItem("watchLaterVideos", JSON.stringify(videoIds));
        setIsSavedToWatchLater(!isSavedToWatchLater);
    };

    const handleToggleLike = () => {
        const storedVideos = localStorage.getItem("likedVideos");
        let videoIds = storedVideos ? JSON.parse(storedVideos) : [];

        if (isLiked) {
            // Unlike video
            videoIds = videoIds.filter((videoId) => videoId !== video.id);
            setLikeCount((prev) => prev - 1);
        } else {
            // Like video
            if (!videoIds.includes(video.id)) {
                videoIds.push(video.id);
            }
            setLikeCount((prev) => prev + 1);
        }
        localStorage.setItem("likedVideos", JSON.stringify(videoIds));
        setIsLiked(!isLiked);
    };

    // Callback for when video is saved/removed from playlists
    const handlePlaylistSave = () => {
        // You might want to re-check playlist status here if needed,
        // but for now, the dialog handles its own state and localStorage updates.
        console.log("Video playlist status updated.");
    };

    if (!video) {
        return (
            <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
                <p>Loading video...</p>
            </div>
        );
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
                            src={
                                video.videoPreview ||
                                "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            }
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
                                            video.channelAvatar ||
                                            "https://placehold.co/40x40"
                                        }
                                        alt={video.channelName}
                                    />
                                    <AvatarFallback>
                                        {video.channelName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {video.channelName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        1.2M subscribers
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 bg-transparent"
                                >
                                    <Bell className="mr-2 h-4 w-4" /> Subscribe
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className={cn(
                                        "bg-secondary/80 hover:bg-secondary",
                                        isLiked &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                    onClick={handleToggleLike}
                                >
                                    <ThumbsUp className="mr-2 h-4 w-4" />{" "}
                                    {likeCount.toLocaleString()}
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/80 hover:bg-secondary"
                                >
                                    <ThumbsDown className="mr-2 h-4 w-4" /> 2.5K
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/80 hover:bg-secondary"
                                >
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/80 hover:bg-secondary"
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
                                    } // Open playlist dialog
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Save
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-secondary/80 hover:bg-secondary"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Video details */}
                        <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 shadow-sm">
                            <div className="flex gap-2 text-sm mb-2">
                                <span className="font-medium">
                                    {video.views} views
                                </span>
                                <span>•</span>
                                <span>{video.timestamp}</span>
                            </div>
                            <p className="text-sm">
                                {video.description ||
                                    `This is a detailed description of "${video.title}". The video covers various aspects of the topic and provides valuable insights. Watch the full video to learn more about this interesting subject.`}
                            </p>
                            <Button
                                variant="link"
                                size="sm"
                                className="px-0 text-xs"
                            >
                                Show more
                            </Button>
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
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm">
                                            Cancel
                                        </Button>
                                        <Button size="sm">
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
                                key={relatedVideo.videoId}
                                videoId={relatedVideo.videoId}
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
