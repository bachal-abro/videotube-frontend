import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToggleSubscriptionMutation } from "../features/subscription/subscriptionApiSlice";
import { setCurrentVideo } from "../features/videos/videoSlice";

const SubscriptionButtons = () => {
    const dispatch = useDispatch();
    const video = useSelector((store) => store.video.currentVideo);
    const [toggleSubscription, { isLoading }] = useToggleSubscriptionMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedSubscription = await toggleSubscription(
                video?.owner?._id
            ).unwrap();

            // Dispatch the new state
            const updatedVideo = {
                ...video,
                owner: {
                    ...video.owner,
                    subscribers: updatedSubscription.data?.subscribersCount, // your updated value
                    isSubscribed: updatedSubscription.data?.isSubscribed, // true or false
                },
            };
            dispatch(setCurrentVideo(updatedVideo));
        } catch (err) {
            console.error("Failed to toggle subscription:", err);
        }
    };
    return (
        <div className="flex flex-col">
            <form
                className="flex flex-col text-center mt-2"
                method="post"
                onSubmit={handleSubmit}
            >
                {video?.owner?.isSubscribed ? (
                    <button className="bg-gray-600 px-3 py-1 rounded-2xl">
                        Subscribed
                    </button>
                ) : (
                    <button
                        className="shrink-0 rounded-2xl p-2 text-sm font-medium sm:w-36 border-blue-500 bg-blue-700 text-black hover:bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500/20 dark:text-white"
                        disabled={isLoading}
                    >
                        Subscribe
                    </button>
                )}
            </form>
        </div>
    );
};

export default SubscriptionButtons;
