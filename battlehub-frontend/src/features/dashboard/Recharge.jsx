import { useState, useEffect } from "react";

export default function Recharge() {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("form"); // form | payment | processing | success
  const [selectedMethod, setSelectedMethod] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [wallet, setWallet] = useState(120); // mock wallet amount
  const [timer, setTimer] = useState(10); // mock processing time (seconds)

  // simulate approval timer
  useEffect(() => {
    if (step === "processing" && timer > 0) {
      const t = setTimeout(() => setTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    } else if (timer === 0 && step === "processing") {
      setStep("success");
      setWallet((prev) => prev + parseInt(amount || 0));
    }
  }, [timer, step, amount]);

  const handleRechargeSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseInt(amount) <= 0) return alert("Enter a valid amount!");
    setStep("payment");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setStep("processing");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/80 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
        Recharge Wallet 💰
      </h2>

      {/* Step 1 - Enter amount */}
      {step === "form" && (
        <form
          onSubmit={handleRechargeSubmit}
          className="flex flex-col gap-5 items-center"
        >
          <p className="text-gray-300 text-sm">
            Current Wallet Balance:{" "}
            <span className="text-yellow-400 font-semibold">₹{wallet}</span>
          </p>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-64 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 text-center text-lg text-white"
            required
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200"
          >
            Proceed to Pay
          </button>
        </form>
      )}

      {/* Step 2 - Payment options */}
      {step === "payment" && (
        <div className="text-center flex flex-col items-center gap-5">
          <h3 className="text-xl font-semibold text-yellow-400">
            Select Payment Method
          </h3>

          <div className="flex gap-4">
            <button
              onClick={() => setSelectedMethod("upi")}
              className={`px-6 py-3 rounded-lg border ${
                selectedMethod === "upi"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
            >
              UPI
            </button>
            <button
              onClick={() => setSelectedMethod("qr")}
              className={`px-6 py-3 rounded-lg border ${
                selectedMethod === "qr"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
            >
              QR Code
            </button>
          </div>

          {/* Show UPI / QR section */}
          {selectedMethod === "upi" && (
            <div className="mt-6 text-center">
              <p className="text-gray-300">Pay using UPI ID below 👇</p>
              <div className="flex justify-center items-center gap-3 mt-3">
                <span className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-yellow-400 font-semibold">
                  battlehub@upi
                </span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText("battlehub@upi")
                  }
                  className="text-sm bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-3 py-1 rounded-lg"
                >
                  Copy
                </button>
              </div>

              <p className="text-sm text-gray-400 mt-4">
                After payment, upload screenshot below 👇
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mt-3 text-gray-300"
              />
            </div>
          )}

          {selectedMethod === "qr" && (
            <div className="mt-6 text-center">
              <p className="text-gray-300">Scan QR code below 👇</p>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?data=battlehub@upi&size=180x180"
                alt="QR Code"
                className="mx-auto my-4 border border-gray-700 rounded-xl"
              />
              <p className="text-sm text-gray-400">
                After payment, upload screenshot below 👇
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mt-3 text-gray-300"
              />
            </div>
          )}
        </div>
      )}

      {/* Step 3 - Processing */}
      {step === "processing" && (
        <div className="text-center mt-8">
          <div className="animate-spin border-4 border-yellow-400 border-t-transparent rounded-full w-14 h-14 mx-auto mb-4"></div>
          <p className="text-gray-300">Payment under review...</p>
          <p className="text-yellow-400 font-semibold mt-2">
            Approving in {timer}s
          </p>
        </div>
      )}

      {/* Step 4 - Success */}
      {step === "success" && (
        <div className="text-center mt-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 text-white flex items-center justify-center rounded-full text-3xl">
            ✓
          </div>
          <h3 className="text-xl font-bold text-green-400">
            Recharge Successful!
          </h3>
          <p className="text-gray-300 mt-2">
            ₹{amount} added to your wallet 🎉
          </p>
          <p className="text-yellow-400 mt-4 font-semibold">
            New Wallet Balance: ₹{wallet}
          </p>

          <button
            onClick={() => {
              setStep("form");
              setAmount("");
              setTimer(5);
              setSelectedMethod("");
              setUploadFile(null);
            }}
            className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
