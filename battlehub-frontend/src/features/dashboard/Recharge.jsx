import { useState, useEffect } from "react";
import api from "../../utils/api";
import EncryptedStorage from "../../utils/encryptedStorage";
import { toast, ToastContainer } from "react-toastify";

export default function Recharge() {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("form");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [wallet, setWallet] = useState(
    parseInt(EncryptedStorage.get("user_balance") || 0)
  );
  const [timer, setTimer] = useState(100);

  // Timer for processing screen
  useEffect(() => {
    if (step === "processing" && timer > 0) {
      const t = setTimeout(() => setTimer((n) => n - 1), 1000);
      return () => clearTimeout(t);
    }

    if (timer === 0 && step === "processing") {
      setStep("success");

      const updated = wallet + parseInt(amount);
      setWallet(updated);
      EncryptedStorage.set("user_balance", updated);
    }
  }, [timer, step, amount, wallet]);

  const handleRechargeSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseInt(amount) <= 0) return toast.error("Enter valid amount!");
    if (amount <20) return toast.error("Minimum recharge amount is ₹20");

    setStep("payment");
  };

  // Upload screenshot + submit recharge info
  const handleProofSubmit = async () => {
    if (!uploadFile) return toast.success("Upload screenshot!");
    const userId = JSON.parse(EncryptedStorage.get("battlehub_user")).userId;
     setIsUploading(true);  // ⬅️ START LOADING
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("amount", amount);
      formData.append("userId", userId); // or get from token backend

      const res = await api.post("/wallet/transaction", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStep("processing");
       setIsUploading(true);  // ⬅️ START LOADING
      console.log("Transaction created:", res.data);
    } catch (err) {
      console.error("Error:", err);
       setIsUploading(false);  // ⬅️ START LOADING
      toast.error("Upload failed");
    }
  };
  const getUserBalance = async (id) => {
    const res = await api.get(`/payments/balance/${id}`);
    console.log("Balance fetch", res.data.balance);
    if (res.data.balance !== EncryptedStorage.get("user_balance")) {
      setStep("success")
    }

  }
  useEffect(() => {
    getUserBalance((JSON.parse(EncryptedStorage.get("battlehub_user"))).userId);
  }, [timer]);



  return (
    <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
      <ToastContainer autoClose={1000} theme="dark" position="top-center" />

      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
        Recharge Wallet 💰
      </h2>

      {/* Step 1 — Enter Amount */}
      {step === "form" && (
        <form onSubmit={handleRechargeSubmit} className="flex flex-col items-center gap-5">
          <p className="text-gray-300">
            Wallet Balance: <span className="text-yellow-400 font-bold">₹{wallet}</span>
          </p>

          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg text-center text-lg"
            required
          />
          <span className="text-sm text-gray-400">Minimum recharge amount is ₹20</span>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg">
            Proceed to Pay
          </button>
        </form>
      )}

      {/* Step 2 — Payment Options */}
      {step === "payment" && (
        <div className="text-center flex flex-col items-center gap-5">

          <h3 className="text-xl font-semibold text-yellow-400">Select Payment Method</h3>

          <div className="flex gap-4">
            <button
              onClick={() => setSelectedMethod("upi")}
              className={`px-6 py-3 rounded-lg border ${selectedMethod === "upi" ? "bg-yellow-500 text-black" : "bg-gray-800"
                }`}
            >
              UPI
            </button>

            <button
              onClick={() => setSelectedMethod("qr")}
              className={`px-6 py-3 rounded-lg border ${selectedMethod === "qr" ? "bg-yellow-500 text-black" : "bg-gray-800"
                }`}
            >
              QR Code
            </button>
          </div>

          {/* UPI SECTION */}
          {selectedMethod === "upi" && (
            <div>
              <p className="text-gray-300 mt-4">Pay using UPI ID</p>

              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg text-yellow-400">
                  9515227207-2@ybl
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText("9515227207-2@ybl")}
                  className="bg-yellow-500 text-black px-3 py-1 rounded-lg"
                >
                  Copy
                </button>
              </div>

              <p className="text-sm text-gray-400 mt-4">Upload Screenshot</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="mt-3"
              />

              <button
                disabled={!uploadFile || isUploading}
                onClick={handleProofSubmit}
                className={`mt-5 px-6 py-3 rounded-lg font-semibold ${uploadFile ? "bg-yellow-500" : "bg-gray-700 cursor-not-allowed"
                  }`}
              >
                {isUploading ? "Uploading..." : "Submit Payment Proof"}
              </button>
            </div>
          )}

          {/* QR SECTION */}
          {selectedMethod === "qr" && (
            <div>
              <p className="text-gray-300 mt-4">Scan QR to Pay</p>

              <img
                src={"/QR.jpg"}
                className="mx-auto border border-gray-700 rounded-xl my-4"
                alt="QR Code"
                width={250}
                height={250}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="mt-3"
              />

              <button
                disabled={!uploadFile || isUploading}
                onClick={handleProofSubmit}
                className={`mt-5 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${uploadFile ? "bg-yellow-500" : "bg-gray-600 cursor-not-allowed"
                  }`}
              >
                {isUploading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Uploading...
                  </>
                ) : (
                  "Submit Payment Proof"
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Processing */}
      {step === "processing" && (
        <div className="text-center mt-10">
          <div className="animate-spin w-14 h-14 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-300 mt-4">Payment under review…</p>
          <p className="text-yellow-400 mt-2 font-semibold">{timer}s remaining</p>

          <p className="text-yellow-400 mt-2 text-sm">It may take 2-3 minutes , you can ga back</p>

        </div>
      )}

      {/* Step 4 — Success */}
      {step === "success" && (
        <div className="text-center mt-8">
          <div className="w-16 h-16 flex items-center justify-center mx-auto bg-green-500 text-white text-3xl rounded-full">
            ✓
          </div>

          <h3 className="text-xl text-green-400 font-bold mt-3">Recharge Successful!</h3>
          <p className="text-gray-300 mt-2">₹{amount} added to your wallet 🎉</p>

          <button
            onClick={() => {
              setStep("form");
              setAmount("");
              setSelectedMethod("");
              setUploadFile(null);
              setTimer(10);
            }}
            className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-lg"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
