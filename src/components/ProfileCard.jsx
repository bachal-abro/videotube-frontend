import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfileCard = () => {
    const currentVideo = useSelector((store) => store.video.currentVideo);

    return (
        <div className="flex items-center gap-4">
            <img
                className="h-10 w-10 mt-1 rounded-full sm:block"
                src={currentVideo?.owner?.avatar}
                alt="Avatar"
            />
            <div className="flex flex-col">
                <h1 className="font-medium">{currentVideo.owner?.fullName}</h1>
                <p className="text-sm text-gray-300">
                    {currentVideo?.owner?.subscribers} Subscribers
                </p>
            </div>
        </div>
    );
};

export default ProfileCard;
