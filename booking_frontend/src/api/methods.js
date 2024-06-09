import React from "react";
import axios from "axios";
import getApiUrl from "./apiurls";

const ApiMethods = {
  get: async (urlInfo = "", params = {}, body = {}, id = "") => {
    let url = await getApiUrl(urlInfo, id);
    let response = await axios(url, { params });
    return response;
  },

  post: async (urlInfo, body = {}, params = {}, token = "") => {
    try {
      let url = await getApiUrl(urlInfo);
      let headers = token
        ? {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          }
        : { "content-type": "application/json" };
      let response = await axios.post(url, body, {
        headers: headers,
        params: params,
      });
    
      return response;
    } catch (error) {
      
      throw error.response.data;
    }
  },

  put: async (
    urlInfo,
    body = {},
    params = {},
    id = "",
    query = {},
    token = ""
  ) => {
  

    try {
      let url = await getApiUrl(urlInfo, id);
      let headers = token
        ? {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          }
        : { "content-type": "applicaton/json" };
      let response = await axios.put(url,body , {params:query} );
     
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default ApiMethods;
