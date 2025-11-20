// src/pages/Orders.jsx   ← FINAL WORKING VERSION
import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";  // ← CORRECT IMPORT
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Orders() {
  const { user } = useAuth();  // ← NOW WORKS!
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order ${status}!`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!user) return <div className="text-center py-20 text-2xl">Please log in</div>;
  if (loading) return <div className="text-center py-20 text-xl">Loading orders...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">
        {user.role === "farmer" ? "Order Requests" : "My Orders"}
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-2xl text-gray-600 py-20">No orders yet</p>
      ) : (
        <div className="grid gap-8">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-xl p-8 border">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{order.productId?.name}</h3>
                  <p className="text-lg">Quantity: {order.quantity} kg • Total: KSh {order.totalPrice}</p>
                </div>
                <span className={`px-6 py-3 rounded-full font-bold text-lg ${
                  order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  order.status === "accepted" ? "bg-blue-100 text-blue-800" :
                  order.status === "rejected" ? "bg-red-100 text-red-800" :
                  order.status === "shipped" ? "bg-purple-100 text-purple-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              {user.role === "farmer" && order.status === "pending" && (
                <div className="flex gap-4">
                  <button onClick={() => updateStatus(order._id, "accepted")} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700">
                    Accept Order
                  </button>
                  <button onClick={() => updateStatus(order._id, "rejected")} className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700">
                    Reject
                  </button>
                </div>
              )}

              {user.role === "buyer" && order.farmerId && (
                <Link to={`/farmer/${order.farmerId._id || order.farmerId}`} className="text-green-600 font-bold hover:underline">
                  View {order.farmerId.name}'s Shop
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}