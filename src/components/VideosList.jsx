import React from "react";
import VideoListPost from "./VideoListPost";

const VideosList = () => {
  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-2 sm:m-4">
        <VideoListPost/>
        <VideoListPost/>
      </div>
    </>
  );
};

export default VideosList;
