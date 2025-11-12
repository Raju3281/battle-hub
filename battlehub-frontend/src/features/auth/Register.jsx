import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // ✅ common axios instance

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // ✅ using common API instance
      const { data } = await api.post("/auth/register", {
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
      });

      if (data?.message?.includes("success") || data?.success) {
        alert("🎉 Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert(data?.message || "Registration completed.");
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      alert(
        error.response?.data?.message ||
          "❌ Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br rounded-lg to-black flex items-center justify-center p-4">
      {/* Container */}
      <div
        className="
        bg-gray-900/90 backdrop-blur-md text-white
        w-full max-w-sm sm:max-w-md md:max-w-lg
        rounded-2xl shadow-2xl border border-gray-800
        p-6 sm:p-8 mx-auto
      "
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-6">
          BattleHub Sign Up ⚔️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter your gamer ID"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Re-enter password"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 sm:py-2.5 rounded-lg mt-4 text-sm sm:text-base transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-yellow-400 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
