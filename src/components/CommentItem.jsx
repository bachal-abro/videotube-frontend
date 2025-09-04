import { useState, useMemo } from "react";
import { ThumbsUp, ThumbsDown, Send, ReplyIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "../lib/utils"; // Ensure cn utility is available
import { timeAgo } from "../utils/timeFormats";
import { useCreateVideoCommentMutation } from "../features/comments/videoCommentsApiSlice";
import { setCurrentVideoComments } from "../features/comments/commentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { useToggleCommentLikeMutation } from "../features/likes/likesApiSlice";
import { useToggleCommentDislikeMutation } from "../features/dislikes/dislikesApiSlice";

function CommentItem({ comment, hasParent, refetch }) {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { videoId } = useParams();
    const [createVideoComment] = useCreateVideoCommentMutation();

    const [toggleCommentLike] = useToggleCommentLikeMutation();
    const [toggleCommentDislike] = useToggleCommentDislikeMutation();
    const [showReplies, setShowReplies] = useState(false);
    const commentsList = useSelector(
        (store) => store.comments.currentVideoComments
    );
    const { user } = useSelector((store) => store.auth);
    const HandleShowReplies = () => {
        setShowReplies((prev) => !prev);
    };
    // Inside component
    const replies = useMemo(() => {
        return commentsList
            .filter((c) => c.parentComment === comment._id)
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
            await refetch();
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

    const handleToggleLike = async (e) => {
        e.preventDefault();
        try {
            const updatedLike = await toggleCommentLike(comment?._id).unwrap();
            const newObj = {
                _id: comment?._id,
                content: comment?.content,
                video: comment?.video,
                parentComment: comment?.parentComment,
                owner: {
                    _id: user?._id,
                    username: user?.username,
                    displayName: user?.displayName,
                    avatar: user?.avatar,
                },
                createdAt: comment?.createdAt,
                updatedAt: comment?.updatedAt,
                __v: 0,
                likes: updatedLike?.data?.likes,
                isLiked: updatedLike?.data?.isLiked,
            };
            const index = commentsList.findIndex((c) => c._id === newObj._id);
            const updatedComments =
                index !== -1
                    ? commentsList.map((c) =>
                          c._id === newObj._id ? newObj : c
                      )
                    : [...commentsList, newObj];
            dispatch(setCurrentVideoComments(updatedComments));
            if (comment?.isLiked) {
                toast({
                    title: "Unliked comment",
                    description: comment?.content?.slice(0, 12),
                });
            } else {
                toast({
                    title: "Liked comment",
                    description: comment?.content?.slice(0, 12),
                });
            }
        } catch (error) {
            toast({
                title: "Operation failed",
                description: error,
            });
        }
    };

    const handleToggleDislike = async (e) => {
        e.preventDefault();
        try {
            const updatedDislike = await toggleCommentDislike(
                comment?._id
            ).unwrap();

            const newObj = {
                _id: comment?._id,
                content: comment?.content,
                video: comment?.video,
                parentComment: comment?.parentComment,
                owner: {
                    _id: user?._id,
                    username: user?.username,
                    displayName: user?.displayName,
                    avatar: user?.avatar,
                },
                createdAt: comment?.createdAt,
                updatedAt: comment?.updatedAt,
                __v: 0,
                likes: comment?.likes,
                isLiked: comment?.isLiked,
                dislikes: updatedDislike?.data?.dislikes,
                isDisliked: updatedDislike?.data?.isDisliked,
            };

            const index = commentsList.findIndex((c) => c._id === newObj._id);
            const updatedComments =
                index !== -1
                    ? commentsList.map((c) =>
                          c._id === newObj._id ? newObj : c
                      )
                    : [...commentsList, newObj];
            dispatch(setCurrentVideoComments(updatedComments));
            if (comment?.isDisliked) {
                toast({
                    title: "Comment dislike removed",
                    description: comment?.content?.slice(0, 12),
                });
            } else {
                toast({
                    title: "Disliked comment",
                    description: comment?.content?.slice(0, 12),
                });
            }
        } catch (error) {
            toast({
                title: "Operation failed",
                description: error,
            });
        }
    };

    // Determine avatar and content indentation based on nestingLevel
    const paddingLeftClass = hasParent ? "pl-8 sm:pl-12" : "";

    return (
        <div className={cn("flex gap-3", paddingLeftClass)}>
            {/* Avatar */}
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                    src={comment?.owner?.avatar}
                    alt={comment?.owner?.displayName}
                />
                <AvatarFallback>
                    {comment?.owner?.displayName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
                {/* Comment Header (User Name & Timestamp) */}
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                        {comment?.owner?.displayName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {timeAgo(comment?.createdAt)}
                    </span>
                </div>

                {/* Comment Text */}
                <p className="text-sm">{comment?.content}</p>

                {/* Action Buttons (Like, Dislike, Reply) */}
                <div className="flex items-center gap-3 text-xs">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={(e) => handleToggleLike(e)}
                    >
                        <ThumbsUp className="mr-1 h-3 w-3" /> {comment?.likes}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={(e) => handleToggleDislike(e)}
                    >
                        <ThumbsDown className="mr-1 h-3 w-3" />{" "}
                        {comment?.dislikes}
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
                                src={comment?.owner?.avatar}
                                alt={comment?.owner?.displayName}
                            />
                                                                    <AvatarFallback>
                                            {user?.displayName?.charAt(0) ||
                                                user?.username?.charAt(0)}
                                        </AvatarFallback>
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
                <button
                    type="button"
                    onClick={HandleShowReplies}
                    className="ml-20 flex pb-2 gap-1 justify-center items-center rounded-full text-black font-light dark:text-blue-500 border-gray-200 dark:hover:text-blue-400"
                >
                    {replies.length
                        ? `${replies.length} ${
                              replies.length > 1 ? "Replies" : "Reply"
                          }`
                        : ""}
                </button>
                <div
                    className={`${
                        showReplies ? "" : "hidden"
                    } flex flex-col gap-2`}
                >
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            hasParent={reply.parentComment}
                            comment={reply}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommentItem;
