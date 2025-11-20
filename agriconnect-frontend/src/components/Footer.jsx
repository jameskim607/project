// src/components/Footer.jsx   ← NEW FILE
export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="text-4xl font-bold mb-3">AgriConnect</div>
        <p className="mb-6 opacity-90">
          Connecting Kenyan farmers directly to buyers
        </p>
        <p className="text-sm opacity-70">
          © 2025 AgriConnect • Made with love for Kenya's agriculture
        </p>
      </div>
    </footer>
  );
}