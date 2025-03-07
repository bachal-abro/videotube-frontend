import React from "react";
import VideosGrid from "./containers/VideosGrid";
import VideoPostSmall from "./VideoPostSmall";
import CategoryNavigation from "./CategoryNavigation";

const ProfileVideos = () => {
  
  const categoryItems = [
    {
      name: "Latest",
      url: "/@username/videos",
      active: true,
    },
    {
      name: "Popular",
      url: "/@username/popular",
      active: true,
    },
    {
      name: "Oldest",
      url: "/@username/oldest",
      active: true,
    },
  ];

  return (
    <div>
      <CategoryNavigation>{categoryItems}</CategoryNavigation>
      <div className="my-4 mx-1 sm:mx-8">
        <VideosGrid>
          <VideoPostSmall />
        </VideosGrid>
      </div>
    </div>
  );
};

export default ProfileVideos;
