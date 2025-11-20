// src/pages/FarmerProfile.jsx   ← FINAL FIXED VERSION
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";  // ← ADDED
import { MapPin, Phone, ShoppingBag, User, ArrowLeft } from "lucide-react";

export default function FarmerProfile() {
  const { farmerId } = useParams();
  const { user } = useAuth();  // ← Now we know if user is logged in
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Force login to view any farmer profile
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [farmerRes, productsRes] = await Promise.all([
          API.get(`/auth/users/${farmerId}`),
          API.get(`/products/farmer/${farmerId}`),
        ]);
        setFarmer(farmerRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Failed to load farmer profile:", err);
        if (err.response?.status === 404) {
          setFarmer(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmerId, user, navigate]);

  if (!user) return null; // Will redirect to login

  if (loading) {
    return (
      <div className="text-center py-32 text-2xl text-gray-600">
        Loading farmer's shop...
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="text-center py-32">
        <p className="text-3xl text-red-600 font-bold mb-4">Farmer Not Found</p>
        <Link to="/products" className="text-green-600 hover:underline text-xl">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-lg mb-8 hover:underline"
      >
        <ArrowLeft className="w-6 h-6" />
        Back to Products
      </Link>

      {/* Farmer Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-3xl p-10 mb-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="bg-white/20 backdrop-blur-lg rounded-full p-8 border-4 border-white/30">
            <User className="w-32 h-32 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold mb-3">{farmer.name}'s Farm</h1>
            <p className="text-2xl opacity-90 mb-6">Fresh from the farm to your table</p>
            <div className="flex flex-wrap gap-8 justify-center md:justify-start text-lg font-medium">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                {farmer.location || "Kenya"}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6" />
                {farmer.phone}
              </div>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                {products.length} Product{products.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <h2 className="text-4xl font-bold text-gray-800 mb-10">Available Products</h2>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl">
          <p className="text-2xl text-gray-600">No products listed yet.</p>
          <p className="text-lg text-gray-500 mt-2">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}