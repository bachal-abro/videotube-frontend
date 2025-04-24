import React from "react";
import { useSelector } from "react-redux";

const VideoDescription = ({video}) => {
  // const { video } = useSelector((store) => store.videoView);
  return (
    <div className="flex flex-col px-2 py-3 my-2 rounded-xl text-sm -mb-6">
      <p className="sm:w-3/5">
        {video.description}
      </p>
      <span className="text-blue-400">Show more</span>
    </div>
  );
};

export default VideoDescription;
