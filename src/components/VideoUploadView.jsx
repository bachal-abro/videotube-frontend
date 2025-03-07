import React from "react";

const VideoUploadView = () => {
  return (
    <div>
      <div className="min-h-56 max-h-56 rounded-lg ">
        <img
          className="w-full sm:w-auto min-h-56 max-h-56 rounded-lg"
          src="/thumbnail.png"
          alt=""
        />
      </div>

      <div className="flex gap-3 mt-2">
        <div>
          <h2 className="text-white sm:text-sm font-medium">
            Be Bored To be Great & Successful | SeeKen
          </h2>
          <p className="text-sm">My new playlist 2024</p>
          <p className="text-sm">https://youtu.be/LLXOW-u74_o</p>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadView;
