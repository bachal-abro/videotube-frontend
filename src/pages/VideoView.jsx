import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import SeparaterHr from "../components/SeparaterHr";
// import CommentSection from "../components/CommentSection";
import VideoDetails from "../components/VideoDetails";
import { useGetVideoByIdQuery } from "../features/videos/videosApiSlice";

const VideoView = () => {
    const { videoId } = useParams();
    const { data, isLoading, isSuccess, isError, error } =
        useGetVideoByIdQuery(videoId);
    const video = data?.data;

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = (
            <div className="w-ful text-white">
                <VideoDetails video={video} />
                <SeparaterHr />
                {/* <CommentSection videoId={videoId} /> */}
            </div>
        );
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content;
};

export default VideoView;
