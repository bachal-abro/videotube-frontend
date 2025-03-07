import React, { useEffect } from "react";
import axios from "axios";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../store/commentsSlice";

const FetchComments = () => {
  const params = useParams();
  const videoId = params.videoid;
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get(`http://localhost:8000/api/v1/comments/${videoId}`, { signal })
      .then((res) => {
        let comments = res.data.data;

        dispatch(getComments(comments));
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      controller.abort();
    };
  }, []);
  return <></>;
};

export default FetchComments;
