import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 1000,
  withCredentials: true,
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
});

