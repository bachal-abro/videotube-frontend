import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart3,
    TrendingUp,
    Users,
    Eye,
    ThumbsUp,
    MessageSquare,
    Upload,
    Video,
    Clock,
    DollarSign,
    Play,
    Settings,
    Share2,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { Tabs } from "@/components/ui/Tabs";
const TabsList = Tabs.List;
const TabsTrigger = Tabs.Trigger;
const TabsContent = Tabs.Content;
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { VideoCard } from "@/components/VideoCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSelector } from "react-redux";
import { useGetAllVideosOfUserQuery } from "../features/videos/videosApiSlice";
import { timeAgo } from "../utils/timeFormats";

export default function DashboardPage() {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState("7d");
    const [isLoading, setIsLoading] = useState(true);

    const { data: videosData, isLoading: videosLoading } =
        useGetAllVideosOfUserQuery();

    // Mock analytics data - in real app, this would come from API
    const [analytics, setAnalytics] = useState({
        totalViews: 0,
        totalSubscribers: 0,
        totalVideos: 0,
        totalLikes: 0,
        totalComments: 0,
        estimatedRevenue: 0,
        watchTime: 0,
        viewsChange: 0,
        subscribersChange: 0,
        recentVideos: [],
        topVideos: [],
        recentComments: [],
    });

    useEffect(() => {
        // Simulate loading analytics data
        const loadAnalytics = async () => {
            setIsLoading(true);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Calculate analytics from videos data
            if (videosData?.data) {
                const videos = videosData.data;
                const totalViews = videos.reduce(
                    (sum, video) => sum + (Number.parseInt(video.views) || 0),
                    0
                );
                const totalLikes = videos.reduce(
                    (sum, video) => sum + (video.likes || 0),
                    0
                );
                const totalComments = videos.reduce(
                    (sum, video) => sum + (video.comments?.length || 0),
                    0
                );

                setAnalytics({
                    totalViews,
                    totalSubscribers: user?.subscribersCount || 1247,
                    totalVideos: videos.length,
                    totalLikes,
                    totalComments,
                    estimatedRevenue: totalViews * 0.001, // $1 per 1000 views
                    watchTime: totalViews * 3.5, // Average 3.5 minutes per view
                    viewsChange: 12.5,
                    subscribersChange: 8.3,
                    recentVideos: videos.slice(0, 5),
                    topVideos: videos
                        .sort(
                            (a, b) =>
                                (Number.parseInt(b.views) || 0) -
                                (Number.parseInt(a.views) || 0)
                        )
                        .slice(0, 5),
                    recentComments: [
                        {
                            id: 1,
                            author: "John Doe",
                            content: "Great video! Really helpful.",
                            video: "React Tutorial",
                            time: "2 hours ago",
                        },
                        {
                            id: 2,
                            author: "Jane Smith",
                            content: "Thanks for the explanation!",
                            video: "JavaScript Basics",
                            time: "4 hours ago",
                        },
                        {
                            id: 3,
                            author: "Mike Johnson",
                            content: "Could you make a follow-up video?",
                            video: "CSS Grid",
                            time: "6 hours ago",
                        },
                    ],
                });
            }

            setIsLoading(false);
        };

        loadAnalytics();
    }, [videosData, user]);

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    if (isLoading || videosLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <BarChart3 className="h-8 w-8" />
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back, {user?.displayName || user?.username}!
                            Here's how your channel is performing.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">Last 24h</SelectItem>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">
                                    Last 30 days
                                </SelectItem>
                                <SelectItem value="90d">
                                    Last 90 days
                                </SelectItem>
                                <SelectItem value="1y">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={() => navigate("/upload")}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Video
                        </Button>
                    </div>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Views
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(analytics.totalViews)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">
                                +{analytics.viewsChange}%
                            </span>{" "}
                            from last period
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Subscribers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(analytics.totalSubscribers)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">
                                +{analytics.subscribersChange}%
                            </span>{" "}
                            from last period
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Watch Time
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatDuration(analytics.watchTime)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+15.2%</span> from
                            last period
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Estimated Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${analytics.estimatedRevenue.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+22.1%</span> from
                            last period
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Videos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Video className="h-5 w-5" />
                                    Recent Videos
                                </CardTitle>
                                <CardDescription>
                                    Your latest uploads
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analytics.recentVideos.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            No videos uploaded yet
                                        </p>
                                        <Button
                                            onClick={() => navigate("/upload")}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Your First Video
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {analytics.recentVideos.map((video) => (
                                            <div
                                                key={video._id}
                                                className="flex items-center gap-3"
                                            >
                                                <img
                                                    src={
                                                        video.thumbnail ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={video.title}
                                                    className="w-16 h-12 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {video.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {video.views || 0} views
                                                        •{" "}
                                                        {timeAgo(
                                                            video.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                navigate(
                                                                    `/video/${video._id}`
                                                                )
                                                            }
                                                        >
                                                            <Play className="mr-2 h-4 w-4" />
                                                            Watch
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Settings className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Share2 className="mr-2 h-4 w-4" />
                                                            Share
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Channel Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Channel Performance
                                </CardTitle>
                                <CardDescription>
                                    Key metrics for your channel
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Total Videos</span>
                                        <span className="font-medium">
                                            {analytics.totalVideos}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Total Likes</span>
                                        <span className="font-medium">
                                            {formatNumber(analytics.totalLikes)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Total Comments</span>
                                        <span className="font-medium">
                                            {formatNumber(
                                                analytics.totalComments
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subscriber Goal</span>
                                        <span className="font-medium">
                                            {formatNumber(
                                                analytics.totalSubscribers
                                            )}
                                            /10K
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            (analytics.totalSubscribers /
                                                10000) *
                                            100
                                        }
                                        className="h-2"
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        variant="outline"
                                        className="w-full bg-transparent"
                                        onClick={() =>
                                            navigate(`/@${user?.username}`)
                                        }
                                    >
                                        View Channel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Comments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Recent Comments
                            </CardTitle>
                            <CardDescription>
                                Latest comments on your videos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analytics.recentComments.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        No comments yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {analytics.recentComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="flex items-start gap-3"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {comment.author.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-sm">
                                                        {comment.author}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {comment.time}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {comment.content}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    on "{comment.video}"
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                Reply
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Videos Tab */}
                <TabsContent value="videos" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Your Videos</h3>
                        <Button onClick={() => navigate("/your-videos")}>
                            Manage All Videos
                        </Button>
                    </div>

                    {analytics.recentVideos.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No videos yet
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Start creating content by uploading your
                                    first video
                                </p>
                                <Button onClick={() => navigate("/upload")}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Video
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {analytics.recentVideos.map((video) => (
                                <VideoCard
                                    key={video._id}
                                    id={video._id}
                                    thumbnail={video.thumbnail}
                                    title={video.title}
                                    channelName={
                                        user?.displayName || user?.username
                                    }
                                    channelAvatar={user?.avatar}
                                    views={video.views || "0"}
                                    timestamp={video.createdAt}
                                    duration={video.duration || "0:00"}
                                    videoPreview={video.videoFile}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Videos</CardTitle>
                                <CardDescription>
                                    Your most viewed content
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.topVideos
                                        .slice(0, 5)
                                        .map((video, index) => (
                                            <div
                                                key={video._id}
                                                className="flex items-center gap-3"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <img
                                                    src={
                                                        video.thumbnail ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={video.title}
                                                    className="w-16 h-12 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {video.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatNumber(
                                                            Number.parseInt(
                                                                video.views
                                                            ) || 0
                                                        )}{" "}
                                                        views
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Growth Metrics</CardTitle>
                                <CardDescription>
                                    Your channel's growth over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Views Growth
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                            +{analytics.viewsChange}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={analytics.viewsChange}
                                        className="h-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Subscriber Growth
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                            +{analytics.subscribersChange}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={analytics.subscribersChange}
                                        className="h-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Engagement Rate
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                            +18.7%
                                        </span>
                                    </div>
                                    <Progress value={18.7} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Revenue Growth
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                            +22.1%
                                        </span>
                                    </div>
                                    <Progress value={22.1} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Comments</CardTitle>
                            <CardDescription>
                                Manage comments on your videos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.recentComments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex items-start gap-3 p-4 border rounded-lg"
                                    >
                                        <Avatar>
                                            <AvatarFallback>
                                                {comment.author.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">
                                                    {comment.author}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {comment.time}
                                                </p>
                                            </div>
                                            <p className="text-sm mb-2">
                                                {comment.content}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                on "{comment.video}"
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm">
                                                <ThumbsUp className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                Reply
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        Pin Comment
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Hide Comment
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        Delete Comment
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
