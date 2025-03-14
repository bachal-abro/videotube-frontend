import React from "react";
import VideosList from "../components/VideosList";

const LikedVideos = () => {
    return (
        <div className="text-white sm:p-8 px-1 w-full">
            <h1 className="text-2xl my-2">Liked videos</h1>
            <VideosList />
        </div>
    );
};

export default LikedVideos;
