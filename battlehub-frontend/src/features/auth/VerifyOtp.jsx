import { useState } from "react";
import api from "../../utils/api";

export default function VerifyOtp({ email }) {
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(2);

  const verifyOtp = async () => {
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      alert("OTP Verified!");
      setStep(3);
    } catch (err) {
      alert("Invalid or expired OTP");
    }
  };

  return step === 2 ? (
    <div>
      <h3>Enter OTP</h3>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify OTP</button>
    </div>
  ) : (
    <ResetPassword email={email} />
  );
}
