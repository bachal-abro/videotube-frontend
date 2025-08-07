"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Upload,
    Video,
    Image,
    X,
    Play,
    Pause,
    Eye,
    EyeOff,
    Save,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";
import { useUploadVideoMutation } from "../features/videos/videosApiSlice";

const UPLOAD_STEPS = {
    SELECT: "select",
    UPLOADING: "uploading",
    PROCESSING: "processing",
    DETAILS: "details",
    PUBLISHING: "publishing",
    COMPLETE: "complete",
};

const VISIBILITY_OPTIONS = [
    {
        value: "public",
        label: "Public",
        description: "Anyone can search for and view",
    },
    {
        value: "unlisted",
        label: "Unlisted",
        description: "Anyone with the link can view",
    },
    { value: "private", label: "Private", description: "Only you can view" },
];

export default function UploadPage() {
    const navigate = useNavigate();
    const formData = new FormData();
    const { toast } = useToast();
    const fileInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);
    const videoPreviewRef = useRef(null);

    // Upload state
    const [currentStep, setCurrentStep] = useState(UPLOAD_STEPS.SELECT);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingProgress, setProcessingProgress] = useState(0);

    // File state
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [customThumbnail, setCustomThumbnail] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [generatedThumbnails, setGeneratedThumbnails] = useState([]);
    const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);

    // Video metadata
    const [videoData, setVideoData] = useState({
        title: "",
        description: "",
        tags: "",
        category: "Education",
        visibility: "public",
        allowComments: true,
        allowRatings: true,
    });

    // Validation
    const [errors, setErrors] = useState({});

    const [uploadVideo, { isSuccess, isLoading }] = useUploadVideoMutation();

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("video/")) {
            toast({
                title: "Invalid file type",
                description: "Please select a video file.",
                variant: "destructive",
            });
            return;
        }
        // Validate file size (100MB limit for demo)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "Please select a video file smaller than 100MB.",
                variant: "destructive",
            });
            return;
        }

        setSelectedFile(file);

        // Create video preview URL
        const videoUrl = URL.createObjectURL(file);
        setVideoPreview(videoUrl);

        // Auto-generate title from filename
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setVideoData((prev) => ({
            ...prev,
            title: fileName
                .replace(/[_-]/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
        }));

        // Start upload simulation
        simulateProcessing();
    };

    const simulateUpload = () => {
        setCurrentStep(UPLOAD_STEPS.UPLOADING);

        // Simulate upload progress
        let progress = 0;
        const uploadInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(uploadInterval);
                setUploadProgress(100);

                // Start processing
                setTimeout(() => {
                    simulateProcessing();
                }, 500);
            }
            setUploadProgress(Math.min(progress, 100));
        }, 200);
    };

    const simulateProcessing = () => {
        setCurrentStep(UPLOAD_STEPS.PROCESSING);

        // Generate thumbnail previews
        generateThumbnails();

        // Simulate processing progress
        let progress = 0;
        const processingInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(processingInterval);
                setProcessingProgress(100);

                // Move to details step
                setTimeout(() => {
                    setCurrentStep(UPLOAD_STEPS.DETAILS);
                }, 500);
            }
            setProcessingProgress(Math.min(progress, 100));
        }, 300);
    };

    const generateThumbnails = () => {
        // Simulate thumbnail generation with placeholder images
        const thumbnails = [
            `https://placehold.co/320x180/333/white?text=Thumbnail+1`,
            `https://placehold.co/320x180/666/white?text=Thumbnail+2`,
            `https://placehold.co/320x180/999/white?text=Thumbnail+3`,
        ];
        setGeneratedThumbnails(thumbnails);
    };

    const handleThumbnailUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid file type",
                description: "Please select an image file.",
                variant: "destructive",
            });
            return;
        }
        setThumbnailFile(file);
        const imageUrl = URL.createObjectURL(file);
        setCustomThumbnail(imageUrl);
        setSelectedThumbnailIndex(-1); // -1 indicates custom thumbnail
    };

    const validateForm = () => {
        const newErrors = {};

        if (!videoData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (videoData.title.length > 100) {
            newErrors.title = "Title must be less than 100 characters";
        }

        if (videoData.description.length > 5000) {
            newErrors.description =
                "Description must be less than 5000 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePublish = async () => {
        // Validate form first
        if (!validateForm()) {
            toast({
                title: "Please fix the errors",
                description: "Check the form for validation errors.",
                variant: "destructive",
            });
            return;
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append("title", videoData.title);
        formData.append("description", videoData.description);
        formData.append("tags", videoData.tags);
        formData.append("category", videoData.category);
        formData.append("visibility", videoData.visibility);
        formData.append("allowComments", videoData.allowComments);
        formData.append("allowRatings", videoData.allowRatings);

        // Handle thumbnail: either custom or selected
        const selectedThumbnail =
            selectedThumbnailIndex === -1
                ? thumbnailFile
                : generatedThumbnails[selectedThumbnailIndex];

        formData.append("thumbnail", selectedThumbnail);

        // Handle video file
        if (selectedFile instanceof File) {
            formData.append("videoFile", selectedFile);
        } else {
            toast({
                title: "No video selected",
                description: "Please select a video file to upload.",
                variant: "destructive",
            });
            return;
        }

        try {
            setCurrentStep(UPLOAD_STEPS.PUBLISHING);

            // Reset upload progress for publishing
            setUploadProgress(0);

            // Simulate publishing progress
            const publishingInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    const increment = Math.random() * 15 + 5; // 5-20% increments
                    const newProgress = Math.min(prev + increment, 100);

                    if (newProgress >= 100) {
                        clearInterval(publishingInterval);

                        // Complete the upload process
                        setTimeout(async () => {
                            try {
                                // Make the actual API call
                                const newVideo = await uploadVideo(
                                    formData
                                ).unwrap();

                                // Move to complete step
                                setCurrentStep(UPLOAD_STEPS.COMPLETE);

                                toast({
                                    title: "Video uploaded successfully!",
                                    description: `"${videoData.title}" has been published.`,
                                });

                                // Navigate to video after a short delay
                                setTimeout(() => {
                                    navigate(`/video/${newVideo.data._id}`);
                                }, 2000);
                            } catch (apiError) {
                                console.error("API upload failed:", apiError);
                                toast({
                                    title: "Upload failed",
                                    description:
                                        "There was an error uploading your video.",
                                    variant: "destructive",
                                });
                                // Reset to details step to allow retry
                                setCurrentStep(UPLOAD_STEPS.DETAILS);
                            }
                        }, 500);
                    }

                    return newProgress;
                });
            }, 300); // Update every 300ms for smooth progress
        } catch (error) {
            console.error("Upload failed:", error);
            toast({
                title: "Upload failed",
                description: "There was an error uploading your video.",
                variant: "destructive",
            });
            // Reset to details step to allow retry
            setCurrentStep(UPLOAD_STEPS.DETAILS);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        const videoFile = files.find((file) => file.type.startsWith("video/"));

        if (videoFile) {
            setSelectedFile(videoFile);
            handleFileSelect({ target: { files: [videoFile] } });
        }
    };

    const resetUpload = () => {
        setCurrentStep(UPLOAD_STEPS.SELECT);
        setSelectedFile(null);
        setVideoPreview(null);
        setCustomThumbnail(null);
        setGeneratedThumbnails([]);
        setSelectedThumbnailIndex(0);
        setUploadProgress(0);
        setProcessingProgress(0);
        setVideoData({
            title: "",
            description: "",
            tags: "",
            category: "Education",
            visibility: "public",
            allowComments: true,
            allowRatings: true,
        });
        setErrors({});

        // Clean up object URLs
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        if (customThumbnail) URL.revokeObjectURL(customThumbnail);
    };

    return (
        <div className="container mx-auto py-6 px-4 lg:px-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Upload Video</h1>
                        <p className="text-muted-foreground">
                            Share your content with the world
                        </p>
                    </div>
                </div>

                {currentStep !== UPLOAD_STEPS.SELECT &&
                    currentStep !== UPLOAD_STEPS.COMPLETE && (
                        <Button variant="outline" onClick={resetUpload}>
                            <X className="mr-2 h-4 w-4" /> Cancel Upload
                        </Button>
                    )}
            </div>

            {/* Step 1: File Selection */}
            {currentStep === UPLOAD_STEPS.SELECT && (
                <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                    <CardContent className="p-8">
                        <div
                            className="text-center space-y-4"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                    Select video to upload
                                </h3>
                                <p className="text-muted-foreground">
                                    Drag and drop a video file here, or click to
                                    browse
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    size="lg"
                                >
                                    <Video className="mr-2 h-5 w-5" />
                                    Choose File
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    Supported formats: MP4, MOV, AVI, WMV (Max:
                                    100MB)
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Uploading */}
            {currentStep === UPLOAD_STEPS.UPLOADING && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Uploading your video
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                                <Video className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">
                                    {selectedFile?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {(
                                        selectedFile?.size /
                                        (1024 * 1024)
                                    ).toFixed(1)}{" "}
                                    MB
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Upload Progress</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Processing */}
            {currentStep === UPLOAD_STEPS.PROCESSING && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing your video
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            We're processing your video and generating
                            thumbnails. This may take a few moments.
                        </p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Processing Progress</span>
                                <span>{Math.round(processingProgress)}%</span>
                            </div>
                            <Progress
                                value={processingProgress}
                                className="h-2"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Video Details */}
            {currentStep === UPLOAD_STEPS.DETAILS && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Video Preview */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoPreviewRef}
                                        src={videoPreview}
                                        className="w-full h-full"
                                        controls
                                        poster={
                                            selectedThumbnailIndex === -1
                                                ? customThumbnail
                                                : generatedThumbnails[
                                                      selectedThumbnailIndex
                                                  ]
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thumbnail Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thumbnail</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {generatedThumbnails.map(
                                        (thumbnail, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedThumbnailIndex(
                                                        index
                                                    )
                                                }
                                                className={cn(
                                                    "aspect-video rounded-lg overflow-hidden border-2 transition-colors",
                                                    selectedThumbnailIndex ===
                                                        index
                                                        ? "border-primary"
                                                        : "border-transparent hover:border-muted-foreground"
                                                )}
                                            >
                                                <img
                                                    src={
                                                        thumbnail ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`Thumbnail ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            thumbnailInputRef.current?.click()
                                        }
                                        className="w-full"
                                    >
                                        <Image className="mr-2 h-4 w-4" />
                                        Upload Custom Thumbnail
                                    </Button>
                                    {customThumbnail && (
                                        <div className="relative">
                                            <img
                                                src={
                                                    customThumbnail ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Custom thumbnail"
                                                className="w-full aspect-video object-cover rounded-lg"
                                            />
                                            <Badge className="absolute top-2 left-2">
                                                Custom
                                            </Badge>
                                        </div>
                                    )}
                                    <input
                                        ref={thumbnailInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="hidden"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Video Details Form */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={videoData.title}
                                        onChange={(e) =>
                                            setVideoData((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter video title"
                                        className={
                                            errors.title
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {videoData.title.length}/100 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={videoData.description}
                                        onChange={(e) =>
                                            setVideoData((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Tell viewers about your video"
                                        rows={4}
                                        className={
                                            errors.description
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {videoData.description.length}/5000
                                        characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        value={videoData.tags}
                                        onChange={(e) =>
                                            setVideoData((prev) => ({
                                                ...prev,
                                                tags: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter tags separated by commas"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Add tags to help people find your video
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={videoData.category}
                                        onChange={(e) =>
                                            setVideoData((prev) => ({
                                                ...prev,
                                                category: e.target.value,
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                    >
                                        <option value="Education">
                                            Education
                                        </option>
                                        <option value="Entertainment">
                                            Entertainment
                                        </option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Music">Music</option>
                                        <option value="News">News</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Technology">
                                            Technology
                                        </option>
                                        <option value="Travel">Travel</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visibility Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Visibility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {VISIBILITY_OPTIONS.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-start gap-3 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value={option.value}
                                            checked={
                                                videoData.visibility ===
                                                option.value
                                            }
                                            onChange={(e) =>
                                                setVideoData((prev) => ({
                                                    ...prev,
                                                    visibility: e.target.value,
                                                }))
                                            }
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="font-medium">
                                                {option.label}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {option.description}
                                            </div>
                                        </div>
                                    </label>
                                ))}

                                <Separator />

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={videoData.allowComments}
                                            onChange={(e) =>
                                                setVideoData((prev) => ({
                                                    ...prev,
                                                    allowComments:
                                                        e.target.checked,
                                                }))
                                            }
                                        />
                                        <span className="text-sm">
                                            Allow comments
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={videoData.allowRatings}
                                            onChange={(e) =>
                                                setVideoData((prev) => ({
                                                    ...prev,
                                                    allowRatings:
                                                        e.target.checked,
                                                }))
                                            }
                                        />
                                        <span className="text-sm">
                                            Allow ratings
                                        </span>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button
                                onClick={handlePublish}
                                className="flex-1"
                                size="lg"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Publish Video
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 5: Publishing */}
            {currentStep === UPLOAD_STEPS.PUBLISHING && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Publishing your video
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                                <Video className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{videoData.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {videoData.visibility
                                        .charAt(0)
                                        .toUpperCase() +
                                        videoData.visibility.slice(1)}{" "}
                                    • {videoData.category}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Publishing stages */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "w-2 h-2 rounded-full",
                                            uploadProgress >= 25
                                                ? "bg-green-500"
                                                : "bg-muted"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            "text-sm",
                                            uploadProgress >= 25
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        Finalizing video file
                                    </span>
                                    {uploadProgress >= 25 &&
                                        uploadProgress < 50 && (
                                            <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                                        )}
                                    {uploadProgress >= 50 && (
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "w-2 h-2 rounded-full",
                                            uploadProgress >= 50
                                                ? "bg-green-500"
                                                : "bg-muted"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            "text-sm",
                                            uploadProgress >= 50
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        Processing thumbnail
                                    </span>
                                    {uploadProgress >= 50 &&
                                        uploadProgress < 75 && (
                                            <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                                        )}
                                    {uploadProgress >= 75 && (
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "w-2 h-2 rounded-full",
                                            uploadProgress >= 75
                                                ? "bg-green-500"
                                                : "bg-muted"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            "text-sm",
                                            uploadProgress >= 75
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        Creating video entry
                                    </span>
                                    {uploadProgress >= 75 &&
                                        uploadProgress < 100 && (
                                            <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                                        )}
                                    {uploadProgress >= 100 && (
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "w-2 h-2 rounded-full",
                                            uploadProgress >= 100
                                                ? "bg-green-500"
                                                : "bg-muted"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            "text-sm",
                                            uploadProgress >= 100
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        Making video live
                                    </span>
                                    {uploadProgress >= 100 && (
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                    )}
                                </div>
                            </div>

                            {/* Overall progress bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Publishing Progress</span>
                                    <span>{Math.round(uploadProgress)}%</span>
                                </div>
                                <Progress
                                    value={uploadProgress}
                                    className="h-2"
                                />
                            </div>

                            {/* Status message */}
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    {uploadProgress < 25 &&
                                        "Preparing your video for publication..."}
                                    {uploadProgress >= 25 &&
                                        uploadProgress < 50 &&
                                        "Processing video metadata..."}
                                    {uploadProgress >= 50 &&
                                        uploadProgress < 75 &&
                                        "Setting up thumbnail and preview..."}
                                    {uploadProgress >= 75 &&
                                        uploadProgress < 100 &&
                                        "Creating database entry..."}
                                    {uploadProgress >= 100 &&
                                        "Video is now live and available to viewers!"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 5: Complete */}
            {currentStep === UPLOAD_STEPS.COMPLETE && (
                <Card>
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                Video uploaded successfully!
                            </h3>
                            <p className="text-muted-foreground">
                                Your video "{videoData.title}" has been
                                published and is now live.
                            </p>
                        </div>

                        <div className="flex gap-2 justify-center">
                            <Button onClick={() => navigate("/")}>
                                Go to Home
                            </Button>
                            <Button variant="outline" onClick={resetUpload}>
                                Upload Another
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
