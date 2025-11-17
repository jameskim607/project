import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axiosInstance";
import { getSocket } from "../api/socket";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const dropdownRef = useRef();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // apply persisted theme on mount
    try {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (err) {}
  }, [theme]);
  useEffect(() => {
    if (!user) return;

    const fetchNotifs = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    fetchNotifs();

    // Attach listeners to existing socket (initialized in AuthContext)
    const sock = getSocket();
    if (sock) {
      sock.on("newNotification", (n) => {
        setNotifications((prev) => [n, ...(prev || [])]);
        // show a toast briefly
        try {
          setToast({ message: n.message, id: n._id });
          setTimeout(() => setToast(null), 5000);
        } catch (err) {}
      });
      sock.on("orderStatusUpdated", (payload) => {
        const n = payload.notification;
        if (n) {
          setNotifications((prev) => [n, ...(prev || [])]);
          setToast({ message: n.message, id: n._id });
          setTimeout(() => setToast(null), 5000);
        }
      });
    }

    return () => {
      if (sock) {
        sock.off("newNotification");
        sock.off("orderStatusUpdated");
      }
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  return (
    <>
    <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-3xl font-bold flex items-center gap-2">
        <span className="text-4xl">🌾</span>
        <span className="hidden sm:inline">AgriConnect</span>
      </Link>
      <div className="flex items-center space-x-6">
        <button
          onClick={() => {
            const next = theme === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('theme', next);
            if (next === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          }}
          className="mr-2 p-2 rounded hover:bg-green-700"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((o) => !o)}
                className="relative p-2 rounded-full hover:bg-green-700"
                aria-label="Notifications"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">{unreadCount}</span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 && (
                      <div className="p-3 text-sm text-gray-500">No notifications</div>
                    )}
                    {notifications.map((n) => (
                      <div key={n._id} className={`p-3 border-b ${n.read ? 'bg-white' : 'bg-green-50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="text-sm">{n.message}</div>
                          <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        {!n.read && (
                          <button onClick={() => markRead(n._id)} className="text-xs text-green-600 mt-2">Mark read</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm font-semibold hidden sm:block px-3 py-1 bg-green-700 rounded-full">
              {user.role === "farmer" ? "🚜 Farmer" : "🛒 Buyer"}
            </div>
            <Link 
              to="/dashboard" 
              className="hover:bg-green-700 px-3 py-2 rounded-lg transition duration-200 font-semibold"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              className="hover:bg-green-700 px-3 py-2 rounded-lg transition duration-200 font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition duration-200"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
    {/* toast overlay */}
    {toast && (
      <div className="fixed right-6 bottom-6 z-50">
        <div className="max-w-xs w-full bg-white shadow-lg rounded-lg border-l-4 border-green-600 p-4 text-gray-800">
          <div className="font-semibold">New Notification</div>
          <div className="text-sm mt-1">{toast.message}</div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
