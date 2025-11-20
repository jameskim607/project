// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import FarmerProfile from "./pages/FarmerProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/farmer/:farmerId" element={<FarmerProfile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<Products />} />
        <Route path="/products/edit/:id" element={<Products />} />
      </Route>

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<div className="p-10 text-3xl">Welcome!</div>} />
        <Route path="orders" element={<Orders />} />
      </Route>

      <Route path="*" element={<div className="p-20 text-6xl text-center">404</div>} />
    </Routes>
  );
}