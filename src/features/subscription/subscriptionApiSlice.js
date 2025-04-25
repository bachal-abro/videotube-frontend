import { apiSlice } from "../../app/api/apiSlice";

export const subscriptionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscribers: builder.query({
            query: (channelId) => `subscriptions/u/${channelId}`,
            keepUnusedDataFor: 60,
        }),
        getSubscribedChannels: builder.query({
            query: (userId) => `subscriptions/c/${userId}`,
            keepUnusedDataFor: 60,
        }),
        toggleSubscription: builder.mutation({
            query: (userId) => ({
                url: `subscriptions/u/${userId}`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetSubscribersQuery,
    useGetSubscribedChannelsQuery,
    useToggleSubscriptionMutation,
} = subscriptionApiSlice;