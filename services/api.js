import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const api = axios.create({
  baseURL: "http://192.168.20.6:8000",
});


api.interceptors.request.use(async (config) => {
  const token = await EncryptedStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// http:// 192.168.192.1:8000

// https://dev-rms-backend.4labsinc.com