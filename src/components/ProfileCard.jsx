import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../features/users/usersApiSlice";
import { setCurrentVideoOwner } from "../features/videos/videoSlice";

const ProfileCard = () => {
    const subscription = useSelector(
        (store) => store.video.currentVideoOwnerSubscription
    );

    const dispatch = useDispatch();
    const currentVideoOwner = useSelector(
        (store) => store.video.currentVideoOwner
    );

    const currentVideo = useSelector((store) => store.video.currentVideo);
    const { data, isLoading, isSuccess, isError } = useGetUserByIdQuery(
        currentVideo?.owner
    );

    useEffect(() => {
        if (data && isSuccess) {
            dispatch(
                setCurrentVideoOwner({
                    ...data?.data,
                })
            );
        }
    }, [data, isSuccess, subscription]);
    if (isLoading) {
        return <p>"Loading..."</p>;
    } else if (isSuccess) {
        const creator = currentVideoOwner;
        return (
            <div className="flex items-center gap-4">
                <img
                    className="h-10 w-10 mt-1 rounded-full sm:block"
                    src={creator?.avatar}
                    alt="Avatar"
                />
                <div className="flex flex-col">
                    <h1 className="font-medium">{creator?.fullName}</h1>
                    <p className="text-sm text-gray-300">
                        {subscription?.subscriberCount} Subscribers
                    </p>
                </div>
            </div>
        );
    }
};

export default ProfileCard;
