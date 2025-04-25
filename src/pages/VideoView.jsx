import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import SeparaterHr from "../components/SeparaterHr";
// import CommentSection from "../components/CommentSection";
import VideoDetails from "../components/VideoDetails";
import { useGetVideoByIdQuery } from "../features/videos/videosApiSlice";


const VideoView = () => {
    const { videoId } = useParams();
    const { data: video, isLoading, isSuccess, isError, error, isFetching } = useGetVideoByIdQuery(videoId);
    if (isFetching) {
        return <p>"Loading..."</p>;
    } else if (isSuccess) {
            return <div className="w-ful text-white">
                <VideoDetails video={video.data} />
                <SeparaterHr />
                {/* <CommentSection videoId={videoId} /> */}
            </div>
    
    } else if (isError) {
        return <p>{JSON.stringify(error)}</p>;
    }
    
};

export default VideoView;
