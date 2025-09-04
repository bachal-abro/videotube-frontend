import { apiSlice } from "../../app/api/apiSlice";

export const subscriptionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscribers: builder.query({
            query: (channelId) => `subscriptions/u/${channelId}`,
        }),
        getSubscribedChannels: builder.query({
            query: (userId) => `subscriptions/c/${userId}`,
        }),
        getSubscriptionStatus: builder.query({
            query: (channelId) => `subscriptions/s/${channelId}`,
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
    useGetSubscriptionStatusQuery,
} = subscriptionApiSlice;