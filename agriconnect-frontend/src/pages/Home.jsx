import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-6xl">🌾</div>
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-4">
            Welcome to AgriConnect
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            A revolutionary platform connecting farmers and buyers directly, 
            promoting fair trade, sustainable agriculture, and reducing post-harvest losses.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition duration-200 shadow-md"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition duration-200 shadow-md"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg border-2 border-green-600 hover:bg-green-50 transition duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Why Choose AgriConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 p-8 rounded-lg shadow-md text-center border-t-4 border-green-600">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Direct Connection</h3>
              <p className="text-gray-600">
                Connect directly with farmers and buyers, eliminating middlemen and ensuring fair pricing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 p-8 rounded-lg shadow-md text-center border-t-4 border-green-600">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Fair Pricing</h3>
              <p className="text-gray-600">
                Get competitive prices without hidden charges. Transparent pricing for both farmers and buyers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-green-50 p-8 rounded-lg shadow-md text-center border-t-4 border-green-600">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Support sustainable farming practices and reduce environmental impact through shorter supply chains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-12">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Create Account</h3>
                <p className="text-gray-600">Sign up as a farmer or buyer to get started on AgriConnect.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Browse or List Products</h3>
                <p className="text-gray-600">Farmers list their products, buyers browse and find what they need.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Place Orders</h3>
                <p className="text-gray-600">Buyers place orders directly with farmers at fair prices.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">4</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Complete Transaction</h3>
                <p className="text-gray-600">Complete the transaction and build a sustainable business relationship.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-green-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Agriculture?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of farmers and buyers building a more sustainable future.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-200"
            >
              Start Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
