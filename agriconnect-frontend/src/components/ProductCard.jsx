import { FaTrash } from "react-icons/fa";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="bg-white shadow rounded p-4 flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
      <button
        onClick={() => onDelete(product._id)}
        className="text-red-500 hover:text-red-700"
      >
        <FaTrash />
      </button>
    </div>
  );
}
