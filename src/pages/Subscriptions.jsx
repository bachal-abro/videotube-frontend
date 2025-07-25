import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VideoCard } from "../components/video-card";
import { setSubscriptionFeed } from "../features/videos/videoSlice";
import { useGetVideosFromSubscriptionsQuery } from "../features/videos/videosApiSlice";
import { timeAgo } from "../utils/timeAgo";

const Subscriptions = () => {
    const { subscriptionFeed } = useSelector((store) => store.video);
    const dispatch = useDispatch();
    const { data, isLoading, isSuccess, isError, error } =
        useGetVideosFromSubscriptionsQuery();
    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setSubscriptionFeed(data.data));
        }
    }, [isSuccess, data, dispatch]);

    if (isLoading) {
        return <p>"Loading..."</p>;
    } else if (isSuccess) {
        return (
            <div className="container mx-auto py-6 px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6">Latest</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subscriptionFeed.map((video) => (
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

export default Subscriptions;
