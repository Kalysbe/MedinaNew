import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.0.253:5050/"
});

instance.interceptors.request.use((config) => {
    // Добавление токена авторизации к заголовкам запроса
    const token = window.localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
