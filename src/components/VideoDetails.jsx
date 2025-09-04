import React, { useEffect, useState } from "react";
import { IoCalendarOutline, IoEyeOutline } from "react-icons/io5";
import ProfileCard from "./ProfileCard";
import SubscriptionButtons from "./SubscriptionButtons";
import VideoButtons from "./VideoButtons";
import VideoDescription from "./VideoDescription";
import SeparaterHr from "./SeparaterHr";
import { useDispatch, useSelector } from "react-redux";
import { timeAgo } from "../utils/timeFormats";

const VideoDetails = () => {
    const video = useSelector((store) => store.video.currentVideo);
    return (
        <>
            <div className="w-full">
                <video
                    className="h-[40vh] sm:h-[70vh] bg-gray-900 w-full rounded-lg"
                    controls
                >
                    <source src={video?.videoFile} type="video/mp4" />
                </video>
                <div className="flex flex-col mt-2 px-2">
                    <h1 className="text-xl font-bold">{video?.title}</h1>
                    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 mt-2 sm:mt-4 -mb-3 sm:pr-4">
                        <div className="flex items-end gap-4 text-gray-300 text-sm">
                            <span className="flex gap-1 items-center">
                                <IoCalendarOutline className="text-lg" />{" "}
                                {timeAgo(video?.createdAt)}
                            </span>
                            <span className="flex gap-1 items-center">
                                <IoEyeOutline className="text-lg" />
                                {video?.views}
                            </span>
                        </div>
                        <VideoButtons video={video} />
                    </div>
                </div>
                <SeparaterHr />
                <div className="sm:flex justify-between px-2 sm:px-2">
                    <ProfileCard />
                    <SubscriptionButtons />
                </div>
            </div>
            <VideoDescription video={video} />
        </>
    );
};

export default VideoDetails;
