import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    pricePerKg: "",
    quantity: "",
    imageUrl: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", form);
      setForm({
        name: "",
        description: "",
        category: "",
        pricePerKg: "",
        quantity: "",
        imageUrl: "",
      });
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      <form onSubmit={handleSubmit} className="grid gap-3 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price per Kg"
          value={form.pricePerKg}
          onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-3">Your Products</h3>
      <div className="grid gap-4">
        {products.map((p) => (
          <div key={p._id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <h4 className="font-bold">{p.name}</h4>
              <p>{p.description}</p>
              <p><strong>Price:</strong> {p.pricePerKg} /kg</p>
              <p><strong>Qty:</strong> {p.quantity}</p>
            </div>
            <button
              onClick={() => {
                setProductToDelete(p._id);
                setShowModal(true);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(productToDelete);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
