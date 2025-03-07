import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
  videoList: [],
  page: 1
}

const homeFeedSlice = createSlice({
  name: 'homeFeed',
  initialState,
  reducers: {
    addInitialVideos: (state, action) => {
      const newArr = [...state.videoList, ...action.payload]
      state.videoList = newArr
    },
  }
});

export const { addInitialVideos } = homeFeedSlice.actions;
export default homeFeedSlice;