import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", category: "", pricePerKg: "", quantity: "", imageFile: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", category: "", pricePerKg: "", quantity: "", imageFile: null });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (form.imageFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v !== null) fd.append(k, v); });
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.post('/products', form);
      }
      setForm({ name: "", description: "", category: "", pricePerKg: "", quantity: "", imageFile: null });
      setSuccess('Product added successfully!');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error adding product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setSuccess('Product deleted');
      fetchProducts();
      setShowDelete(false);
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editForm.imageFile) {
        const fd = new FormData();
        Object.entries(editForm).forEach(([k, v]) => { if (v !== null) fd.append(k, v); });
        await API.put(`/products/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.put(`/products/${editId}`, editForm);
      }
      setIsEditing(false);
      setEditId(null);
      setSuccess('Product updated');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-10">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">🌾 Manage Your Products</h2>

      {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">{success}</div>}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Add New Product</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input className="w-full p-2 border rounded" placeholder="Name*" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
              <input className="w-full p-2 border rounded" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
              <input className="w-full p-2 border rounded" placeholder="Category" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} />
              <input className="w-full p-2 border rounded" placeholder="Price per Kg*" type="number" step="0.01" value={form.pricePerKg} onChange={(e)=>setForm({...form, pricePerKg: e.target.value})} required />
              <input className="w-full p-2 border rounded" placeholder="Quantity*" type="number" value={form.quantity} onChange={(e)=>setForm({...form, quantity: e.target.value})} required />
              <div>
                <label className="block text-sm mb-1">Photo (optional)</label>
                <input type="file" accept="image/*" onChange={(e)=>setForm({...form, imageFile: e.target.files[0]})} />
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded" type="submit">Add Product</button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Your Products ({products.length})</h3>
            {products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No products listed yet.</div>
            ) : (
              <div className="grid gap-4">
                {products.map(p => (
                  <div key={p._id} className="border rounded p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/product/${p._id}`} className="block">
                          {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-28 object-cover rounded mb-2" />}
                          <div className="font-bold text-lg text-gray-800 dark:text-gray-100">{p.name}</div>
                        </Link>
                        <div className="text-sm text-gray-600 dark:text-gray-300">KSh {parseFloat(p.pricePerKg).toFixed(2)}/kg • {p.quantity} kg</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={()=>{ setEditId(p._id); setEditForm({ name: p.name||'', description: p.description||'', category: p.category||'', pricePerKg: p.pricePerKg||'', quantity: p.quantity||'', imageFile: null }); setIsEditing(true); }}>Edit</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>{ setDeleteId(p._id); setShowDelete(true); }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Confirm delete</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Are you sure?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={()=>setShowDelete(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button onClick={()=>handleDelete(deleteId)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Edit Product</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 mt-3">
              <input className="w-full p-2 border rounded" value={editForm.name} onChange={(e)=>setEditForm({...editForm, name: e.target.value})} required />
              <input className="w-full p-2 border rounded" value={editForm.description} onChange={(e)=>setEditForm({...editForm, description: e.target.value})} />
              <input className="w-full p-2 border rounded" value={editForm.category} onChange={(e)=>setEditForm({...editForm, category: e.target.value})} />
              <input className="w-full p-2 border rounded" type="number" step="0.01" value={editForm.pricePerKg} onChange={(e)=>setEditForm({...editForm, pricePerKg: e.target.value})} required />
              <input className="w-full p-2 border rounded" type="number" value={editForm.quantity} onChange={(e)=>setEditForm({...editForm, quantity: e.target.value})} required />
              <div>
                <label className="text-sm mb-1 block">Replace photo (optional)</label>
                <input type="file" accept="image/*" onChange={(e)=>setEditForm({...editForm, imageFile: e.target.files[0]})} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={()=>{ setIsEditing(false); setEditId(null); }} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
