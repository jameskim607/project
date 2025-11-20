// src/main.jsx   ← THIS IS THE FINAL ONE — TRUST ME
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: "#10b981", color: "white", fontWeight: "bold" },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);