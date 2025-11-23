import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // ⬅️ New state
  // ⬅️ Add these states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()?_=+<>/.,;:'"-])(?=.*[a-zA-Z\d]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError(
          "Must be at least 8 characters, include 1 uppercase & 1 symbol."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("⚠️ Passwords do not match!");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("⚠️ Invalid password format!");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", {
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode || "",
      });

      toast.error("🎉 Registration successful! You can now log in.");
      navigate("/login");

    } catch (error) {
      console.error("❌ Registration Error:", error);
      toast.error(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br rounded-lg to-black flex items-center justify-center p-4">
      <ToastContainer autoClose={1000} theme="dark" position="top-center" />

      <div className="bg-gray-900/90 backdrop-blur-md text-white w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-8 mx-auto">
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
              placeholder="Enter your username"
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
              onChange={(e) => {
                if (e.target.value.length > 11) return;
                handleChange(e)
              }}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter your email address"
            />
            <p className="text-xs text-gray-400 mt-1">
              📩 Email is used to send Room ID & Password for matches, and also to recover your account incase you forgot your password.            </p>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Create New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}

          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}  // 👈 Dynamic type
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Re-enter password"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-400"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Referral Code</label>
            <input
              type="text"
              name="referralCode"
              required
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter Referral Code (Optional)"
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 sm:py-2.5 rounded-lg mt-4 text-sm sm:text-base transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
