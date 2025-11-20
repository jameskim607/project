// src/pages/Home.jsx   ← FINAL VERSION
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // ← use useAuth now

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-6xl">AgriConnect</div>
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-4">
            Welcome to AgriConnect
          </h1>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
            Connecting Kenyan farmers directly to buyers — fair prices, no middlemen, real impact.
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg transition"
            >
              Browse Products
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="bg-white text-green-600 border-2 border-green-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-800 transition"
                >
                  Sign Up Free
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-800 shadow-lg transition"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Rest of your beautiful sections stay the same */}
      {/* Features, How It Works, CTA — keep exactly as you had */}
      {/* I'll only show the CTA update below */}

      {/* CTA Section - Updated */}
      <section className="py-16 px-6 bg-green-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Agriculture?</h2>
          <p className="text-lg mb-10 opacity-90">
            Join thousands of farmers and buyers building a better Kenya.
          </p>
          {!user && (
            <div className="flex gap-6 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition"
              >
                Start Free Today
              </Link>
              <Link
                to="/products"
                className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-white hover:text-green-700 transition"
              >
                Browse Products →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;