import axios from "axios";

export const SaveToken = (token: string) => {
    localStorage.setItem("authToken", token);
};

export const GetToken = () => {
    return localStorage.getItem("authToken");
};

export const axiosRequest = axios.create({
    baseURL: "https://instagram-api.softclub.tj/"
});

axiosRequest.interceptors.request.use(
    (config) => {
        const token = GetToken();

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }

        return config;
    },
    (error) => Promise.reject(error)
);