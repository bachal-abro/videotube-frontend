import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Play,
    MoreVertical,
    ChevronUp,
    ChevronDown,
    Trash2,
} from "lucide-react";
import { timeAgo, secondsToDuration } from "../utils/timeFormats";

import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/DropdownMenu";

export function PlaylistVideoCard({
    video,
    index,
    isCurrentVideo,
    onPlay,
    onRemove,
    onMoveUp,
    onMoveDown,
}) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleVideoClick = () => {
        navigate(`/video/${video._id}`);
    };

    const handlePlayClick = (e) => {
        e.stopPropagation();
        onPlay();
    };

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        if (window.confirm(`Remove "${video.title}" from this playlist?`)) {
            onRemove();
        }
    };

    const handleMoveUp = (e) => {
        e.stopPropagation();
        onMoveUp();
    };

    const handleMoveDown = (e) => {
        e.stopPropagation();
        onMoveDown();
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 group cursor-pointer",
                isCurrentVideo && "bg-accent/70"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleVideoClick}
        >
            {/* Index/Play Button */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {isHovered || isCurrentVideo ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={handlePlayClick}
                    >
                        <Play className="h-4 w-4" />
                    </Button>
                ) : (
                    <span className="text-sm text-muted-foreground font-medium">
                        {index}
                    </span>
                )}
            </div>

            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-32 h-18 rounded-lg overflow-hidden">
                <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    {secondsToDuration(video.duration)}
                </div>
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-medium leading-tight line-clamp-2 text-sm group-hover:text-primary transition-colors duration-200">
                    {video.title}
                </h3>
                <div className="text-xs text-muted-foreground space-y-0.5">
                    <p className="font-medium">
                        {video.owner.displayName || video.owner.username}
                    </p>
                    <p>
                        {video.views} views • {timeAgo(video.createdAt)}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-1">
                {/* Move buttons */}
                {onMoveUp && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleMoveUp}
                        title="Move up"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                )}
                {onMoveDown && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleMoveDown}
                        title="Move down"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                )}

                {/* More options */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={handleRemoveClick}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove from
                            playlist
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
