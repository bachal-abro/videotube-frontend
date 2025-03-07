import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStatusActions } from "../../store/fetchStatusSlice.js";
import axios from "axios";
import { videosActions } from "../../store/VideosSlice.js";

const FetchVideos = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;
    
    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchStatusActions.markFetchingStarted());
    axios
      .get("http://localhost:8000/api/v1/videos", { signal })
      .then((res) => {
        let videos = res.data.data;
        
        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(videosActions.addInitialVideos(videos));
        
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      controller.abort();
    };
  }, [fetchStatus]);

  return <></>;
};

export default FetchVideos;
