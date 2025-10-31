import { useState, useEffect } from "react";
import API from "../api/axiosInstance"; // Make sure your axios instance attaches the JWT token

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders"); // JWT token sent via axios instance
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err);
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
    }
  };

  // Handle add order
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/orders", {
        productId: selectedProduct,
        quantity: Number(quantity),
      });
      // Add new order at the top of the list
      setOrders([res.data.order, ...orders]);
      setQuantity("");
    } catch (err) {
      console.error("Error adding order:", err.response?.data || err);
    }
  };

  // Handle delete order
  const handleDelete = async (id) => {
    try {
      await API.delete(`/orders/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {/* Add Order Form */}
      <form className="flex gap-2 mb-6" onSubmit={handleAdd}>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
          required
        >
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} (${product.pricePerKg})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="border px-3 py-2 rounded w-32"
          required
          min={1}
        />

        <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          Add Order
        </button>
      </form>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map((order) => {
          const product = products.find((p) => p._id === order.productId._id || p._id === order.productId);
          return (
            <div
              key={order._id}
              className="bg-white shadow rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{product ? product.name : "Deleted Product"}</p>
                <p className="text-gray-600">Quantity: {order.quantity}</p>
                <p className="text-gray-600">
                  Total Price: ${order.totalPrice?.toFixed(2) || 0}
                </p>
              </div>
              <button
                onClick={() => handleDelete(order._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
