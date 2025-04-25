import React from "react";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../features/users/usersApiSlice";
import { useGetSubscribersQuery } from "../features/subscription/subscriptionApiSlice";

const ProfileCard = ({ video }) => {
    // const { video } = useSelector((store) => store.videoView);
    const ownerId = video?.owner;
    const { data:channel, isLoading: isChannelLoading, isSuccess:isChannelSuccess, isChannelError, channelError } =
        useGetUserByIdQuery(ownerId);

    const { data:subscription, isLoading: isSubscriptionLoading, isSuccess:isSubscriptionSuccess } =
    useGetSubscribersQuery(ownerId);
        
    if (isChannelLoading) {
        return <p>"Loading..."</p>;
    } else if (isChannelSuccess) {
        const creator = channel.data;
      
        return (
            <div className="flex items-center gap-4">
                <img
                    className="h-10 w-10 mt-1 rounded-full sm:block"
                    src={creator?.avatar}
                    alt="Avatar"
                />
                <div className="flex flex-col">
                    <h1 className="font-medium">{creator?.fullName}</h1>
                    <p className="text-sm text-gray-300">{subscription?.pagination.subscribersCount} Subscribers</p>
                </div>
            </div>
        );
    }
};

export default ProfileCard;
