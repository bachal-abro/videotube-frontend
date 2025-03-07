import React from "react";
import axios from "axios";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useParams } from "react-router-dom";

const LikeButton = ({ video }) => {
  const params = useParams();

  const Id = params.videoid;
  const toggleLike = (videoId) => {
    axios
      .post(`http://localhost:8000/api/v1/toggle/v/${videoId}`)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <button
      type="submit"
      className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-white border-gray-200 dark:hover:text-blue-400"
      onClick={() => toggleLike(Id)}
    >
      {video.isLiked ? (
        <AiFillLike className="text-xl" />
      ) : (
        <AiOutlineLike className="text-xl" />
      )}

      {video?.likes}
    </button>
  );
};

export default LikeButton;
