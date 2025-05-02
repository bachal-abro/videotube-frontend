import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useToggleVideoLikeMutation } from "../../features/likes/likesApiSlice";
import { useDispatch } from "react-redux";
import { setCurrentVideo } from "../../features/videos/videoSlice";
const LikeButton = ({ video }) => {
    const dispatch = useDispatch();
    const [toggleVideoLike] = useToggleVideoLikeMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedLike = await toggleVideoLike(video?._id).unwrap();

            dispatch(
                setCurrentVideo({
                    ...video,
                    isLiked: updatedLike?.data?.isLiked,
                    likes: updatedLike?.data?.likes,
                })
            );
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    return (
        <button
            type="submit"
            className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-white border-gray-200 dark:hover:text-blue-400"
            onClick={handleSubmit}
        >
            {video?.isLiked ? (
                <AiFillLike className="text-xl" />
            ) : (
                <AiOutlineLike className="text-xl" />
            )}

            {video?.likes}
        </button>
    );
};

export default LikeButton;
