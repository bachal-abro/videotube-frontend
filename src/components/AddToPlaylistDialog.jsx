import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Checkbox } from "./ui/Checkbox";
import { Plus } from "lucide-react";
import {
    useAddVideoToPlaylistMutation,
    useCreatePlaylistMutation,
    useGetUserPlaylistsQuery,
    useRemoveVideoFromPlaylistMutation,
} from "../features/playlist/playlistsApiSlice";
import { useSelector } from "react-redux";

export function AddToPlaylistDialog({ isOpen, onOpenChange, video, onSave }) {
    const [selectedPlaylists, setSelectedPlaylists] = useState({});
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
    const [initialSelectedPlaylists, setInitialSelectedPlaylists] = useState(
        {}
    );
    const user = useSelector((store) => store.auth.user);
    const userId = user?._id;

    const {
        data,
        isLoading: isPlaylistsLoading,
        isSuccess: isPlaylistsSuccess,
        refetch,
    } = useGetUserPlaylistsQuery(userId);

    const userPlaylists = data?.data || [];

    const [
        createPlaylist,
        { isLoading: isCreateLoading, isSuccess: isCreateSuccess },
    ] = useCreatePlaylistMutation();

    const [addVideoToPlaylist] = useAddVideoToPlaylistMutation();

    const [removeVideoFromPlaylist] = useRemoveVideoFromPlaylistMutation();

    useEffect(() => {
        if (isOpen && isPlaylistsSuccess) {
            const initialSelected = {};
            userPlaylists.forEach((p) => {
                initialSelected[p._id] = p.videos.includes(video._id);
            });

            setInitialSelectedPlaylists(initialSelected);
            setSelectedPlaylists(initialSelected);
            setNewPlaylistName("");
            setShowNewPlaylistInput(false);
        }
    }, [isOpen, video, isPlaylistsSuccess, userPlaylists]);

    const handleCheckboxChange = (playlistId, checked) => {
        setSelectedPlaylists((prev) => ({ ...prev, [playlistId]: checked }));
    };

    const handleSave = async () => {
        const addedPlaylists = [];
        const removedPlaylists = [];

        Object.entries(selectedPlaylists).forEach(([playlistId, isChecked]) => {
            const wasInitiallyChecked =
                initialSelectedPlaylists[playlistId] || false;

            if (isChecked && !wasInitiallyChecked) {
                addedPlaylists.push(playlistId); // newly selected
            } else if (!isChecked && wasInitiallyChecked) {
                removedPlaylists.push(playlistId); // deselected
            }
        });

        // Create new playlist if requested
        if (showNewPlaylistInput && newPlaylistName.trim()) {
            await createPlaylist({
                name: newPlaylistName.trim(),
                description: "New Playlist",
                videos: [video._id],
                userId,
            });
        }

        // Add Videos to checked playlists
        if (addedPlaylists.length) {
            await addVideoToPlaylist({
                videoId: video._id,
                playlistIds: addedPlaylists,
                thumbnail: video.thumbnail,
            });
        }

        // Remove Video from unchecked playlists
        if (removedPlaylists.length) {
            await removeVideoFromPlaylist({
                videoId: video._id,
                playlistIds: removedPlaylists,
            });
        }

        // Add to Watch Later if nothing is selected
        if (
            !addedPlaylists.length &&
            !removedPlaylists.length &&
            !showNewPlaylistInput
        ) {
            // Todo: Implement add to watch later
        }

        // Refetch latest playlists to reflect new state
        refetch();
        onSave?.(); // optional callback
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Save to playlist</DialogTitle>
                    <DialogDescription>
                        Select playlists to add this video to, or create a new
                        one.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 max-h-[300px] overflow-y-auto">
                    {userPlaylists?.length === 0 && !showNewPlaylistInput && (
                        <p className="text-muted-foreground text-sm">
                            No playlists found. Create one below!
                        </p>
                    )}
                    {userPlaylists.map((p) => (
                        <div
                            key={p._id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`playlist-${p._id}`}
                                checked={selectedPlaylists[p._id]}
                                onCheckedChange={(checked) =>
                                    handleCheckboxChange(p._id, checked)
                                }
                            />
                            <Label
                                htmlFor={`playlist-${p._id}`}
                                className="text-sm font-medium"
                            >
                                {p.name} ({p.videos.length} videos)
                            </Label>
                        </div>
                    ))}

                    {showNewPlaylistInput ? (
                        <div className="grid gap-2 mt-4">
                            <Label htmlFor="new-playlist-name">
                                New playlist name
                            </Label>
                            <Input
                                id="new-playlist-name"
                                value={newPlaylistName}
                                onChange={(e) =>
                                    setNewPlaylistName(e.target.value)
                                }
                                placeholder="Enter playlist name"
                            />
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            className="w-full justify-start mt-4"
                            onClick={() => setShowNewPlaylistInput(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create new
                            playlist
                        </Button>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isCreateLoading}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
