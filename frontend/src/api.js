// src/api.js
import axios from "axios";

// Use environment variable for base URL (Vite requires VITE_ prefix)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allow cookies if needed
});

// Automatically add token if available
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("authData");
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ----------- AUTH -----------
export const registerUser = async (username, email, password) => {
  const response = await api.post("/auth/register", { username, email, password });
  return response.data; // { user, token }
};

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // { user, token }
};

// ----------- USERS -----------
export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// ----------- CHATS -----------
export const fetchChats = async (userId) => {
  const response = await api.get(`/chats/${userId}`);
  return response.data;
};

// ----------- MESSAGES -----------
export const fetchMessages = async (chatId) => {
  const response = await api.get(`/messages/${chatId}`);
  return response.data;
};

export const sendMessage = async (chatId, senderId, text) => {
  const response = await api.post("/messages", { chatId, senderId, text });
  return response.data;
};
