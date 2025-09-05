import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useCreateVideoCommentMutation,
    useGetVideoCommentsQuery,
} from "../features/comments/videoCommentsApiSlice";
import { useParams } from "react-router-dom";
import { setCurrentVideoComments } from "../features/comments/commentSlice";
import { Textarea } from "@/components/ui/Textarea";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { timeAgo } from "../utils/timeFormats";
import { useToast } from "../hooks/use-toast";
import CommentItem from "./CommentItem";

const CommentSection = () => {
    const { toast } = useToast();
    const { videoId } = useParams();
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState(""); // State for comment input
    const commentsList = useSelector(
        (store) => store.comments.currentVideoComments
    );
    const [page, setPage] = useState(1);
    const { user } = useSelector((store) => store.auth);
    const { data, isSuccess, isFetching, isLoading, isError, refetch } =
        useGetVideoCommentsQuery({ videoId, page, limit: 10, sort: "desc" });

    const [createVideoComment] = useCreateVideoCommentMutation();

    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
        if (!isSuccess || !data?.data) return;

        const total = data?.pagination?.totalCommentsCount ?? 0;
        const limit = Number(10);
        setHasNextPage(page * limit < total);

        if (page === 1) {
            dispatch(setCurrentVideoComments(data.data));
        } else {
            // Append only unique items by _id
            const existingIds = new Set(commentsList.map((c) => c._id));
            const toAppend = data.data.filter((c) => !existingIds.has(c._id));
            if (toAppend.length) {
                dispatch(
                    setCurrentVideoComments([...commentsList, ...toAppend])
                );
            }
        }
    }, [isSuccess, data, page, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 200 &&
                !isFetching &&
                hasNextPage
            ) {
                setPage((p) => p + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching, hasNextPage]);

    const uniqueTopLevel = React.useMemo(() => {
        const seen = new Set();
        return commentsList.filter((c) => {
            if (c.parentComment) return false; // only top-level
            if (seen.has(c._id)) return false;
            seen.add(c._id);
            return true;
        });
    }, [commentsList]);

    const sortedComments = uniqueTopLevel.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
    });

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await createVideoComment({
                videoId,
                content: commentText,
            }).unwrap();
            setCommentText("");
            setPage(1); // ← reset page first
            await refetch();
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
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                                                            <AvatarFallback>
                                            {user?.displayName?.charAt(0) ||
                                                user?.username?.charAt(0)}
                                        </AvatarFallback>
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

            <div className="space-y-4 pt-4">
                {sortedComments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        refetch={refetch}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
