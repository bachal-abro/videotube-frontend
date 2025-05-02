import React from "react";
import {
    AiFillDislike,
    AiFillLike,
    AiOutlineDislike,
    AiOutlineLike,
} from "react-icons/ai";
import { TbShare3 } from "react-icons/tb";
import { MdDownload } from "react-icons/md";
import LikeButton from "./ui/LikeButton";
const VideoButtons = ({ video }) => {
    return (
        <div className="flex justify-between sm:justify-normal sm:gap-8 items-center">
            <LikeButton video={video} />
            <button
                type="submit"
                className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-white border-gray-200 dark:hover:text-blue-400"
            >
                <AiOutlineDislike className="text-xl" />
                <AiFillDislike className="text-xl hidden" />
                50
            </button>
            <button
                type="submit"
                className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-white border-gray-200 dark:hover:text-blue-400"
            >
                <MdDownload className="text-xl" />
                Download
            </button>
            <button
                type="submit"
                className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-white border-gray-200 dark:hover:text-blue-400"
            >
                <TbShare3 className="text-xl" />
                Share
            </button>
        </div>
    );
};

export default VideoButtons;
