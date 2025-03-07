import React, { useState, useEffect } from "react";
import axios, { Axios } from "axios";

const useRequest = (urlPath, query="") => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await axios.get(`${urlPath}?query=` + query, {
                    signal: controller.signal,
                });
                console.log(response.data);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request Canceled", error.message);
                    return;
                }
                setError(error);
                setLoading(false);
            }

            return () => {
                controller.abort();
            };
        })();
    }, []);

    return [data, error, loading];
};

export default useRequest;
