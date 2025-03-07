import React from "react";
import NewComment from "./NewComment";
import NewCommentSM from "./NewCommentSM";
import FetchComments from "../services/api/fetchComments";
import Comment from "./Comment";
import { useDispatch, useSelector } from "react-redux";

const CommentSection = () => {
  const { commentsList } = useSelector((store) => store.comments);
  return (
    <div className="flex flex-col sm:mx-2">
      <span className="font-bold mb-4 px-2 sm:px-0">2 Comments</span>

      {/* // Todo: Only single comment input */}
      <span className="hidden sm:block">
        <NewComment />
      </span>
      <span className="sm:hidden block mb-6">
        <NewCommentSM />
      </span>
      
      {/* // Todo: Do something with fetching comments */}
      <FetchComments />
      <div className="flex flex-col gap-4">
        {commentsList.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
