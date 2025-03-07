import React from "react";
import { useSelector } from "react-redux";

const ProfileCard = () => {
  const { video } = useSelector((store) => store.videoView);
  const creator = video?.owner
  
  return (
    <div className="flex items-center gap-4">
      <img
        className="h-10 w-10 mt-1 rounded-full sm:block"
        src={creator?.avatar}
        alt="Avatar"
      />
      <div className="flex flex-col">
        <h1 className="font-medium">{creator?.fullName}</h1>
        <p className="text-sm text-gray-300">{creator?.subscribers} Subscribers</p>
      </div>
    </div>
  );
};

export default ProfileCard;
