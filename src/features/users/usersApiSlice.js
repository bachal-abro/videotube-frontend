import { apiSlice } from "../../app/api/apiSlice"

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/current-user',
            keepUnusedDataFor: 60,
        })
    })
})

export const {
    useGetUsersQuery
} = usersApiSlice 