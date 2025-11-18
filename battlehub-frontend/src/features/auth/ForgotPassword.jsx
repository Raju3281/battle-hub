import { useState } from "react";
import api from "../../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()?_=+<>/.,;:'"-])(?=.*[a-zA-Z\d]).{8,}$/;
    return regex.test(password);
  };

  const sendOtp = async () => {
    if (!email) return alert("Please enter your email.");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password-otp", { email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      alert("OTP verified!");
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword) return alert("Enter new password");
    if (!validatePassword(newPassword)) {
      setPasswordError("Must include 1 uppercase, 1 symbol, and 8+ characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, newPassword });
      alert("Password reset successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900/90 backdrop-blur-md text-white w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-8 mx-auto">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-6">
          {step === 1 && "Forgot Password 🔐"}
          {step === 2 && "Verify OTP 📩"}
          {step === 3 && "Reset Password 🔑"}
        </h2>

        {/* STEP 1 — Enter Email */}
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium mb-2">Enter your Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 placeholder-gray-500 text-sm"
              placeholder="Enter your email"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 rounded-lg mt-4"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 — Enter OTP */}
        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 placeholder-gray-500 text-sm"
              placeholder="Enter 6-digit OTP"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 rounded-lg mt-4"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3 — Reset Password */}
        {step === 3 && (
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Enter New Password</label>
            <input
              type={showPassword?"text":"password"}
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError(
                  validatePassword(e.target.value)
                    ? ""
                    : "Must include 1 uppercase, 1 symbol, & 8+ characters"
                );
              }}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 placeholder-gray-500 text-sm"
              placeholder="Enter new password"
            />
             <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
            {passwordError && (
              <p className="text-red-400 text-xs mt-1">{passwordError}</p>
            )}

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 rounded-lg mt-4"
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>
          </div>
        )}

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
