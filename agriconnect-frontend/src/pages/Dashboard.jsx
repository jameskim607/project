// src/pages/Dashboard.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return null;

  const isProducts = location.pathname.startsWith("/products");
  const isOrders = location.pathname.includes("orders");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <h1 className="text-5xl font-bold text-green-800 mb-4">
              {user.role === "farmer" ? "Farmer" : "Buyer"} Dashboard
            </h1>
            <div className="flex gap-8 text-xl font-bold">
              <Link
                to="/products"
                className={`px-10 py-5 rounded-xl transition ${isProducts ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {user.role === "farmer" ? "My Products" : "Browse Products"}
              </Link>
              <Link
                to="/dashboard/orders"
                className={`px-10 py-5 rounded-xl transition ${isOrders ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {user.role === "farmer" ? "Order Requests" : "My Orders"}
              </Link>
            </div>
          </div>
        </div>
        {location.pathname === "/dashboard" || location.pathname === "/dashboard/orders" ? (
          <div className="max-w-7xl mx-auto px-8 py-10">
            <Outlet />
          </div>
        ) : null}
      </div>
    </div>
  );
}