import React, { useEffect, useState } from "react";

import ApiMethods from "../api/methods";

const MyCustomHook = (url) => {
  let [data, setData] = useState("");
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await ApiMethods.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default MyCustomHook;
