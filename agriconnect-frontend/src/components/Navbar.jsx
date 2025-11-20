// src/components/Navbar.jsx   ← FINAL FIXED & MOBILE RESPONSIVE
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";  // ← FIXED: "react" not "reactLOD"
import API from "../api/axiosInstance";
import { getSocket } from "../api/socket";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Theme toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Notifications & Socket
  useEffect(() => {
    if (!user) return;

    const fetchNotifs = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data || []);
      } catch (err) {}
    };
    fetchNotifs();

    const sock = getSocket();
    if (sock) {
      const handleNewNotif = (n) => {
        setNotifications((prev) => [n, ...prev]);
        setToast({ message: n.message });
        setTimeout(() => setToast(null), 5000);
      };
      sock.on("newNotification", handleNewNotif);
      sock.on("orderStatusUpdated", (p) => p.notification && handleNewNotif(p.notification));
      return () => {
        sock.off("newNotification");
        sock.off("orderStatusUpdated");
      };
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {}
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-4xl">AgriConnect</span>
              <span className="hidden md:inline">AgriConnect</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-green-700 rounded-lg text-xl"
              >
                {theme === "dark" ? "Bright" : "Dark"}
              </button>

              {user ? (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-green-700 rounded-full">
                      <span className="text-2xl">Bell</span>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {open && (
                      <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-green-600 text-white p-3 font-bold">Notifications</div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="p-4 text-gray-500 text-center">No notifications</p>
                          ) : (
                            notifications.map((n) => (
                              <div key={n._id} className={`p-4 border-b ${!n.read ? "bg-green-50" : "bg-gray-50"}`}>
                                <p className="text-sm">{n.message}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(n.createdAt).toLocaleTimeString()}
                                  </span>
                                  {!n.read && (
                                    <button onClick={() => markRead(n._id)} className="text-xs text-green-600 font-medium">
                                      Mark as read
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="px-3 py-1 bg-green-700 rounded-full text-sm font-bold">
                    {user.role === "farmer" ? "Farmer" : "Buyer"}
                  </span>
                  <Link to="/dashboard" className="hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-bold">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:bg-green-700 px-4 py-2 rounded-lg font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-white text-green-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-100">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-green-700 rounded-lg"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-green-700 border-t border-green-600">
            <div className="px-4 py-6 space-y-4 text-lg font-medium">
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 hover:bg-green-600 rounded-lg px-4"
              >
                {theme === "dark" ? "Bright Mode" : "Dark Mode"}
              </button>

              {user ? (
                <>
                  <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-green-600 rounded-lg px-4">
                    Browse Products
                  </Link>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-green-600 rounded-lg px-4">
                    Dashboard
                  </Link>
                  <div className="px-4 py-2 text-sm opacity-90">
                    Logged in as <strong>{user.name}</strong> ({user.role})
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-green-600 rounded-lg px-4">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block bg-white text-green-700 py-3 rounded-lg font-bold text-center">
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-pulse">
          <div className="bg-white text-gray-800 p-4 rounded-lg shadow-2xl border-l-4 border-green-600">
            <p className="font-bold">New Notification</p>
            <p className="text-sm mt-1">{toast.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;