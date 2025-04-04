import config from "./config";
import axios from "axios";

const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true
});

export  default api;