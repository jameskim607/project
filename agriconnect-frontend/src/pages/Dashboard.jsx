import { Link, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isProductsPage = location.pathname.includes("products");
  const isOrdersPage = location.pathname.includes("orders");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {user?.role === "farmer" ? "🚜 Farmer Dashboard" : "🛒 Buyer Dashboard"}
          </h1>
          <p className="text-gray-600">Welcome, {user?.name}!</p>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mt-6">
            <Link
              to="products"
              className={`px-6 py-3 rounded-lg font-bold transition ${
                isProductsPage
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {user?.role === "farmer" ? "My Products" : "Browse Products"}
            </Link>
            <Link
              to="orders"
              className={`px-6 py-3 rounded-lg font-bold transition ${
                isOrdersPage
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {user?.role === "farmer" ? "Order Requests" : "My Orders"}
            </Link>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
