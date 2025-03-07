import React from "react";

const VideoListPost = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-3 text-gray-200">
      <div className="rounded-lg">
        <img
          className="w-full sm:w-52 sm:min-h-32 sm:max-h-32 rounded-lg min-h-56 max-h-56"
          src="/thumbnail.png"
          alt=""
        />
      </div>
      <div className="mt-1">
        <h2 className="text-white sm:text-xl">
          Be Bored To be Great & Successful | SeeKen
        </h2>
        <p className="text-sm">Muhammad Bachal</p>
        <p className="text-sm"> 88M views . 5 hours ago</p>
        <p className="text-sm my-2 hidden sm:block">
          htmlFor Admission Queries, fill this form: <br />
          https://docs.google.com/forms/d/e/1FAIpQLSdDxj0rU60ZCDhr45OyuZWisG79oZR9Ooe7GQy2bzAG_uXt3Q/viewfor..
        </p>
      </div>
    </div>
  );
};

export default VideoListPost;
