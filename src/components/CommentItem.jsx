import { useState, useMemo } from "react";
import { ThumbsUp, ThumbsDown, Send, ReplyIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "../lib/utils"; // Ensure cn utility is available
import { timeAgo } from "../utils/timeAgo";
import { useCreateVideoCommentMutation } from "../features/comments/videoCommentsApiSlice";
import { setCurrentVideoComments } from "../features/comments/commentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

function CommentItem({ comment, hasParent }) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { videoId } = useParams();
    const [
        createVideoComment,
        { isSuccess: newCommentSuccess, isLoading: newCommentLoading },
    ] = useCreateVideoCommentMutation();

    const commentsList = useSelector(
        (store) => store.comments.currentVideoComments
    );

    // Inside component
    const replies = useMemo(() => {
        return commentsList.filter((c) => c.parentComment === comment._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
    }, [commentsList, comment._id]);
    
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const handlePostReply = async (e) => {
        e.preventDefault();
        try {
            await createVideoComment({
                videoId,
                content: replyText,
                parentCommentId: comment._id,
            }).unwrap();

            setReplyText("");
            setShowReplyInput(false);
            toast({
                title: "Reply posted!",
                description: "Your reply has been added.",
            });
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    // Determine avatar and content indentation based on nestingLevel
    const paddingLeftClass = hasParent ? "pl-8 sm:pl-12" : "";

    return (
        <div className={cn("flex gap-3", paddingLeftClass)}>
            {/* Avatar */}
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                    src={comment?.owner?.avatar || "/placeholder.svg"}
                    alt={comment?.owner?.fullName}
                />
                <AvatarFallback>
                    {comment?.owner?.fullName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
                {/* Comment Header (User Name & Timestamp) */}
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                        {comment?.owner?.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {timeAgo(comment?.createdAt)}
                    </span>
                </div>

                {/* Comment Text */}
                <p className="text-sm">{comment?.content}</p>

                {/* Action Buttons (Like, Dislike, Reply) */}
                <div className="flex items-center gap-3 text-xs">
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsUp className="mr-1 h-3 w-3" /> {comment?.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ThumbsDown className="mr-1 h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => setShowReplyInput(!showReplyInput)}
                    >
                        <ReplyIcon className="mr-1 h-3 w-3" /> Reply
                    </Button>
                </div>

                {/* Reply Input */}
                {showReplyInput && (
                    <div className="flex gap-3 mt-4">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="Your avatar"
                            />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="Add a public reply..."
                                className="resize-none"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowReplyInput(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={(e) => handlePostReply(e)}
                                    disabled={!replyText.trim()}
                                >
                                    <Send className="mr-2 h-4 w-4" /> Reply
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nested Replies */}
                {replies.map((reply) => (
                    <CommentItem
                        key={reply._id}
                        hasParent={reply.parentComment}
                        comment={reply}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentItem;
