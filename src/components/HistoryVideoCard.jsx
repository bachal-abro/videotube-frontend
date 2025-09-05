import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // Changed from MoreVertical to X for direct removal

import { cn } from "../lib/utils";
import { Button } from "./ui/Button";

export function HistoryVideoCard({
    id,
    thumbnail,
    title,
    channelName,
    views,
    timestamp,
    className,
    onRemove,
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/video/${id}`);
    };

    const handleRemoveClick = (e) => {
        e.stopPropagation(); // Prevent navigating to video detail page
        if (onRemove) {
            onRemove(id);
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row gap-3 sm:gap-4 p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 group relative",
                className
            )}
        >
            {/* Thumbnail */}
            <div
                className="relative flex-shrink-0 w-full sm:w-40 h-auto sm:h-24 rounded-lg overflow-hidden aspect-video sm:aspect-auto cursor-pointer"
                onClick={handleClick}
            >
                <img
                    src={thumbnail || "https://placehold.co/160x90"}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Video Info */}
            <div
                className="flex-1 space-y-1 cursor-pointer"
                onClick={handleClick}
            >
                <h3 className="font-medium leading-tight line-clamp-2 text-base group-hover:text-primary transition-colors duration-200">
                    {title}
                </h3>
                <div className="text-xs space-y-0.5">
                    <p className="font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                        {channelName}
                    </p>
                    <p className="text-muted-foreground">
                        {views} views • {timestamp}
                    </p>
                </div>
            </div>

            {/* Remove Button */}
            <div className="flex-shrink-0 self-start sm:self-auto absolute top-2 right-2 sm:relative sm:top-0 sm:right-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveClick}
                    className="rounded-full text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove from history"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
