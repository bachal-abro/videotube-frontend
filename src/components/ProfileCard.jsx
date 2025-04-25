import React from "react";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../features/users/usersApiSlice";
useGetUserByIdQuery;

const ProfileCard = ({ video }) => {
    // const { video } = useSelector((store) => store.videoView);
    const ownerId = video?.owner;
    const { data, isLoading, isSuccess, isError, error } =
        useGetUserByIdQuery(ownerId);

    if (isLoading) {
        return <p>"Loading..."</p>;
    } else if (isSuccess) {
        const creator = data.data;

        return (
            <div className="flex items-center gap-4">
                <img
                    className="h-10 w-10 mt-1 rounded-full sm:block"
                    src={creator?.avatar}
                    alt="Avatar"
                />
                <div className="flex flex-col">
                    <h1 className="font-medium">{creator?.fullName}</h1>
                    {/* <p className="text-sm text-gray-300">{creator?.subscribers} Subscribers</p> */}
                </div>
            </div>
        );
    }
};

export default ProfileCard;
