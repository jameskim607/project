import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [success, setSuccess] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();

    // increment view (call protected endpoint - it's OK for guest to not be logged in)
    const increment = async () => {
      try {
        await API.post(`/products/${id}/view`);
      } catch (err) {
        // ignore view errors
      }
    };
    increment();
  }, [id]);

  const handleOrder = async () => {
    if (!product) return;
    try {
      await API.post("/orders", { productId: product._id, quantity: Number(quantity) });
      setSuccess("Order placed successfully");
      setTimeout(() => setSuccess(""), 3000);
      navigate("/dashboard/orders");
    } catch (err) {
      console.error("Order error", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to place order");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/products/${id}/reviews`, { rating: review.rating, comment: review.comment });
      setSuccess("Review submitted");
      setReview({ rating: 5, comment: "" });
      fetchProduct();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Review error", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-12">
      <div className="bg-white rounded-lg shadow p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded" />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded">No Image</div>
          )}
        </div>

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-green-600 font-semibold mt-2">KSh {parseFloat(product.pricePerKg).toFixed(2)} / kg</p>
          <p className="text-gray-600 mt-4">{product.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Farmer:</span>
              <p className="font-semibold">{product.farmerId?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500">{product.farmerId?.location || ''}</p>
            </div>
            <div>
              <span className="text-gray-600">Available:</span>
              <p className="font-semibold">{product.quantity} kg</p>
              <span className="text-gray-600">Views:</span>
              <p className="font-semibold">{product.views || 0}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-28 p-2 border rounded" />
            <button onClick={handleOrder} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Order Now</button>
            {success && <div className="text-green-700 font-semibold">{success}</div>}
          </div>

          <hr className="my-6" />

          <div>
            <h3 className="text-lg font-bold mb-3">Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-3">
                {product.reviews.map((r) => (
                  <div key={r._id || r.date} className="border rounded p-3">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-xs text-gray-500">{new Date(r.date).toLocaleString()}</div>
                    </div>
                    <div className="text-sm">Rating: {r.rating} / 5</div>
                    {r.comment && <div className="mt-2 text-gray-700">{r.comment}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No reviews yet.</div>
            )}

            <form onSubmit={submitReview} className="mt-4">
              <h4 className="font-semibold mb-2">Leave a review</h4>
              <div className="flex gap-2 items-center">
                <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })} className="p-2 border rounded">
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
                <input value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Comment (optional)" className="flex-1 p-2 border rounded" />
                <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
