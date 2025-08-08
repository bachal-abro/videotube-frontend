import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Camera,
    Edit2,
    LinkIcon,
    Share2,
    Upload,
    Settings,
    Calendar,
    Users,
    ImageIcon,
    Video,
    Plus,
    X,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Tabs } from "../components/ui/tabs";
import { VideoCard } from "../components/video-card";
import { PlaylistCard } from "../components/PlaylistCard";
import { videosData as sampleVideos } from "../data/videos";
import { cn } from "../lib/utils";
import { useToast } from "../hooks/use-toast";
import { useGetUserPlaylistsQuery } from "../features/playlist/playlistsApiSlice";
import {
    useGetAllVideosOfUserQuery,
    useUploadVideoMutation,
} from "../features/videos/videosApiSlice";
import { useSelector } from "react-redux";
import {
    useGetUserChannelProfileQuery,
    useUpdateAccountDetailsMutation,
    useUpdateBannerMutation,
    useUpdateAvatarMutation,
} from "../features/users/usersApiSlice";
import { timeAgo } from "../utils/timeAgo";

const TabsList = Tabs.List;
const TabsTrigger = Tabs.Trigger;
const TabsContent = Tabs.Content;

const DEFAULT_PROFILE = {
    displayName: "John Doe",
    username: "@johndoe",
    description:
        "Welcome to my channel! I share tutorials, tips, and projects on web development and design.",
    banner: "", // data URL or external
    avatar: "",
    subscribersCount: 0,
    createdAt: "2024-01-01",
};

function toDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function ChannelPage() {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
    const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
    const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
    const [editDetailsState, setEditDetailsState] = useState({
        displayName: "",
        username: "",
        description: "",
    });
    const [tempBannerUrl, setTempBannerUrl] = useState("");
    const [tempBannerFile, setTempBannerFile] = useState(null);
    const [tempAvatarUrl, setTempAvatarUrl] = useState("");
    const [tempAvatarFile, setTempAvatarFile] = useState(null);
    const [activeTab, setActiveTab] = useState("home");
    const bannerInputRef = useRef(null);
    const avatarInputRef = useRef(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    const user = useSelector((store) => store.auth.user);

    // Load channel profile from API
    const { username } = useParams();
    const {
        data: userData,
        isLoading: isUserLoading,
        isSuccess: isUserSuccess,
    } = useGetUserChannelProfileQuery(username.split("@")[1]);

    useEffect(() => {
        if (isUserSuccess) {
            setProfile(userData.data);
        }
    }, [isUserLoading, isUserSuccess]);

    // Load uploaded videos
    const [featuredVideo, setFeaturedVideo] = useState({});
    const {
        data: videosData,
        isSuccess: videosSuccess,
        isLoading: videosLoading,
        refetch: videosRefetch,
    } = useGetAllVideosOfUserQuery();

    const uploadedVideos = useMemo(() => {
        if (videosData?.data) {
            const stored = videosData.data;
            setFeaturedVideo(videosData.data[0]);
            return stored ? videosData?.data : [];
        }
    }, [videosData, videosLoading, videosSuccess]);

    // Load playlists
    const { data, isLoading, isSuccess, refetch } = useGetUserPlaylistsQuery(
        user?._id
    );
    const playlists = useMemo(() => {
        if (data?.data) {
            const stored = data.data;
            return stored;
        }
        return [];
    }, [uploadedVideos, isLoading, isSuccess, data?.data]);

    // Edit functions
    const openEditDetails = () => {
        setEditDetailsState({
            displayName: profile.displayName,
            username: profile.username,
            description: profile.description,
        });
        setIsEditDetailsOpen(true);
    };

    const openEditBanner = () => {
        setTempBannerUrl(profile.banner);
        setTempBannerFile(null);
        setIsEditBannerOpen(true);
    };

    const openEditAvatar = () => {
        setTempAvatarUrl(profile.avatar);
        setTempAvatarFile(null);
        setIsEditAvatarOpen(true);
    };

    const handleBannerPick = () => bannerInputRef.current?.click();
    const handleAvatarPick = () => avatarInputRef.current?.click();

    const onBannerChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid file type",
                description: "Please select an image file.",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "Please select an image smaller than 5MB.",
                variant: "destructive",
            });
            return;
        }

        const data = await toDataURL(file);
        setTempBannerUrl(data);
        setTempBannerFile(file);
    };

    const onAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid file type",
                description: "Please select an image file.",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (2MB limit)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "Please select an image smaller than 2MB.",
                variant: "destructive",
            });
            return;
        }

        const data = await toDataURL(file);
        setTempAvatarUrl(data);
        setTempAvatarFile(file);
    };

    const [updateAccountDetails] = useUpdateAccountDetailsMutation();

    const saveDetails = async () => {
        let hasChanges = false;

        // Check text fields
        const textFields = ["displayName", "username", "description"];
        const updatedValues = {};
        textFields.forEach((field) => {
            const profileValue = String(profile[field] || "").trim();
            const editValue = String(editDetailsState[field] || "").trim();
            if (profileValue !== editValue) {
                updatedValues[field] = editValue;
                hasChanges = true;
            }
        });

        if (!hasChanges) {
            toast({
                title: "No changes detected",
                description: "Your profile is already up to date.",
            });
            return;
        }

        try {
            await updateAccountDetails(updatedValues).unwrap();
            navigate(`/@${editDetailsState?.username || profile.username}`);
            setIsEditDetailsOpen(false);
            toast({
                title: "Channel details updated",
                description: "Your channel information has been saved.",
            });
        } catch (error) {
            console.error("Update failed:", error);
            toast({
                title: "Update failed",
                description: "There was an error updating your channel.",
                variant: "destructive",
            });
        }
    };
    const [updateBanner] = useUpdateBannerMutation();
    const saveBanner = async () => {
        if (!tempBannerFile && tempBannerUrl === profile.banner) {
            toast({
                title: "No changes detected",
                description: "Banner is already up to date.",
            });
            return;
        }

        const formData = new FormData();
        if (tempBannerFile) {
            formData.append("banner", tempBannerFile);
        } else if (!tempBannerUrl) {
            // Handle banner removal if needed
            formData.append("removeBanner", "true");
        }

        try {
            await updateBanner(formData).unwrap();
            setIsEditBannerOpen(false);
            toast({
                title: "Banner updated",
                description: "Your channel banner has been saved.",
            });
        } catch (error) {
            console.error("Banner update failed:", error);
            toast({
                title: "Update failed",
                description: "There was an error updating your banner.",
                variant: "destructive",
            });
        }
    };

    const [updateAvatar] = useUpdateAvatarMutation();
    const saveAvatar = async () => {
        if (!tempAvatarFile && tempAvatarUrl === profile.avatar) {
            toast({
                title: "No changes detected",
                description: "Avatar is already up to date.",
            });
            return;
        }

        const formData = new FormData();
        if (tempAvatarFile) {
            formData.append("avatar", tempAvatarFile);
        } else if (!tempAvatarUrl) {
            // Handle avatar removal if needed
            formData.append("removeAvatar", "true");
        }

        try {
            await updateAvatar(formData).unwrap();
            setIsEditAvatarOpen(false);
            toast({
                title: "Avatar updated",
                description: "Your channel avatar has been saved.",
            });
        } catch (error) {
            console.error("Avatar update failed:", error);
            toast({
                title: "Update failed",
                description: "There was an error updating your avatar.",
                variant: "destructive",
            });
        }
    };

    const removeBanner = () => {
        setTempBannerUrl("");
        setTempBannerFile(null);
    };

    const removeAvatar = () => {
        setTempAvatarUrl("");
        setTempAvatarFile(null);
    };

    const subscriberLabel = useMemo(() => {
        const n = profile?.subscribersCount || 0;
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M subscribers`;
        if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K subscribers`;
        return `${n} subscriber${n === 1 ? "" : "s"}`;
    }, [profile?.subscribersCount]);

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            {/* Banner */}
            <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden bg-muted group">
                {profile.banner ? (
                    <img
                        src={profile.banner || "/placeholder.svg"}
                        alt="Channel banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground">
                        <div className="text-center space-y-2">
                            <ImageIcon className="h-8 w-8 mx-auto" />
                            <p className="text-sm">
                                Add a banner to showcase your channel
                            </p>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
                        onClick={openEditBanner}
                    >
                        <Camera className="mr-2 h-4 w-4" />
                        {profile.banner ? "Change banner" : "Add banner"}
                    </Button>
                </div>
            </div>

            {/* Channel header */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative -mt-16 group">
                        <div className="h-24 w-24 rounded-full ring-4 ring-background overflow-hidden bg-muted">
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar || "/placeholder.svg"}
                                    alt={`${profile.displayName} avatar`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full grid place-items-center text-muted-foreground">
                                    <Camera className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
                            onClick={openEditAvatar}
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {profile.displayName}
                        </h1>
                        <div className="text-sm text-muted-foreground">
                            {profile.username} • {subscriberLabel}
                        </div>
                    </div>
                </div>
                <div className="sm:ml-auto flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={openEditDetails}
                    >
                        <Edit2 className="mr-2 h-4 w-4" /> Edit details
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => navigate("/your-videos")}
                    >
                        <Settings className="mr-2 h-4 w-4" /> Manage videos
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => navigate("/upload")}
                    >
                        <Upload className="mr-2 h-4 w-4" /> Upload
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-6">
                <Tabs
                    defaultValue="home"
                    value={activeTab}
                    onValueChange={setActiveTab}
                >
                    <TabsList className="flex gap-1">
                        <TabsTrigger value="home">Home</TabsTrigger>
                        <TabsTrigger value="videos">Videos</TabsTrigger>
                        <TabsTrigger value="playlists">Playlists</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                    </TabsList>

                    {/* Home */}
                    <TabsContent value="home">
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                            {/* Featured video */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Featured</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {featuredVideo ? (
                                        <div className="space-y-3">
                                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                                                {featuredVideo.videoFile ? (
                                                    <video
                                                        src={
                                                            featuredVideo.videoFile
                                                        }
                                                        className="w-full h-full"
                                                        controls
                                                        poster={
                                                            featuredVideo.thumbnail
                                                        }
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            featuredVideo.thumbnail ||
                                                            "/placeholder.svg" ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={
                                                            featuredVideo.title
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold line-clamp-2">
                                                    {featuredVideo.title}
                                                </h3>
                                                <div className="text-sm text-muted-foreground">
                                                    {featuredVideo.views} views
                                                    •{" "}
                                                    {timeAgo(
                                                        featuredVideo.createdAt
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        `/video/${featuredVideo._id}`
                                                    )
                                                }
                                            >
                                                <Video className="mr-2 h-4 w-4" />{" "}
                                                Watch now
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 space-y-3">
                                            <p className="text-muted-foreground">
                                                No videos yet
                                            </p>
                                            <Button
                                                onClick={() =>
                                                    navigate("/upload")
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />{" "}
                                                Upload your first video
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* About quick */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>About</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm whitespace-pre-line">
                                        {profile.description}
                                    </p>
                                    <Separator />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />{" "}
                                            Joined
                                        </span>
                                        <span>
                                            {timeAgo(profile.createdAt)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Latest uploads */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">
                                    Latest uploads
                                </h3>
                                {uploadedVideos?.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setActiveTab("videos")}
                                    >
                                        See all
                                    </Button>
                                )}
                            </div>
                            {uploadedVideos?.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center space-y-2">
                                        <p className="text-muted-foreground">
                                            No uploads yet.
                                        </p>
                                        <Button
                                            onClick={() => navigate("/upload")}
                                        >
                                            Upload a video
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {uploadedVideos?.slice(0, 8)?.map((v) => (
                                        <VideoCard
                                            key={v._id}
                                            id={v._id}
                                            thumbnail={v.thumbnail}
                                            title={v.title}
                                            channelName={profile.displayName}
                                            channelAvatar={
                                                profile.avatar ||
                                                "https://placehold.co/40x40?text=U"
                                            }
                                            views={v.views || "0"}
                                            timestamp={v.createdAt}
                                            duration={v.duration || "0:00"}
                                            videoPreview={v.videoFile}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Videos */}
                    <TabsContent value="videos">
                        {uploadedVideos?.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center space-y-2">
                                    <p className="text-muted-foreground">
                                        You haven't uploaded any videos yet.
                                    </p>
                                    <Button onClick={() => navigate("/upload")}>
                                        <Upload className="mr-2 h-4 w-4" />{" "}
                                        Upload video
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {uploadedVideos?.map((v) => (
                                    <VideoCard
                                        key={v._id}
                                        id={v._id}
                                        thumbnail={v.thumbnail}
                                        title={v.title}
                                        channelName={profile.displayName}
                                        channelAvatar={
                                            profile.avatar ||
                                            "https://placehold.co/40x40?text=U"
                                        }
                                        views={v.views || "0"}
                                        timestamp={v.createdAt || "just now"}
                                        duration={v.duration || "0:00"}
                                        videoPreview={v.videoPreview}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Playlists */}
                    <TabsContent value="playlists">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Playlists</h3>
                            <Button
                                variant="outline"
                                className="bg-transparent"
                                onClick={() => navigate("/playlists")}
                            >
                                Manage playlists
                            </Button>
                        </div>
                        {playlists.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center space-y-2">
                                    <p className="text-muted-foreground">
                                        No playlists yet.
                                    </p>
                                    <Button
                                        onClick={() => navigate("/playlists")}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Create
                                        playlist
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {playlists.map((p) => (
                                    <PlaylistCard
                                        key={p._id}
                                        playlist={p}
                                        onDelete={() => {
                                            /* channel page: no delete here */
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* About */}
                    <TabsContent value="about">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">
                                        Description
                                    </h3>
                                    <p className="text-sm whitespace-pre-line">
                                        {profile.description}
                                    </p>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Channel name
                                        </span>
                                        <span className="font-medium">
                                            {profile.displayName}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Handle
                                        </span>
                                        <span className="font-medium">
                                            {profile.username}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Subscribers
                                        </span>
                                        <span className="font-medium">
                                            {profile.subscribersCount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Joined
                                        </span>
                                        <span className="font-medium">
                                            {timeAgo(profile.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button
                                        variant="outline"
                                        className="bg-transparent"
                                        onClick={openEditDetails}
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        channel details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Edit Channel Details Dialog */}
            <Dialog
                open={isEditDetailsOpen}
                onOpenChange={setIsEditDetailsOpen}
            >
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit channel details</DialogTitle>
                        <DialogDescription>
                            Update your channel's name, username, and
                            description.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Channel name</Label>
                                <Input
                                    id="name"
                                    value={editDetailsState.displayName}
                                    onChange={(e) =>
                                        setEditDetailsState((s) => ({
                                            ...s,
                                            displayName: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter channel name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={editDetailsState.username}
                                    onChange={(e) =>
                                        setEditDetailsState((s) => ({
                                            ...s,
                                            username: e.target.value,
                                        }))
                                    }
                                    placeholder="@username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={editDetailsState.description}
                                onChange={(e) =>
                                    setEditDetailsState((s) => ({
                                        ...s,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Tell viewers about your channel"
                            />
                            <p className="text-xs text-muted-foreground">
                                {editDetailsState.description.length}/1000
                                characters
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDetailsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={saveDetails}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Banner Dialog */}
            <Dialog open={isEditBannerOpen} onOpenChange={setIsEditBannerOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit channel banner</DialogTitle>
                        <DialogDescription>
                            Upload a banner image to represent your channel.
                            Recommended size: 2560 x 1440 pixels.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        {/* Banner Preview */}
                        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                            {tempBannerUrl ? (
                                <>
                                    <img
                                        src={
                                            tempBannerUrl || "/placeholder.svg"
                                        }
                                        alt="Banner preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={removeBanner}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <div className="w-full h-full grid place-items-center text-muted-foreground">
                                    <div className="text-center space-y-2">
                                        <ImageIcon className="h-8 w-8 mx-auto" />
                                        <p className="text-sm">
                                            No banner selected
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex gap-2">
                            <Button
                                onClick={handleBannerPick}
                                className="flex-1"
                            >
                                <ImageIcon className="mr-2 h-4 w-4" />
                                {tempBannerUrl
                                    ? "Change banner"
                                    : "Upload banner"}
                            </Button>
                            {tempBannerUrl && (
                                <Button
                                    variant="outline"
                                    onClick={removeBanner}
                                    className="bg-transparent"
                                >
                                    <X className="mr-2 h-4 w-4" /> Remove
                                </Button>
                            )}
                        </div>

                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onBannerChange}
                        />

                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Recommended size: 2560 x 1440 pixels</p>
                            <p>• Maximum file size: 5MB</p>
                            <p>• Supported formats: JPG, PNG, GIF</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditBannerOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={saveBanner}>Save banner</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Avatar Dialog */}
            <Dialog open={isEditAvatarOpen} onOpenChange={setIsEditAvatarOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit channel avatar</DialogTitle>
                        <DialogDescription>
                            Upload a profile picture for your channel. It will
                            appear as a circle.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        {/* Avatar Preview */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full overflow-hidden bg-muted ring-4 ring-background">
                                    {tempAvatarUrl ? (
                                        <img
                                            src={
                                                tempAvatarUrl ||
                                                "/placeholder.svg"
                                            }
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full grid place-items-center text-muted-foreground">
                                            <Camera className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                {tempAvatarUrl && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 rounded-full h-8 w-8 p-0"
                                        onClick={removeAvatar}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Upload Controls */}
                        <div className="flex gap-2">
                            <Button
                                onClick={handleAvatarPick}
                                className="flex-1"
                            >
                                <Camera className="mr-2 h-4 w-4" />
                                {tempAvatarUrl
                                    ? "Change avatar"
                                    : "Upload avatar"}
                            </Button>
                            {tempAvatarUrl && (
                                <Button
                                    variant="outline"
                                    onClick={removeAvatar}
                                    className="bg-transparent"
                                >
                                    <X className="mr-2 h-4 w-4" /> Remove
                                </Button>
                            )}
                        </div>

                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onAvatarChange}
                        />

                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Recommended size: 800 x 800 pixels</p>
                            <p>• Maximum file size: 2MB</p>
                            <p>• Supported formats: JPG, PNG, GIF</p>
                            <p>• Image will be cropped to a circle</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditAvatarOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={saveAvatar}>Save avatar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
