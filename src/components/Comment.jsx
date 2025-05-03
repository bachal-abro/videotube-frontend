import React, { useState } from "react";
import {
    AiFillDislike,
    AiFillLike,
    AiOutlineDislike,
    AiOutlineLike,
} from "react-icons/ai";
import { MdOutlineQuickreply } from "react-icons/md";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import { useDispatch, useSelector } from "react-redux";
import { useToggleCommentLikeMutation } from "../features/likes/likesApiSlice";
import { setCurrentVideoComments } from "../features/comments/commentSlice";
import NewCommentSM from "./NewCommentSM";

const Comment = ({ comment, hasParent }) => {
    const commentsList = useSelector(
        (store) => store.comments.currentVideoComments
    );
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [toggleCommentLike, { isSuccess }] = useToggleCommentLikeMutation();

    const replies = commentsList.filter((c) => {
        return c.parentComment == comment._id;
    });

    const handleSubmit = async (e) => {
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
                    fullName: user?.fullName,
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
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const onReply = () => {
        setShowReplyInput(true);
    };

    const HandleShowReplies = () => {
        setShowReplies((prev) => !prev);
    };

    return (
        <div className={hasParent ? " pl-10" : "pb-2"}>
            <div className="flex gap-3 items-start px-1 pb-2">
                <img
                    className="h-10 w-10 rounded-full sm:block"
                    src={comment?.owner?.avatar}
                    alt=""
                />
                <div>
                    <div className="flex gap-2">
                        <Link
                            to={`/@${comment?.owner?.username}`}
                            className="text-sm font-medium text-blue-400"
                        >
                            {comment?.owner?.username}
                        </Link>
                        <p className="text-sm text-gray-400">
                            {timeAgo(comment?.createdAt)}
                        </p>
                    </div>
                    <h2 className="text-sm sm:text-md">{comment?.content}</h2>
                    <div className="flex gap-4 text-sm sm:text-md">
                        {/* // Todo: Make button components */}
                        <button
                            type="button"
                            onClick={onReply}
                            className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-gray-400 border-gray-200 dark:hover:text-blue-400"
                        >
                            <MdOutlineQuickreply />
                            Reply
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                            className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-gray-400 border-gray-200 dark:hover:text-blue-400"
                        >
                            {comment?.isLiked ? (
                                <AiFillLike />
                            ) : (
                                <AiOutlineLike />
                            )}
                            {comment?.likes}
                        </button>
                        {/* <button
                        type="button"
                        className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-gray-400 border-gray-200 dark:hover:text-blue-400"
                    >
                        <AiOutlineDislike />
                        <AiFillDislike className="hidden" />
                        50
                    </button> */}
                    </div>
                </div>
            </div>
            <NewCommentSM
                id={comment?._id}
                className={showReplyInput ? "" : `hidden`}
            />
            <button
                type="button"
                onClick={HandleShowReplies}
                className="ml-20 flex pb-2 gap-1 justify-center items-center rounded-full text-black font-medium dark:text-blue-500 border-gray-200 dark:hover:text-blue-400"
            >
                {replies.length
                    ? `${replies.length} ${
                          replies.length > 1 ? "Replies" : "Reply"
                      }`
                    : ""}
            </button>
            <div
                className={`${showReplies ? "" : "hidden"} flex flex-col gap-2`}
            >
                {replies.map((comment) => (
                    <Comment
                        key={comment._id}
                        hasParent={comment.parentComment}
                        comment={comment}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comment;
