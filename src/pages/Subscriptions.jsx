import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VideoCard } from "../components/video-card";
import { setVideoFeed } from "../features/videos/videoSlice";
import { useGetAllVideosQuery } from "../features/videos/videosApiSlice";
import { videosData } from "../data/videos";

const Subscriptions = () => {
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
        return (
            <div className="container mx-auto py-6 px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6">Latest</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videosData.map((video) => (
                        <VideoCard
                            key={video.id}
                            id={video.id}
                            thumbnail={video.thumbnail}
                            title={video.title}
                            channelName={video.channelName}
                            channelAvatar={video.channelAvatar}
                            views={video.views}
                            timestamp={video.timestamp}
                            duration={video.duration}
                            videoPreview={video.videoPreview}
                        />
                    ))}
                </div>
            </div>
        );
    } else if (isError) {
        return <p>There is are no videos to show</p>;
    }
};

export default Subscriptions;
