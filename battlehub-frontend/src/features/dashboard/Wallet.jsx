import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(120); // mock starting balance
  const [upiId, setUpiId] = useState("raju@upi");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // ✅ Save or update UPI ID
  const handleUpiSave = (e) => {
    e.preventDefault();
    if (!upiId.trim()) {
      alert("Please enter a valid UPI ID!");
      return;
    }
    alert(`✅ UPI ID updated to ${upiId}`);
  };

  // ✅ Withdraw request
  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!upiId) return alert("Please set your UPI ID first!");
    if (!withdrawAmount || withdrawAmount <= 0)
      return alert("Enter valid withdraw amount!");
    if (withdrawAmount > balance)
      return alert("Insufficient balance in wallet!");

    alert(`🪙 Withdraw request for ₹${withdrawAmount} sent for approval.`);
    setWithdrawAmount("");
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900/80 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
      {/* Title */}
      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
        My Wallet 💰
      </h2>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-2xl p-5 mb-8 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-sm opacity-80">Available Balance</p>
          <h3 className="text-3xl font-bold">₹{balance}</h3>
        </div>
        <button
          onClick={() => navigate("/dashboard/recharge")}
          className="bg-black text-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-all"
        >
          + Add Balance
        </button>
      </div>

      {/* UPI Section */}
      <form
        onSubmit={handleUpiSave}
        className="bg-gray-800 p-5 rounded-xl mb-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">
          UPI ID Settings
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI ID (e.g., raju@upi)"
            className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-400 text-white"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg transition-all"
          >
            Save
          </button>
        </div>
      </form>

      {/* Withdraw Form */}
      <form
        onSubmit={handleWithdraw}
        className="bg-gray-800 p-5 rounded-xl border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">
          Withdraw Money
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-400 text-white"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg transition-all"
          >
            Withdraw
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Withdrawals will be processed within 24 hours after approval.
        </p>
      </form>

      {/* Transaction History (coming soon) */}
      <div className="mt-8 bg-gray-800 p-5 rounded-xl border border-gray-700 text-center text-gray-400 text-sm">
        🕒 Transaction history will appear here once integrated with backend.
      </div>
    </div>
  );
}
