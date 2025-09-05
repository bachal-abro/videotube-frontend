import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function LoadingSpinner({ className, size = "default", ...props }) {
    return (
        <div
            className={cn(
                "flex items-center justify-center",
                {
                    "h-4 w-4": size === "sm",
                    "h-6 w-6": size === "default",
                    "h-8 w-8": size === "lg",
                    "h-12 w-12": size === "xl",
                },
                className
            )}
            {...props}
        >
            <Loader2
                className={cn("animate-spin", {
                    "h-4 w-4": size === "sm",
                    "h-6 w-6": size === "default",
                    "h-8 w-8": size === "lg",
                    "h-12 w-12": size === "xl",
                })}
            />
        </div>
    );
}

export function PageLoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
                <LoadingSpinner size="xl" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

export function FullPageLoader() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <LoadingSpinner size="xl" />
                <p className="text-lg font-medium">Loading VideoTube...</p>
                <p className="text-sm text-muted-foreground">
                    Please wait while we prepare your content
                </p>
            </div>
        </div>
    );
}

export function VideoCardSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="aspect-video bg-muted rounded-lg"></div>
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
        </div>
    );
}

export function CommentSkeleton() {
    return (
        <div className="flex gap-3 animate-pulse">
            <div className="h-8 w-8 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Banner skeleton */}
            <div className="h-48 bg-muted rounded-xl"></div>

            {/* Profile info skeleton */}
            <div className="flex items-center gap-4">
                <div className="h-24 w-24 bg-muted rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-6 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
        </div>
    );
}
