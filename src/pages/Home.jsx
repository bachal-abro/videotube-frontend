import React, { useEffect } from "react";
import HomeFeed from "../components/HomeFeed";
import { useDispatch, useSelector } from "react-redux";
import CategoryNavigation from "../components/CategoryNavigation";
import { setVideoFeed } from "../features/videos/videoSlice";
import { useGetAllVideosQuery } from "../features/videos/videosApiSlice";

const Home = () => {
    // const fetchStatus = useSelector((store) => store.fetchStatus);
    const categoryItems = [
        {
            name: "All",
            url: "/",
            active: true,
        },
        {
            name: "Tech",
            url: "/category/:tech",
            active: true,
        },
        {
            name: "Movies",
            url: "/category/:movies",
            active: true,
        },
        {
            name: "Music",
            url: "/category/:music",
            active: true,
        },
    ];

    const { videoFeed } = useSelector((store) => store.video);
    const dispatch = useDispatch();

    const { data, isLoading, isSuccess, isError, error } =
        useGetAllVideosQuery();
        useEffect(() => {
          if (isSuccess && data?.data) {
            dispatch(setVideoFeed(data.data));
          }
        }, [isSuccess, data, dispatch]);
        
    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = (
            <div className="flex flex-col w-full sm:w-auto px-1 ml-1">
                <div className="h-12"></div>
                <CategoryNavigation>{categoryItems}</CategoryNavigation>
                {/* <Fetching/> */}
                <HomeFeed />
                {/* {fetchStatus.currentlyFetching ? <Spinner/>: <HomeFeed />} */}
            </div>
        );
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content;
};

export default Home;
