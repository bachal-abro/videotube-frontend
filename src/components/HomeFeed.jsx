import React from "react";
import { useSelector } from "react-redux";
import VideoPost from "./VideoPost";
import { useGetAllVideosQuery } from "../features/videos/videosApiSlice";

const HomeFeed = () => {
    const { data, isLoading, isSuccess, isError, error } =
        useGetAllVideosQuery();

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = (
          <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full text-gray-300">
              {data?.data.map((video) => (
                  <VideoPost key={video._id} video={video} />
              ))}
          </div>
      </>
        );
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
};

export default HomeFeed;
