import React from "react";

const Playlist = () => {
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, repellat?
          </h2>
          <p className="text-sm"> Updated 5 hours ago</p>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
