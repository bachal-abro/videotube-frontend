import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => 'users/current-user',
            keepUnusedDataFor: 60,
        }),
        getUserById: builder.query({
            query: (userId) => `users/${userId}`,
            keepUnusedDataFor: 60,
        }),
    })
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery
} = usersApiSlice 