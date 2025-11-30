import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if(!baseURL) {
    console.error("VITE_API_BASE_URR 未设置，请在 .env 文件中配置该变量");
}

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;