import React from "react";
import HomeFeed from "../components/HomeFeed";
import { useSelector } from "react-redux";
import CategoryNavigation from "../components/CategoryNavigation";

const Home = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);

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
  return (
    <div className="flex flex-col w-full sm:w-auto px-1 ml-1">
      <div className="h-12"></div>
      <CategoryNavigation>{categoryItems}</CategoryNavigation>
      {/* <Fetching/> */}
      <HomeFeed />
      {/* {fetchStatus.currentlyFetching ? <Spinner/>: <HomeFeed />} */}
    </div>
  );
};

export default Home;
