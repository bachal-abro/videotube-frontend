import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Play,
    Shuffle,
    MoreVertical,
    Edit2,
    Trash2,
    Plus,
    Search,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlaylistVideoCard } from "@/components/PlaylistVideoCard";
import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import { videosData } from "../data/videos";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { useToast } from "../hooks/use-toast";
import {
    useDeletePlaylistMutation,
    useEditPlaylistMutation,
    useGetPlaylistQuery,
    useRemoveVideoFromPlaylistMutation,
} from "../features/playlist/playlistsApiSlice";

export default function PlaylistDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [playlist, setPlaylist] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedPlaylistName, setEditedPlaylistName] = useState("");
    const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const { data, isSuccess, isLoading, refetch } = useGetPlaylistQuery({
        playlistId: id,
    });
    const [removeVideoFromPlaylist] = useRemoveVideoFromPlaylistMutation();

    const [deletePlaylist] = useDeletePlaylistMutation();
    const [editPlaylist] = useEditPlaylistMutation();
    // Load playlist data
    useEffect(() => {
        if (isSuccess) {
            const playlist = data.data;
            setPlaylist(playlist);
        }
    }, [id, isSuccess, isLoading, data]);

    // Filter videos based on search query
    const filteredVideos = useMemo(() => {
        if (!playlist || !searchQuery) {
            return playlist?.videos || [];
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return playlist.videos.filter(
            (video) =>
                video.title.toLowerCase().includes(lowerCaseQuery) ||
                video.owner.displayName.toLowerCase().includes(lowerCaseQuery)
        );
    }, [playlist, searchQuery]);

    const handlePlayVideo = (videoIndex) => {
        const video = filteredVideos[videoIndex];
        if (video) {
            setCurrentVideoIndex(videoIndex);
            navigate(`/video/${video._id}`);
        }
    };

    const handlePlayAll = () => {
        if (filteredVideos.length > 0) {
            handlePlayVideo(0);
        }
    };

    const handleShuffle = () => {
        if (filteredVideos.length > 0) {
            const randomIndex = Math.floor(
                Math.random() * filteredVideos.length
            );
            handlePlayVideo(randomIndex);
        }
    };

    const handleRemoveVideo = async (videoId) => {
        if (!playlist) return;
        await removeVideoFromPlaylist({ videoId, playlistIds: [playlist._id] });
        refetch();

        toast({
            title: "Video removed",
            description: "Video has been removed from the playlist.",
        });
    };

    const handleEditPlaylist = async () => {
        if (!playlist || !editedPlaylistName.trim()) return;
        await editPlaylist({
            playlistId: playlist._id,
            name: editedPlaylistName,
            description: "",
        });

        refetch();
        setIsEditDialogOpen(false);
        toast({
            title: "Playlist updated",
            description: "Playlist name has been updated.",
        });
    };

    const handleDeletePlaylist = async () => {
        if (!playlist) return;

        if (
            window.confirm(
                `Are you sure you want to delete the playlist "${playlist.name}"?`
            )
        ) {
            await deletePlaylist(playlist._id);
            refetch();
            toast({
                title: "Playlist deleted",
                description: `"${playlist.name}" has been deleted.`,
            });
            navigate("/playlists");
        }
    };

    const handleMoveVideo = (fromIndex, toIndex) => {
        if (!playlist) return;

        const newVideoIds = [...playlist.videoIds];
        const newVideos = [...playlist.videos];

        // Move the items
        const [movedVideoId] = newVideoIds.splice(fromIndex, 1);
        const [movedVideo] = newVideos.splice(fromIndex, 1);

        newVideoIds.splice(toIndex, 0, movedVideoId);
        newVideos.splice(toIndex, 0, movedVideo);

        const updatedPlaylist = {
            ...playlist,
            videoIds: newVideoIds,
            videos: newVideos,
        };

        // Update localStorage
        const storedPlaylists = localStorage.getItem("playlists");
        if (storedPlaylists) {
            const playlists = JSON.parse(storedPlaylists);
            const updatedPlaylists = playlists.map((p) =>
                p._id === playlist._id
                    ? { id: p._id, name: p.name, videoIds: newVideoIds }
                    : p
            );
            localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
        }

        setPlaylist(updatedPlaylist);
    };

    const handleAddVideos = () => {
        // Refresh playlist data after adding videos
        const storedPlaylists = localStorage.getItem("playlists");
        if (storedPlaylists) {
            const playlists = JSON.parse(storedPlaylists);
            const foundPlaylist = playlists.find((p) => p._id === id);

            if (foundPlaylist) {
                const hydratedPlaylist = {
                    ...foundPlaylist,
                    videos: foundPlaylist.videoIds
                        .map((videoId) =>
                            videosData.find((v) => v._id === videoId)
                        )
                        .filter(Boolean),
                };
                setPlaylist(hydratedPlaylist);
            }
        }
        toast({
            title: "Videos added",
            description: "Videos have been added to the playlist.",
        });
    };

    if (!playlist && false) {
        return (
            <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
                <p>Loading playlist...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => navigate("/playlists")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Playlist Info Sidebar */}
                <div className="space-y-4">
                    {/* Playlist Header */}
                    <div className="bg-card rounded-lg p-4 shadow-sm">
                        {playlist?.videos?.length > 0 && (
                            <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={
                                        playlist.videos[0].thumbnail ||
                                        "/placeholder.svg"
                                    }
                                    alt={playlist.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h1 className="text-xl font-bold line-clamp-2">
                                        {playlist?.name}
                                    </h1>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {playlist?.videos?.length} video
                                        {playlist?.videos?.length !== 1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
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
                                                setIsEditDialogOpen(true)
                                            }
                                        >
                                            <Edit2 className="mr-2 h-4 w-4" />{" "}
                                            Edit playlist
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleDeletePlaylist}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />{" "}
                                            Delete playlist
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Play Controls */}
                            <div className="space-y-2">
                                <Button
                                    className="w-full"
                                    onClick={handlePlayAll}
                                    disabled={playlist?.videos?.length === 0}
                                >
                                    <Play className="mr-2 h-4 w-4" /> Play all
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={handleShuffle}
                                    disabled={playlist?.videos?.length === 0}
                                >
                                    <Shuffle className="mr-2 h-4 w-4" /> Shuffle
                                </Button>
                                {/* <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={() =>
                                        setIsAddVideoDialogOpen(true)
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add videos
                                </Button> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Videos List */}
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative flex items-center">
                        <Input
                            type="text"
                            placeholder="Search videos in playlist"
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
                                <span className="sr-only">Clear search</span>
                            </Button>
                        )}
                        {!searchQuery && (
                            <Search className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        )}
                    </div>

                    {/* Videos List */}
                    <div className="space-y-2">
                        {filteredVideos.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? "No matching videos found in this playlist."
                                        : "This playlist is empty."}
                                </p>
                                {/* {!searchQuery && (
                                    <Button
                                        variant="outline"
                                        className="mt-4 bg-transparent"
                                        onClick={() =>
                                            setIsAddVideoDialogOpen(true)
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                        videos
                                    </Button>
                                )} */}
                            </div>
                        ) : (
                            filteredVideos.map((video, index) => (
                                <PlaylistVideoCard
                                    key={video._id}
                                    video={video}
                                    index={index + 1}
                                    isCurrentVideo={index === currentVideoIndex}
                                    onPlay={() => handlePlayVideo(index)}
                                    onRemove={() =>
                                        handleRemoveVideo(video._id)
                                    }
                                    onMoveUp={
                                        index > 0
                                            ? () =>
                                                  handleMoveVideo(
                                                      index,
                                                      index - 1
                                                  )
                                            : null
                                    }
                                    onMoveDown={
                                        index < filteredVideos.length - 1
                                            ? () =>
                                                  handleMoveVideo(
                                                      index,
                                                      index + 1
                                                  )
                                            : null
                                    }
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Playlist Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit playlist</DialogTitle>
                        <DialogDescription>
                            Change the name of your playlist.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={editedPlaylistName}
                                onChange={(e) =>
                                    setEditedPlaylistName(e.target.value)
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditPlaylist}
                            disabled={!editedPlaylistName.trim()}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Videos Dialog
            {playlist && (
                <AddToPlaylistDialog
                    isOpen={isAddVideoDialogOpen}
                    onOpenChange={setIsAddVideoDialogOpen}
                    video={playlist.videos[0]} // Dummy video for the dialog
                    onSave={handleAddVideos}
                />
            )} */}
        </div>
    );
}
