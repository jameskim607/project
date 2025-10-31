import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Buttons to navigate to nested routes */}
      <div className="flex gap-4 mb-6">
        <Link
          to="products"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Products
        </Link>
        <Link
          to="orders"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Orders
        </Link>
      </div>

      {/* Nested routes render here */}
      <Outlet />
    </div>
  );
}
