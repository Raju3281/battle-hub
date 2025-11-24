import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Auth } from "../../utils/auth"; // your helper for token management
import api from "../../utils/api";
import { LOGIN_URL } from "../../utils/apiConstants";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = Auth.getUser();
    if (user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("⚠️ Please enter both username and password!");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(LOGIN_URL, {
        email,
        password,
      });

      const { token, user } = res.data;

      Auth.login({
        token,
        userId: user._id,
        username: user.username,
        role: user.role,
      });

      toast.success("✅ Login Successful!");

      console.log("Logged in user:", user);
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "❌ Invalid credentials. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 to-black flex justify-center items-center">
      {/* Background Glow */}
            <ToastContainer theme="dark" position="top-right" />

      <div className="absolute -z-10 w-[500px] h-[500px] bg-yellow-500/10 blur-3xl rounded-full"></div>

      {/* Login Card */}
      <div
        className="
        bg-gray-900/90 backdrop-blur-md text-white
        w-full max-w-sm sm:max-w-md md:max-w-lg
        rounded-2xl shadow-2xl border border-gray-800
        p-6 sm:p-8 mx-auto
      "
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-6">
          BattleHub Login ⚔️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter your password"
            />

            {/* Show/Hide Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-yellow-400 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-end text-sm text-gray-400">
            {/* <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-yellow-500 w-4 h-4"
              />
              Remember Me
            </label> */}
            <a href="/forgot-password" className="text-yellow-400 hover:underline font-medium">
              Forgot Password / Username?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 sm:py-2.5 rounded-lg mt-4 text-sm sm:text-base transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* No account */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Don’t have an account?{" "}
          <a
            href="/"
            className="text-yellow-400 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
