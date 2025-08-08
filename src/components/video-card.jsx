"use client";

import { useState, useRef, useEffect } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { timeAgo } from "../utils/timeAgo";

export function VideoCard({
    id,
    thumbnail,
    title,
    channelName,
    channelAvatar,
    views,
    timestamp,
    duration,
    className,
    videoPreview,
}) {
    const [isHovering, setIsHovering] = useState(false);
    const videoRef = useRef(null);
    const hoverTimerRef = useRef(null);
    const navigate = useNavigate();

    // username mouse enter with delay
    const handleMouseEnter = () => {
        hoverTimerRef.current = setTimeout(() => {
            setIsHovering(true);
        }, 800); // 800ms delay before showing preview
    };

    // username mouse leave
    const handleMouseLeave = () => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
        }
        setIsHovering(false);
    };

    // Navigate to video detail page
    const handleClick = () => {
        navigate(`/video/${id}`);
    };

    // Control video playback based on hover state
    useEffect(() => {
        if (videoRef.current) {
            if (isHovering) {
                videoRef.current.currentTime = 0;
                videoRef.current
                    .play()
                    .catch((err) => console.log("Video play prevented:", err));
            } else {
                videoRef.current.pause();
            }
        }

        return () => {
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
        };
    }, [isHovering]);

    return (
        <div
            className={cn("group cursor-pointer", className)}
            onClick={handleClick}
        >
            <div
                className="relative rounded-xl overflow-hidden mb-3 video-hover-effect transition-all duration-300 dark:bg-slate-800/50 bg-slate-100"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Thumbnail with gradient overlay */}
                <div className="relative">
                    {/* Thumbnail image (shown when not hovering) */}
                    <img
                        src={thumbnail || "https://placehold.co/320x180"}
                        alt={title}
                        className={cn(
                            "w-full aspect-video object-cover transition-all duration-300 group-hover:brightness-110",
                            isHovering ? "opacity-0 scale-105" : "opacity-100"
                        )}
                    />

                    {/* Video preview (shown when hovering) */}
                    {videoPreview && (
                        <video
                            ref={videoRef}
                            src={videoPreview}
                            className={cn(
                                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                                isHovering ? "opacity-100" : "opacity-0"
                            )}
                            muted
                            playsInline
                            loop
                        />
                    )}

                    {/* Preview indicator (only shown before hovering) */}
                    {videoPreview && !isHovering && (
                        <div className="absolute bottom-10 right-2 bg-black/70 text-white/90 text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Hover to preview
                        </div>
                    )}

                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Bottom info bar with gradient background */}
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
                                <Eye className="w-3.5 h-3.5" />
                                <span>{views}</span>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm text-white/90 text-xs font-medium px-2 py-0.5 rounded-full">
                                {duration}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                {/* Channel avatar with subtle hover effect */}
                <div className="relative group-hover:scale-105 transition-transform duration-300">
                    <Avatar className="h-9 w-9 rounded-full flex-shrink-0 border-2 border-transparent group-hover:border-primary/20 transition-all">
                        <AvatarImage
                            src={channelAvatar || "https://placehold.co/40x40"}
                            alt={channelName}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {channelName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Video info with refined typography */}
                <div className="space-y-1.5">
                    <h3 className="font-medium leading-tight line-clamp-2 text-sm group-hover:text-primary transition-colors duration-200">
                        {title}
                    </h3>
                    <div className="text-xs space-y-0.5">
                        <p className="font-medium text-foreground/80 hover:text-primary transition-colors duration-200">
                            {channelName}
                        </p>
                        <p className="text-muted-foreground">
                            {timestamp}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
