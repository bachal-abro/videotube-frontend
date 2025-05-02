import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToggleSubscriptionMutation } from "../features/subscription/subscriptionApiSlice";
import { setCurrentVideoOwnerSubscription } from "../features/videos/videoSlice";
const SubscriptionButtons = () => {
    const dispatch = useDispatch();
    const video = useSelector((store) => store.video);
    const currentVideo = video.currentVideo;
    const currentVideoOwnerSubscription = video.currentVideoOwnerSubscription;
    const [toggleSubscription, { isLoading }] = useToggleSubscriptionMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedSubscription = await toggleSubscription(
                currentVideo?.owner
            ).unwrap(); // Assuming this returns updated { isSubscribed, subscriberCount }
            console.log(updatedSubscription);
            // Dispatch the new state
            dispatch(setCurrentVideoOwnerSubscription(updatedSubscription));
        } catch (err) {
            console.error("Failed to toggle subscription:", err);
        }
    };

    useEffect(() => {}, [
        currentVideoOwnerSubscription,
        currentVideoOwnerSubscription.isSubscribed,
        handleSubmit,
        isLoading,
    ]);

    if (1 == 2) {
        return <h1>Loading....</h1>;
    } else if (true) {
        return (
            <div className="flex flex-col">
                <form
                    className="flex flex-col text-center mt-2"
                    method="post"
                    onSubmit={handleSubmit}
                >
                    {currentVideoOwnerSubscription?.isSubscribed ? (
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
    }
};

export default SubscriptionButtons;
