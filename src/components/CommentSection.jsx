import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useCreateVideoCommentMutation,
    useGetVideoCommentsQuery,
} from "../features/comments/videoCommentsApiSlice";
import { useParams } from "react-router-dom";
import { setCurrentVideoComments } from "../features/comments/commentSlice";
import { Textarea } from "../components/ui/textarea";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { timeAgo } from "../utils/timeAgo";
import { useToast } from "../hooks/use-toast";
// import { CommentItem } from "./comment-item";
import CommentItem from "./CommentItem";
const CommentSection = () => {
    const { toast } = useToast();
    const { videoId } = useParams();
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState(""); // State for comment input
    const commentsList = useSelector(
        (store) => store.comments.currentVideoComments
    );
    const { data, isSuccess, isLoading, refetch } =
        useGetVideoCommentsQuery(videoId);
    const [
        createVideoComment,
        { isSuccess: newCommentSuccess, isLoading: newCommentLoading },
    ] = useCreateVideoCommentMutation();

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setCurrentVideoComments(data.data));
            console.log(data);
        }
    }, [isSuccess, data, dispatch]);

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            try {
                const newComment = await createVideoComment({
                    videoId,
                    content: commentText,
                }).unwrap();

                // Option 1: Refetch comments (Recommended for consistency)
                refetch(); // <-- you can get this from the query hook below
                console.log(newComment);
                setCommentText("");
                toast({
                    title: "Comment posted!",
                    description: "Your comment has been added.",
                });
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to post comment.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h3 className="font-medium">Comments</h3>
                <span className="text-sm text-muted-foreground">
                    {data?.pagination.totalCommentsCount}
                </span>
            </div>

            {/* Comment input */}
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src="https://placehold.co/32x32"
                        alt="Your avatar"
                    />
                    <AvatarFallback>YA</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <Textarea
                        placeholder="Add a comment..."
                        className="resize-none"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCommentText("")}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={(e) => handlePostComment(e)}
                            disabled={!commentText.trim()}
                        >
                            <Send className="mr-2 h-4 w-4" /> Comment
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comments list */}
            <div className="space-y-4 pt-4">
                {commentsList.map((comment) =>
                    comment.parentComment ? (
                        ""
                    ) : (
                        <CommentItem key={comment._id} comment={comment} />
                    )
                )}
            </div>
        </div>
    );
};

export default CommentSection;
