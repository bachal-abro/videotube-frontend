import React from "react";
import VideoPost from "./VideoPost";

const SubscriptionFeed = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 sm:m-4 w-full text-gray-300">
        <VideoPost/>
      </div>
    </>
  );
};

export default SubscriptionFeed;
