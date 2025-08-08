import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCreateVideoCommentMutation } from "../features/comments/videoCommentsApiSlice";
import { setCurrentVideoComments } from "../features/comments/commentSlice";

const NewCommentSM = ({id, className}) => {
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
                parentCommentId: id
            }).unwrap();
            console.log(newComment);
            // Todo: Adjust in backend to make it work:
            const newObj = {
                _id: newComment?.data._id,
                content: newComment?.data?.content,
                video: newComment?.data?.video,
                parentComment: id,
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
        <form method="POST" id={id}  onSubmit={(e)=> handleSubmit(e)} className={`${className}`}>
            <label htmlFor="userComment" className="sr-only"></label>
            <div className="flex items-center rounded-lg bg-gray-50 dark:bg-gray-800 mx-1">
                <textarea
                    id="user-comment"
                    rows="1"
                    name="userComment"
                    value={content}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                    placeholder="Say something about this..."
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:text-gray-200 dark:bg-gray-800"
                >
                    <svg
                        className="w-5 h-5 rotate-90 rtl:-rotate-90"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                    >
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Comment</span>
                </button>
            </div>
        </form>
    );
};

export default NewCommentSM;
