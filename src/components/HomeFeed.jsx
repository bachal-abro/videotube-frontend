import React from "react";
import { useSelector } from "react-redux";
import VideoPost from "./VideoPost";

const HomeFeed = () => {
  const { videoList } = useSelector((store) => store.homeFeed);
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full text-gray-300">
        {videoList.map((video) => (
          <VideoPost key={video._id} video={video} />
        ))}
      </div>
    </>
  );
};

export default HomeFeed;
