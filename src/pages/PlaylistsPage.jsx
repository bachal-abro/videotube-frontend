import { useState, useEffect, useMemo } from "react";
import { PlaylistCard } from "../components/PlaylistCard";
import { CreatePlaylistDialog } from "../components/CreatePlaylistDialog";
import { videosData } from "../data/videos"; // To get video details for thumbnails
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Plus, X } from "lucide-react";

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = () => {
        const storedPlaylists = localStorage.getItem("playlists");
        if (storedPlaylists) {
            const parsedPlaylists = JSON.parse(storedPlaylists);
            // Hydrate playlists with actual video objects for thumbnails/details
            const hydratedPlaylists = parsedPlaylists.map((p) => ({
                ...p,
                videos: p.videoIds
                    .map((videoId) => videosData.find((v) => v.id === videoId))
                    .filter(Boolean),
            }));
            setPlaylists(hydratedPlaylists);
        }
    };

    const handleCreatePlaylist = (name) => {
        const newPlaylist = {
            id: `playlist-${Date.now()}`, // Simple unique ID
            name,
            videoIds: [],
            videos: [], // Initialize with empty array for hydrated data
        };
        const updatedPlaylists = [...playlists, newPlaylist];
        setPlaylists(updatedPlaylists);
        localStorage.setItem(
            "playlists",
            JSON.stringify(
                updatedPlaylists.map((p) => ({
                    id: p.id,
                    name: p.name,
                    videoIds: p.videoIds,
                }))
            )
        );
    };

    const handleDeletePlaylist = (idToDelete) => {
        const updatedPlaylists = playlists.filter((p) => p.id !== idToDelete);
        setPlaylists(updatedPlaylists);
        localStorage.setItem(
            "playlists",
            JSON.stringify(
                updatedPlaylists.map((p) => ({
                    id: p.id,
                    name: p.name,
                    videoIds: p.videoIds,
                }))
            )
        );
    };

    const filteredPlaylists = useMemo(() => {
        if (!searchQuery) {
            return playlists;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return playlists.filter((playlist) =>
            playlist.name.toLowerCase().includes(lowerCaseQuery)
        );
    }, [playlists, searchQuery]);

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <h1 className="text-2xl font-bold mb-6">Your Playlists</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                {/* Main Playlists List */}
                <div className="space-y-4">
                    {filteredPlaylists.length === 0 ? (
                        <p className="text-muted-foreground">
                            {searchQuery
                                ? "No matching playlists found."
                                : "No playlists created yet."}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredPlaylists.map((playlist) => (
                                <PlaylistCard
                                    key={playlist.id}
                                    playlist={playlist}
                                    onDelete={handleDeletePlaylist}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Playlists Sidebar */}
                <div className="space-y-6 lg:border-l lg:pl-6">
                    {/* Create Playlist Button */}
                    <Button
                        className="w-full"
                        onClick={() => setIsCreateDialogOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create New Playlist
                    </Button>

                    <hr className="border-border" />

                    {/* Search Playlists Input */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            Search Playlists
                        </h3>
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="Search playlists"
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
                                    <span className="sr-only">
                                        Clear search
                                    </span>
                                </Button>
                            )}
                            {!searchQuery && (
                                <Search className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreatePlaylistDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onCreate={handleCreatePlaylist}
            />
        </div>
    );
}
