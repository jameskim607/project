// src/components/ProductCard.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!user) return toast.error("Login to order"), navigate("/login");
    if (user.role !== "buyer") return toast.error("Only buyers can order");

    const qty = prompt(`How many KG of "${product.name}"?`, "1");
    if (!qty || isNaN(qty) || qty <= 0) return toast.error("Invalid quantity");

    try {
      await API.post("/orders", {
        productId: product._id,
        farmerId: product.farmerId._id,
        quantity: Number(qty),
        totalPrice: Number(qty) * product.pricePerKg,
      });
      toast.success(`Ordered ${qty}kg!`);
    } catch (err) {
      toast.error("Order failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="relative">
        <img
          src={`http://localhost:5001${product.image}`}
          alt={product.name}
          className="w-full h-48 sm:h-56 object-cover"
          onError={(e) => (e.target.src = "/default-product.jpg")}
        />
        {product.quantityAvailable === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {product.description || "Fresh from the farm"}
        </p>

        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              KSh {product.pricePerKg}/kg
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {product.quantityAvailable} kg available
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={`/farmer/${product.farmerId._id}`}
            className="text-center py-3 px-4 bg-gray-100 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
          >
            View Farmer
          </Link>

          {user?.role === "buyer" ? (
            <button
              onClick={handleOrder}
              disabled={product.quantityAvailable === 0}
              className={`py-3 px-4 rounded-xl font-bold text-sm transition ${
                product.quantityAvailable === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {product.quantityAvailable === 0 ? "Sold Out" : "Order Now"}
            </button>
          ) : user?.role === "farmer" && product.farmerId._id === user._id ? (
            <span className="col-span-2 text-center py-3 bg-blue-100 text-blue-800 rounded-xl font-bold text-sm">
              Your Product
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}