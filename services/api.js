import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const api = axios.create({
  baseURL: "https://dev-rms-backend.4labsinc.com",
});


api.interceptors.request.use(async (config) => {
  const token = await EncryptedStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// http://192.168.60.246:8000