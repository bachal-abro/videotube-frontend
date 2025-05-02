import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import SeparaterHr from "../components/SeparaterHr";
// import CommentSection from "../components/CommentSection";
import VideoDetails from "../components/VideoDetails";
import { useGetVideoByIdQuery } from "../features/videos/videosApiSlice";
import { useDispatch } from "react-redux";
import { setCurrentVideo } from "../features/videos/videoSlice";

const VideoView = () => {
    const dispatch = useDispatch()
    const { videoId } = useParams();
    const { data, isLoading, isSuccess, isError, error } = useGetVideoByIdQuery(videoId);

    useEffect(() => {
        if (data && isSuccess) {
            dispatch(setCurrentVideo(data?.data))
        }
    }, [data, isLoading, isSuccess, isError])
    
    if (isLoading) {
        return <p>"Loading..."</p>;
    } else if (isSuccess) {
            return <div className="w-ful text-white">
                <VideoDetails/>
                <SeparaterHr />
                {/* <CommentSection videoId={videoId} /> */}
            </div>
    
    } else if (isError) {
        return <p>{JSON.stringify(error)}</p>;
    }
    
};

export default VideoView;
