import { useState, useEffect, useMemo } from "react";
import { PlaylistCard } from "../components/PlaylistCard";
import { CreatePlaylistDialog } from "../components/CreatePlaylistDialog";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Search, Plus, X } from "lucide-react";
import {
    useDeletePlaylistMutation,
    useGetUserPlaylistsQuery,
    useCreatePlaylistMutation,
} from "../features/playlist/playlistsApiSlice";
import { useSelector } from "react-redux";

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const user = useSelector((store) => store.auth.user);
    const { data, isLoading, isSuccess, refetch } = useGetUserPlaylistsQuery(
        user._id
    );
    const [createPlaylist] = useCreatePlaylistMutation();
    const [deletePlaylist] = useDeletePlaylistMutation();
    useEffect(() => {
        if (data && isSuccess) {
            loadPlaylists();
        }
        refetch();
    }, [isLoading, isSuccess, refetch, data?.data]);

    const loadPlaylists = () => {
        const storedPlaylists = data?.data;

        if (storedPlaylists) {
            setPlaylists(storedPlaylists);
        }
    };

    const handleCreatePlaylist = async (name) => {
        await createPlaylist({
            name,
            description: "",
        });
    };

    const handleDeletePlaylist = async (playlistId) => {
        await deletePlaylist(playlistId);
        refetch();
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
                                    key={playlist._id}
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
