import React, { useState } from "react";
const VideoDescription = ({ video }) => {
    const [showMore, setShowMore] = useState(false);
    const HandleShowMore = () => {
        setShowMore((prev) => !prev);
    };
    return (
        <div className="flex flex-col px-2 py-3 my-2 rounded-xl text-sm -mb-6">
            <div className="sm:w-3/5">
                <p>
                    {video.description?.length > 50 && !showMore
                        ? video.description.slice(0, 50) + "..."
                        : video.description}
                </p>
            </div>
            <button
                type="button"
                onClick={HandleShowMore}
                className="flex pb-2 gap-1  items-center rounded-full text-black font-medium dark:text-blue-500 border-gray-200 dark:hover:text-blue-400"
            >
                {video.description?.length > 50 && !showMore
                    ? "show more"
                    : "show less"}
            </button>
        </div>
    );
};

export default VideoDescription;
