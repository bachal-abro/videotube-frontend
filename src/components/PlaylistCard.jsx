import { useNavigate } from "react-router-dom";
import { MoreVertical, Play, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function PlaylistCard({ playlist, onDelete }) {
    const navigate = useNavigate();
    const firstVideoThumbnail =
        playlist.videos.length > 0 ? playlist.videos[0].thumbnail : null;

    const handleCardClick = () => {
        // Navigate to a playlist detail page (you can implement this later)
        navigate(`/playlist/${playlist.id}`);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent card click
        if (
            window.confirm(
                `Are you sure you want to delete the playlist "${playlist.name}"?`
            )
        ) {
            onDelete(playlist.id);
        }
    };

    return (
        <div className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-card text-card-foreground">
            <div
                className="relative aspect-video w-full"
                onClick={handleCardClick}
            >
                {firstVideoThumbnail ? (
                    <img
                        src={firstVideoThumbnail || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Play className="h-12 w-12 opacity-30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                    <span className="text-white text-sm font-medium">
                        {playlist.videos.length} videos
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                    >
                        <Play className="h-5 w-5" />
                        <span className="sr-only">Play playlist</span>
                    </Button>
                </div>
            </div>

            <div className="p-3 flex items-center justify-between">
                <div className="flex-1" onClick={handleCardClick}>
                    <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
                        {playlist.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {playlist.videos.length} videos
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Playlist options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={handleDeleteClick}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete playlist
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
