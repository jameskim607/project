// src/pages/Products.jsx
import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";

export default function Products() {
  const { user } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAddPage = location.pathname === "/products/add";

  useEffect(() => {
    if (!user) return;
    API.get("/products").then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load");
      setLoading(false);
    });
  }, [user]);

  if (!user) return <div className="p-20 text-center text-3xl">Login required</div>;

  if (isAddPage && user.role === "farmer") {
    return (
      <div className="max-w-2xl mx-auto p-10">
        <Link to="/products" className="text-green-600 font-bold">← Back</Link>
        <h1 className="text-4Xl font-bold my-8">Add Product</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.target);
          await API.post("/products", data);
          toast.success("Added!");
          window.location.href = "/products";
        }} className="space-y-6 bg-white p-10 rounded-xl shadow-xl">
          <input name="name" placeholder="Name" required className="w-full p-4 border rounded" />
          <textarea name="description" placeholder="Description" className="w-full p-4 border rounded" />
          <input name="pricePerKg" type="number" placeholder="Price/kg" required className="w-full p-4 border rounded" />
          <input name="quantityAvailable" type="number" placeholder="Kg available" required className="w-full p-4 border rounded" />
          <input type="file" name="image" accept="image/*" className="w-full" />
          <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-xl text-xl font-bold">
            Add Product
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-green-800">
          {user.role === "farmer" ? "My Products" : "All Products"}
        </h1>
        {user.role === "farmer" && (
          <Link to="/products/add" className="bg-green-600 text-white px-8 py-5 rounded-xl text-xl font-bold">
            + Add Product
          </Link>
        )}
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}