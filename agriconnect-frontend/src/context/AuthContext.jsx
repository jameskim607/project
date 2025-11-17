import { createContext, useState, useEffect, useRef } from "react";
import { initSocket, disconnectSocket } from "../api/socket";

export const AuthContext = createContext();

const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let storedToken = localStorage.getItem("token");

    // Normalize token: remove Bearer prefix if present
    if (storedToken && storedToken.startsWith("Bearer ")) {
      storedToken = storedToken.split(" ")[1];
      localStorage.setItem("token", storedToken);
    }

    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const resetInactivityTimer = () => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Only set timer if user is logged in
    if (user) {
      inactivityTimerRef.current = setTimeout(() => {
        logout();
        alert("Your session has expired due to inactivity. Please login again.");
      }, INACTIVITY_TIME);
    }
  };

  const login = (userData, token) => {
    // Ensure token saved without Bearer prefix
    if (token && token.startsWith && token.startsWith("Bearer ")) {
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
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  };

  // Set up activity listeners
  useEffect(() => {
    if (!user) return;

    // Initialize socket connection for real-time features
    try {
      initSocket(user._id);
    } catch (err) {
      console.error("Failed to initialize socket", err);
    }

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Initial timer setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      // Disconnect socket when user logs out or component unmounts
      try {
        disconnectSocket();
      } catch (err) {
        // ignore
      }
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
