import React from "react";
import { Link } from "react-router-dom";

const VideoPost = ({ video }) => {
  
  return (
    <Link to={`/videos/${video._id}`}>
      {/* //? IDEA: Show views on Thumbnail and remove img tag and set cover of video as thumbnail */}
      <div className="aspect-video">
        <img
          className="aspect-video rounded-lg"
          src={video.thumbnail}
          alt="Video thumbnail"
        />
      </div>

      <div className="flex flex-col justify-between mt-2 pr-2 h-20 text-sm">
        <div>
          <h2 className="text-white">{video.title}</h2>
        </div>

        <div className="flex items-center gap-1">
          {/* Owner image */}
          <img
            className="h-8 w-8 rounded-full sm:block"
            src={video.owner.avatar}
            alt="Video thumbnail"
          />
          <div className="flex flex-col gap-0">
            <p className="text-sm">{video.owner.fullName}</p>
            <p className="text-sm -mt-1">{video.createdAt}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoPost;
