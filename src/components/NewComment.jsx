import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCreateVideoCommentMutation } from "../features/comments/videoCommentsApiSlice";
import { setCurrentVideoComments } from "../features/comments/commentSlice";

const NewComment = () => {
    const { videoId } = useParams();
    const [content, setContent] = useState("");
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const commentsList = useSelector(
        (store) => store.comments.currentVideoComments
    );

    const [createVideoComment, { isLoading, isSuccess, isError, error }] =
        useCreateVideoCommentMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newComment = await createVideoComment({
                videoId,
                content,
            }).unwrap();
            console.log(newComment);
            // Todo: Adjust in backend to make it work:
            const newObj = {
                _id: newComment?.data._id,
                content: newComment?.data?.content,
                video: newComment?.data?.video,
                parentComment: null,
                owner: {
                    _id: user?._id,
                    username: user?.username,
                    displayName: user?.displayName,
                    avatar: user?.avatar,
                },
                createdAt: newComment?.data?.createdAt,
                updatedAt: newComment?.data?.updatedAt,
                __v: 0,
                likes: 0,
                isLiked: false,
            };

            dispatch(setCurrentVideoComments([...commentsList, newObj]));
            setContent(""); // clear input
        } catch (isError) {
            console.error("Failed to create comment:", error);
        }
    };

    return (
        <form
            method="POST"
            className="sm:flex flex-col items-end hidden"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-4 w-full mb-2">
                <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt="User Avatar" />
                        <AvatarFallback>
                            {user?.displayName?.charAt(0) ||
                                user?.username?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <label
                        htmlFor="content"
                        className="flex flex-col text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <span>Comment as</span>
                        <p className="text-blue-400">{user?.username}</p>
                    </label>
                </div>
                <textarea
                    id="content"
                    name="content"
                    value={content}
                    rows="4"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Say something about this..."
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                ></textarea>
            </div>
            <div className="flex gap-2">
                <button
                    type="reset"
                    className="px-4 py-2 rounded-3xl bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-3xl border-blue-500 bg-blue-700 text-black hover:bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500/20 dark:text-white"
                    disabled={isLoading}
                >
                    {isLoading ? "Posting..." : "Comment"}
                </button>
            </div>
        </form>
    );
};

export default NewComment;
