// src/api/api.ts
// src/api/api.ts
import axios from "axios";
import { getToken } from "../utils/authStorage";

const LOCAL_IP = "192.168.98.149";



const BASE_URL = `http://${LOCAL_IP}:3000`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
