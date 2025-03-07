import React from "react";
import SeparaterHr from "./SeparaterHr";
import VideosGrid from "./containers/VideosGrid";
import VideoPostSmall from "./VideoPostSmall";
const ProfileHome = () => {
  return (
    <>
      <div className="mb-4 mx-1 sm:mx-8">
        <h2 className="mb-4 text-white text-xl font-medium">Latest</h2>
        <VideosGrid>
          <VideoPostSmall />
          <VideoPostSmall />
          <VideoPostSmall />
          <VideoPostSmall />
          <VideoPostSmall />
        </VideosGrid>
        <SeparaterHr />
      </div>

      <div className="my-4 mx-1 sm:mx-8">
        <h2 className="my-4 text-white text-xl font-medium">Popular videos</h2>
        <VideosGrid>
          <VideoPostSmall />
          <VideoPostSmall />
          <VideoPostSmall />
          <VideoPostSmall />
          <VideoPostSmall />
        </VideosGrid>
        <SeparaterHr />
      </div>  
    </>
  );
};

export default ProfileHome;
