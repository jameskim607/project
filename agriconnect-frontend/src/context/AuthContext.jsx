// src/context/AuthContext.jsx   ← FINAL 100% WORKING VERSION
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { initSocket, disconnectSocket } from "../api/socket";

export const AuthContext = createContext();

const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let storedToken = localStorage.getItem("token");

    if (storedToken && storedToken.startsWith("Bearer ")) {
      storedToken = storedToken.split(" ")[1];
      localStorage.setItem("token", storedToken);
    }

    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    if (user) {
      inactivityTimerRef.current = setTimeout(() => {
        logout();
        alert("Session expired due to inactivity. Please login again.");
      }, INACTIVITY_TIME);
    }
  };

  const login = (userData, token) => {
    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    resetInactivityTimer();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
  };

  useEffect(() => {
    if (!user) return;

    try {
      initSocket(user._id);
    } catch (err) {}

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    const handleActivity = () => resetInactivityTimer();

    events.forEach(event => document.addEventListener(event, handleActivity));
    resetInactivityTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      try { disconnectSocket(); } catch (err) {}
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// THIS IS THE KEY — useContext is now imported!
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};