import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Settings,
    User,
    Shield,
    Bell,
    Play,
    Database,
    Palette,
    Eye,
    EyeOff,
    Save,
    Camera,
    Mail,
    Lock,
    Smartphone,
    Monitor,
    Moon,
    Sun,
    Volume2,
    Download,
    Trash2,
    AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Tabs } from "../components/ui/tabs";
const TabsList = Tabs.List;
const TabsTrigger = Tabs.Trigger;
const TabsContent = Tabs.Content;
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useToast } from "../hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../components/theme-provider";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const { user } = useSelector((store) => store.auth);

    // State for different settings sections
    const [accountSettings, setAccountSettings] = useState({
        displayName: user?.displayName || "",
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: "public",
        showEmail: false,
        showSubscriptions: true,
        showPlaylists: true,
        allowComments: true,
        allowMessages: true,
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        subscriptionUpdates: true,
        commentReplies: true,
        likeNotifications: false,
        weeklyDigest: true,
    });

    const [playbackSettings, setPlaybackSettings] = useState({
        autoplay: true,
        quality: "auto",
        captions: false,
        volume: 80,
        playbackSpeed: "1",
        restrictedMode: false,
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    useEffect(() => {
        if (user) {
            setAccountSettings((prev) => ({
                ...prev,
                displayName: user.displayName || "",
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || "",
            }));
        }
    }, [user]);

    const handleAccountUpdate = async () => {
        try {
            // API call to update account settings
            toast({
                title: "Account updated",
                description:
                    "Your account settings have been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Update failed",
                description:
                    "There was an error updating your account settings.",
                variant: "destructive",
            });
        }
    };

    const handlePasswordChange = async () => {
        if (accountSettings.newPassword !== accountSettings.confirmPassword) {
            toast({
                title: "Password mismatch",
                description: "New password and confirmation don't match.",
                variant: "destructive",
            });
            return;
        }

        if (accountSettings.newPassword.length < 8) {
            toast({
                title: "Password too short",
                description: "Password must be at least 8 characters long.",
                variant: "destructive",
            });
            return;
        }

        try {
            // API call to change password
            toast({
                title: "Password changed",
                description: "Your password has been updated successfully.",
            });
            setAccountSettings((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));
        } catch (error) {
            toast({
                title: "Password change failed",
                description: "There was an error changing your password.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "DELETE") {
            toast({
                title: "Confirmation required",
                description:
                    "Please type 'DELETE' to confirm account deletion.",
                variant: "destructive",
            });
            return;
        }

        try {
            // API call to delete account
            toast({
                title: "Account deleted",
                description: "Your account has been permanently deleted.",
            });
            navigate("/");
        } catch (error) {
            toast({
                title: "Deletion failed",
                description: "There was an error deleting your account.",
                variant: "destructive",
            });
        }
    };

    const handleExportData = async () => {
        try {
            // API call to export user data
            toast({
                title: "Data export started",
                description:
                    "Your data export will be emailed to you within 24 hours.",
            });
        } catch (error) {
            toast({
                title: "Export failed",
                description: "There was an error starting your data export.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Settings className="h-8 w-8" />
                    Settings
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                    <TabsTrigger
                        value="account"
                        className="flex items-center gap-2"
                    >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Account</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="privacy"
                        className="flex items-center gap-2"
                    >
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Privacy</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="flex items-center gap-2"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="playback"
                        className="flex items-center gap-2"
                    >
                        <Play className="h-4 w-4" />
                        <span className="hidden sm:inline">Playback</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="appearance"
                        className="flex items-center gap-2"
                    >
                        <Palette className="h-4 w-4" />
                        <span className="hidden sm:inline">Appearance</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="data"
                        className="flex items-center gap-2"
                    >
                        <Database className="h-4 w-4" />
                        <span className="hidden sm:inline">Data</span>
                    </TabsTrigger>
                </TabsList>

                {/* Account Settings */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your profile details and personal
                                information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={user?.avatar || "/placeholder.svg"}
                                        alt="Profile picture"
                                    />
                                    <AvatarFallback>
                                        {user?.displayName
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <Button variant="outline">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Change Photo
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">
                                        Display Name
                                    </Label>
                                    <Input
                                        id="displayName"
                                        value={accountSettings.displayName}
                                        onChange={(e) =>
                                            setAccountSettings((prev) => ({
                                                ...prev,
                                                displayName: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={accountSettings.username}
                                        onChange={(e) =>
                                            setAccountSettings((prev) => ({
                                                ...prev,
                                                username: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={accountSettings.email}
                                    onChange={(e) =>
                                        setAccountSettings((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    rows={3}
                                    value={accountSettings.bio}
                                    onChange={(e) =>
                                        setAccountSettings((prev) => ({
                                            ...prev,
                                            bio: e.target.value,
                                        }))
                                    }
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <Button onClick={handleAccountUpdate}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">
                                    Current Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={accountSettings.currentPassword}
                                        onChange={(e) =>
                                            setAccountSettings((prev) => ({
                                                ...prev,
                                                currentPassword: e.target.value,
                                            }))
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={accountSettings.newPassword}
                                        onChange={(e) =>
                                            setAccountSettings((prev) => ({
                                                ...prev,
                                                newPassword: e.target.value,
                                            }))
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                        }
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={accountSettings.confirmPassword}
                                        onChange={(e) =>
                                            setAccountSettings((prev) => ({
                                                ...prev,
                                                confirmPassword: e.target.value,
                                            }))
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={handlePasswordChange}>
                                <Lock className="mr-2 h-4 w-4" />
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Settings */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Visibility</CardTitle>
                            <CardDescription>
                                Control who can see your profile and content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Profile Visibility</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose who can view your profile
                                    </p>
                                </div>
                                <Select
                                    value={privacySettings.profileVisibility}
                                    onValueChange={(value) =>
                                        setPrivacySettings((prev) => ({
                                            ...prev,
                                            profileVisibility: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">
                                            Public
                                        </SelectItem>
                                        <SelectItem value="unlisted">
                                            Unlisted
                                        </SelectItem>
                                        <SelectItem value="private">
                                            Private
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Show Email Address</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display your email on your public
                                            profile
                                        </p>
                                    </div>
                                    <Switch
                                        checked={privacySettings.showEmail}
                                        onCheckedChange={(checked) =>
                                            setPrivacySettings((prev) => ({
                                                ...prev,
                                                showEmail: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Show Subscriptions</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Let others see your subscriptions
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            privacySettings.showSubscriptions
                                        }
                                        onCheckedChange={(checked) =>
                                            setPrivacySettings((prev) => ({
                                                ...prev,
                                                showSubscriptions: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Show Playlists</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display your public playlists
                                        </p>
                                    </div>
                                    <Switch
                                        checked={privacySettings.showPlaylists}
                                        onCheckedChange={(checked) =>
                                            setPrivacySettings((prev) => ({
                                                ...prev,
                                                showPlaylists: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Allow Comments</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Let others comment on your videos
                                        </p>
                                    </div>
                                    <Switch
                                        checked={privacySettings.allowComments}
                                        onCheckedChange={(checked) =>
                                            setPrivacySettings((prev) => ({
                                                ...prev,
                                                allowComments: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Allow Messages</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive direct messages from other
                                            users
                                        </p>
                                    </div>
                                    <Switch
                                        checked={privacySettings.allowMessages}
                                        onCheckedChange={(checked) =>
                                            setPrivacySettings((prev) => ({
                                                ...prev,
                                                allowMessages: checked,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose what notifications you want to receive
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </p>
                                </div>
                                <Switch
                                    checked={
                                        notificationSettings.emailNotifications
                                    }
                                    onCheckedChange={(checked) =>
                                        setNotificationSettings((prev) => ({
                                            ...prev,
                                            emailNotifications: checked,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        Push Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications on your
                                        device
                                    </p>
                                </div>
                                <Switch
                                    checked={
                                        notificationSettings.pushNotifications
                                    }
                                    onCheckedChange={(checked) =>
                                        setNotificationSettings((prev) => ({
                                            ...prev,
                                            pushNotifications: checked,
                                        }))
                                    }
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Subscription Updates</Label>
                                        <p className="text-sm text-muted-foreground">
                                            New videos from channels you
                                            subscribe to
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.subscriptionUpdates
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                subscriptionUpdates: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Comment Replies</Label>
                                        <p className="text-sm text-muted-foreground">
                                            When someone replies to your
                                            comments
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.commentReplies
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                commentReplies: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Like Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            When someone likes your videos or
                                            comments
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.likeNotifications
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                likeNotifications: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Weekly Digest</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Weekly summary of your channel
                                            activity
                                        </p>
                                    </div>
                                    <Switch
                                        checked={
                                            notificationSettings.weeklyDigest
                                        }
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings((prev) => ({
                                                ...prev,
                                                weeklyDigest: checked,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Playback Settings */}
                <TabsContent value="playback" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Playback</CardTitle>
                            <CardDescription>
                                Customize your video viewing experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Autoplay</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically play the next video
                                    </p>
                                </div>
                                <Switch
                                    checked={playbackSettings.autoplay}
                                    onCheckedChange={(checked) =>
                                        setPlaybackSettings((prev) => ({
                                            ...prev,
                                            autoplay: checked,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Video Quality</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Default video quality preference
                                    </p>
                                </div>
                                <Select
                                    value={playbackSettings.quality}
                                    onValueChange={(value) =>
                                        setPlaybackSettings((prev) => ({
                                            ...prev,
                                            quality: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">
                                            Auto
                                        </SelectItem>
                                        <SelectItem value="1080p">
                                            1080p
                                        </SelectItem>
                                        <SelectItem value="720p">
                                            720p
                                        </SelectItem>
                                        <SelectItem value="480p">
                                            480p
                                        </SelectItem>
                                        <SelectItem value="360p">
                                            360p
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Playback Speed</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Default video playback speed
                                    </p>
                                </div>
                                <Select
                                    value={playbackSettings.playbackSpeed}
                                    onValueChange={(value) =>
                                        setPlaybackSettings((prev) => ({
                                            ...prev,
                                            playbackSpeed: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0.25">
                                            0.25x
                                        </SelectItem>
                                        <SelectItem value="0.5">
                                            0.5x
                                        </SelectItem>
                                        <SelectItem value="0.75">
                                            0.75x
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Normal
                                        </SelectItem>
                                        <SelectItem value="1.25">
                                            1.25x
                                        </SelectItem>
                                        <SelectItem value="1.5">
                                            1.5x
                                        </SelectItem>
                                        <SelectItem value="2">2x</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Captions</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show captions by default
                                    </p>
                                </div>
                                <Switch
                                    checked={playbackSettings.captions}
                                    onCheckedChange={(checked) =>
                                        setPlaybackSettings((prev) => ({
                                            ...prev,
                                            captions: checked,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Restricted Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Hide potentially mature content
                                    </p>
                                </div>
                                <Switch
                                    checked={playbackSettings.restrictedMode}
                                    onCheckedChange={(checked) =>
                                        setPlaybackSettings((prev) => ({
                                            ...prev,
                                            restrictedMode: checked,
                                        }))
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Volume2 className="h-4 w-4" />
                                    Default Volume: {playbackSettings.volume}%
                                </Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={playbackSettings.volume}
                                    onChange={(e) =>
                                        setPlaybackSettings((prev) => ({
                                            ...prev,
                                            volume: Number.parseInt(
                                                e.target.value
                                            ),
                                        }))
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme & Appearance</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the application
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant={
                                            theme === "light"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => setTheme("light")}
                                        className="flex items-center gap-2"
                                    >
                                        <Sun className="h-4 w-4" />
                                        Light
                                    </Button>
                                    <Button
                                        variant={
                                            theme === "dark"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => setTheme("dark")}
                                        className="flex items-center gap-2"
                                    >
                                        <Moon className="h-4 w-4" />
                                        Dark
                                    </Button>
                                    <Button
                                        variant={
                                            theme === "system"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => setTheme("system")}
                                        className="flex items-center gap-2"
                                    >
                                        <Monitor className="h-4 w-4" />
                                        System
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">
                                            English
                                        </SelectItem>
                                        <SelectItem value="es">
                                            Español
                                        </SelectItem>
                                        <SelectItem value="fr">
                                            Français
                                        </SelectItem>
                                        <SelectItem value="de">
                                            Deutsch
                                        </SelectItem>
                                        <SelectItem value="ja">
                                            日本語
                                        </SelectItem>
                                        <SelectItem value="ko">
                                            한국어
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Region</Label>
                                <Select defaultValue="us">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us">
                                            United States
                                        </SelectItem>
                                        <SelectItem value="uk">
                                            United Kingdom
                                        </SelectItem>
                                        <SelectItem value="ca">
                                            Canada
                                        </SelectItem>
                                        <SelectItem value="au">
                                            Australia
                                        </SelectItem>
                                        <SelectItem value="de">
                                            Germany
                                        </SelectItem>
                                        <SelectItem value="fr">
                                            France
                                        </SelectItem>
                                        <SelectItem value="jp">
                                            Japan
                                        </SelectItem>
                                        <SelectItem value="kr">
                                            South Korea
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Data & Privacy */}
                <TabsContent value="data" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription>
                                Manage your data and account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label>Export Your Data</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Download a copy of your account data
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleExportData}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label>Clear Watch History</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Remove all videos from your watch
                                            history
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label>Clear Search History</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Remove all your search queries
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">
                                Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert className="mb-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Deleting your account is permanent and
                                    cannot be undone. All your videos,
                                    playlists, and data will be permanently
                                    removed.
                                </AlertDescription>
                            </Alert>
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Delete Account Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">
                            Delete Account
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove all your data from
                            our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Please type <strong>DELETE</strong> to confirm
                                account deletion.
                            </AlertDescription>
                        </Alert>
                        <Input
                            value={deleteConfirmation}
                            onChange={(e) =>
                                setDeleteConfirmation(e.target.value)
                            }
                            placeholder="Type DELETE to confirm"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== "DELETE"}
                        >
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
