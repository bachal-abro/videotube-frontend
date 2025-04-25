import React from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoPost from "./VideoPost";
import { useGetAllVideosQuery } from "../features/videos/videosApiSlice";
import { setVideoFeed } from "../features/videos/videoSlice";

const HomeFeed = () => {
    const { videoFeed } = useSelector((store) => store.video);
    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full text-gray-300">
                {videoFeed.map((video) => (
                    <VideoPost key={video._id} video={video} />
                ))}
            </div>
        </>
    );
};

export default HomeFeed;
