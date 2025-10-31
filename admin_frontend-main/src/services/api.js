// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/", // backend CI4 (spark) sur 8081
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
