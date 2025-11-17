import { io } from "socket.io-client";

let socket = null;

const DEFAULT_API = "http://localhost:5000";
// For Vite, use import.meta.env.VITE_API_URL. Fallback to DEFAULT_API.
const API_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : DEFAULT_API;

export const initSocket = (userId) => {
  try {
    socket = io(API_URL);
    socket.on("connect", () => {
      if (userId) socket.emit("join", userId);
    });
    return socket;
  } catch (err) {
    console.error("Socket init error", err);
    return null;
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
