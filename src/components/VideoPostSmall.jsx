import React from "react";

const VideoPostSmall = () => {
  return (
    <div>
      <div className="min-h-56 max-h-56 sm:min-h-36 sm:max-h-36 rounded-lg ">
        <img
          className="w-full sm:w-auto min-h-56 max-h-56 sm:min-h-36 sm:max-h-36 rounded-lg"
          src="/thumbnail.png"
          alt=""
        />
      </div>

      <div className="flex gap-3 mt-2">
        <div>
          <h2 className="text-white sm:text-sm font-medium">
            Lorem ipsum dolor sit amet.
          </h2>
          <p className="text-sm">Demo User</p>
          <p className="text-sm"> 88M views . 5 hours ago</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPostSmall;
