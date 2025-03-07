import React from "react";
import { useSelector } from "react-redux";

const SubscriptionButtons = () => {
  const { video } = useSelector((store) => store.videoView);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col text-center mt-2">
        {video.isSubscribed ? (
          <button className="bg-gray-600 px-3 py-1 rounded-2xl">
            Subscribed
          </button>
        ) : (
          <a
            href="#"
            className="shrink-0 rounded-2xl p-2 text-sm font-medium sm:w-36 border-blue-500 bg-blue-700 text-black hover:bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500/20 dark:text-white"
          >
            Subscribe
          </a>
        )}
      </div>
    </div>
  );
};

export default SubscriptionButtons;
