import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Plus } from "lucide-react";

export function AddToPlaylistDialog({ isOpen, onOpenChange, video, onSave }) {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState({});
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const storedPlaylists = localStorage.getItem("playlists");
            const parsedPlaylists = storedPlaylists
                ? JSON.parse(storedPlaylists)
                : [];
            setPlaylists(parsedPlaylists);

            // Initialize selected playlists based on current video's presence
            const initialSelected = {};
            parsedPlaylists.forEach((p) => {
                initialSelected[p.id] = p.videoIds.includes(video.id);
            });
            setSelectedPlaylists(initialSelected);
            setNewPlaylistName("");
            setShowNewPlaylistInput(false);
        }
    }, [isOpen, video]);

    const handleCheckboxChange = (playlistId, checked) => {
        setSelectedPlaylists((prev) => ({ ...prev, [playlistId]: checked }));
    };

    const handleSave = () => {
        const updatedPlaylists = playlists.map((p) => {
            const isSelected = selectedPlaylists[p.id];
            const videoAlreadyInPlaylist = p.videoIds.includes(video.id);

            if (isSelected && !videoAlreadyInPlaylist) {
                return { ...p, videoIds: [...p.videoIds, video.id] };
            } else if (!isSelected && videoAlreadyInPlaylist) {
                return {
                    ...p,
                    videoIds: p.videoIds.filter((id) => id !== video.id),
                };
            }
            return p;
        });

        let finalPlaylists = updatedPlaylists;

        if (showNewPlaylistInput && newPlaylistName.trim()) {
            const newPlaylist = {
                id: `playlist-${Date.now()}`, // Simple unique ID
                name: newPlaylistName.trim(),
                videoIds: [video.id],
            };
            finalPlaylists = [...updatedPlaylists, newPlaylist];
        }

        localStorage.setItem("playlists", JSON.stringify(finalPlaylists));
        onSave(); // Callback to refresh parent state if needed
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
                    {playlists.length === 0 && !showNewPlaylistInput && (
                        <p className="text-muted-foreground text-sm">
                            No playlists found. Create one below!
                        </p>
                    )}
                    {playlists.map((p) => (
                        <div key={p.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`playlist-${p.id}`}
                                checked={selectedPlaylists[p.id]}
                                onCheckedChange={(checked) =>
                                    handleCheckboxChange(p.id, checked)
                                }
                            />
                            <Label
                                htmlFor={`playlist-${p.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {p.name} ({p.videoIds.length} videos)
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
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
