import React, { useEffect } from "react";
import HomeFeed from "../components/HomeFeed";
import { useDispatch, useSelector } from "react-redux";
import { VideoCard } from "../components/video-card";
import { setVideoFeed } from "../features/videos/videoSlice";
import { useGetAllVideosQuery } from "../features/videos/videosApiSlice";
import { videosData } from "../data/videos";
import { categories } from "../data/categories"; // Import categories
import { Button } from "../components/ui/button"; // Import Button
import { timeAgo } from "../utils/timeAgo";

const Home = () => {
    const { videoFeed } = useSelector((store) => store.video);
    const dispatch = useDispatch();
    const { data, isLoading, isSuccess, isError, error } =
        useGetAllVideosQuery();
    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setVideoFeed(data.data));
        }
    }, [isSuccess, data, dispatch]);

    if (isLoading) {
        return <p>"Loading..."</p>;
    } else if (isSuccess) {
        console.log(videoFeed);
        return (
            <div className="container mx-auto py-10 px-4 lg:px-6">
                <div className="mb-8 flex overflow-x-auto pb-4 scrollbar-hide max">
                    <div className="flex gap-3 whitespace-nowrap w-0">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant="secondary"
                                className="rounded-full px-4 py-2 text-sm flex-shrink-0"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videoFeed.map((video) => (
                        <VideoCard
                            key={video._id}
                            id={video._id}
                            thumbnail={video.thumbnail}
                            title={video.title}
                            channelName={video.ownerName}
                            channelAvatar={video.ownerAvatar}
                            views={video.views}
                            timestamp={timeAgo(video.createdAt)}
                            duration={video.duration}
                            videoPreview={video.videoFile}
                        />
                    ))}
                </div>
            </div>
        );
    } else if (isError) {
        return <p>There is are no videos to show</p>;
    }
};

export default Home;
