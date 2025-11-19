import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function ResetPassword({ email }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()?_=+<>/.,;:'"-])(?=.*[a-zA-Z\d]).{8,}$/;
    return regex.test(password);
  };

  const handleReset = async () => {
    if (newPassword !== confirm) return toast.error("⚠️ Passwords do not match!");

    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Must include 1 uppercase, 1 symbol, and be at least 8 characters."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", { email, newPassword });
      toast.success("🎉 Password reset successful!");
      navigate("/login");
    } catch {
      toast.error("❌ Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
                  <ToastContainer autoClose={1000} theme="dark" position="top-center" />

      <div className="bg-gray-900/90 backdrop-blur-md text-white w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-8 mx-auto">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-6">
          🔑 Reset Password
        </h2>

        {/* Email Display */}
        <p className="text-gray-400 text-sm mb-4 text-center">
          Resetting password for <span className="text-yellow-400">{email}</span>
        </p>

        {/* New Password */}
        <div className="relative mb-4">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type={showPass ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError(
                validatePassword(e.target.value)
                  ? ""
                  : "Must include 1 uppercase, 1 symbol, and be at least 8 characters."
              );
            }}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 placeholder-gray-500 text-sm"
            placeholder="Enter new password"
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-9 cursor-pointer text-gray-400"
          >
            {showPass ? "🙈" : "👁️"}
          </span>
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 placeholder-gray-500 text-sm"
            placeholder="Re-enter new password"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-9 cursor-pointer text-gray-400"
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 rounded-lg mt-2 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Back to{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
