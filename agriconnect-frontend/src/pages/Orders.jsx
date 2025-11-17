import { useState, useEffect } from "react";
import API from "../api/axiosInstance"; // Make sure your axios instance attaches the JWT token

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders"); // JWT token sent via axios instance
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err);
      setError("Failed to fetch orders");
    }
  };

  // Fetch all products for the dropdown
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      if (res.data.length > 0) setSelectedProduct(res.data[0]._id);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err);
      setError("Failed to fetch products");
    }
  };

  // Handle add order
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProduct || !quantity) {
      setError("Please select a product and quantity");
      return;
    }

    try {
      const res = await API.post("/orders", {
        productId: selectedProduct,
        quantity: Number(quantity),
      });
      // Add new order at the top of the list
      setOrders([res.data.order, ...orders]);
      setQuantity("");
      setSuccess("Order placed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to place order";
      console.error("Error adding order:", err.response?.data || err);
      setError(errorMsg);
    }
  };

  // Handle delete order
  const handleDelete = async (id) => {
    try {
      await API.delete(`/orders/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
      setSuccess("Order deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete order";
      console.error("Error deleting order:", err.response?.data || err);
      setError(errorMsg);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Order Form */}
      <form className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200" onSubmit={handleAdd}>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Place New Order</h3>
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} (₹{product.pricePerKg}/kg)
              </option>
            ))}
          </select>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity (kg)"
            className="border border-gray-300 px-4 py-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            min={1}
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
          >
            Add Order
          </button>
        </div>
      </form>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 && (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No orders yet. Start placing orders!</p>
          </div>
        )}
        {orders.map((order) => {
          const product = products.find((p) => p._id === order.productId._id || p._id === order.productId);
          const statusColors = {
            pending: "bg-yellow-100 text-yellow-800",
            accepted: "bg-blue-100 text-blue-800",
            rejected: "bg-red-100 text-red-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
          };
          return (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800">{product ? product.name : "Deleted Product"}</h4>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>Quantity: <span className="font-semibold">{order.quantity} kg</span></p>
                    <p>Total Price: <span className="font-semibold text-green-600">KSh {order.totalPrice?.toFixed(2) || 0}</span></p>
                    <p>Date: <span className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(order._id)}
                className="text-red-600 hover:text-red-800 font-semibold text-sm transition"
              >
                Delete Order
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
