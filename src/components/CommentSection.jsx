import React, { useEffect } from "react";
import NewComment from "./NewComment";
import NewCommentSM from "./NewCommentSM";
import Comment from "./Comment";
import { useDispatch, useSelector } from "react-redux";
import { useGetVideoCommentsQuery } from "../features/comments/videoCommentsApiSlice";
import { useParams } from "react-router-dom";
import { setCurrentVideoComments } from "../features/comments/commentSlice";

const CommentSection = () => {
    
    const { videoId } = useParams();
    const dispatch = useDispatch();
    const commentsList = useSelector(
        (store) => store.comments.currentVideoComments
    );
    const { data, isSuccess, isLoading } = useGetVideoCommentsQuery(videoId);

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setCurrentVideoComments(data.data));
        }
    }, [isSuccess, data, dispatch]);

    return (
        <div className="flex flex-col sm:mx-2">
            <span className="font-bold mb-4 px-2 sm:px-0">
                {data?.pagination.totalCommentsCount} Comments
            </span>

            <span className="hidden sm:block">
                <NewComment />
            </span>
            <span className="sm:hidden block mb-6">
                <NewCommentSM />
            </span>

            <div className="flex flex-col gap-4">
                {commentsList.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
