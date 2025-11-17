export default function HelpSupport() {
  // Your WhatsApp Number (No +, No spaces)
  const whatsappNumber = "919515227207";

  // Pre-filled message
  const message = encodeURIComponent("Hello, I need support regarding my account.");

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg text-white">

      {/* Heading */}
      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
        Help & Support 💬
      </h2>

      <p className="text-gray-300 text-center mb-4">
        We are here to help you 24/7.  
        Contact us on WhatsApp for fast support.
      </p>

      {/* WhatsApp Box */}
      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 text-center">

        <h3 className="text-lg font-semibold text-green-400 mb-3">
          WhatsApp Support
        </h3>

        <p className="text-gray-300 mb-4">
          Click the button below to chat with us directly on WhatsApp.
        </p>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 mx-auto w-fit"
        >
          <span>💬</span> Chat on WhatsApp
        </a>

      </div>

      {/* Additional Info */}
      <div className="text-center text-gray-400 mt-6 text-sm">
        Response Time: <span className="text-yellow-400">1–5 minutes</span>  
      </div>
    </div>
  );
}
