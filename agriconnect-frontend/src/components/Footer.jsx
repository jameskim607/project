export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-3xl">🌾</span>
              AgriConnect
            </h3>
            <p className="text-green-100 text-sm leading-relaxed">
              Connecting farmers and buyers for sustainable agriculture and fair trade.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/login" className="hover:text-white transition">Login</a></li>
              <li><a href="/register" className="hover:text-white transition">Register</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>Email: jamesmbugua607@gmail.com</li>
              <li>Phone: +254703654095</li>
              <li>Location: Across Kenya</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-green-100 text-sm">
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-100 text-sm">
              &copy; 2025 AgriConnect. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-green-100 hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="text-green-100 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-green-100 hover:text-white transition">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;