;

import { useState } from "react";
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

export function CreatePlaylistDialog({ isOpen, onOpenChange, onCreate }) {
    const [playlistName, setPlaylistName] = useState("");

    const handleSubmit = () => {
        if (playlistName.trim()) {
            onCreate(playlistName.trim());
            setPlaylistName("");
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new playlist</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new playlist.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            className="col-span-3"
                            placeholder="My Awesome Playlist"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!playlistName.trim()}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
