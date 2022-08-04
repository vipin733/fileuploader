import axios, { AxiosError } from "axios";
import Router from "next/router";

axios.interceptors.response.use( (response) =>  {
    return response;
},  (error: AxiosError) =>  {    
    if (error.response?.status === 401) {
        return Router.push("/login")
    }
    return Promise.reject(error);
});

export default axios