import React, { useEffect } from "react";
import SeparaterHr from "../components/SeparaterHr";
import CommentSection from "../components/CommentSection";
import VideoDetails from "../components/VideoDetails";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchStatusActions } from "../services/store/fetchStatusSlice";
import { view } from "../services/store/videoViewSlice";

const VideoView = () => {
  const params = useParams();
  const videoId = params.videoid;

  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchStatusActions.markFetchingStarted());
    axios
      .get(`http://localhost:8000/api/v1/videos/${videoId}`, { signal })
      .then((res) => {
        let video = res.data.data;
        
        dispatch(view(video));
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="w-full text-white">
      <VideoDetails videoId={videoId} />
      <SeparaterHr />
      <CommentSection videoId={videoId} />
    </div>
  );
};

export default VideoView;
