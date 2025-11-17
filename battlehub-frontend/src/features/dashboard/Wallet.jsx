import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EncryptedStorage from "../../utils/encryptedStorage";
import api from "../../utils/api";

export default function Wallet() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;
  const token = user?.token;

  // ✅ Fetch Balance from backend
  const fetchBalance = async () => {
    try {
      const res = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBalance(res.data.user.walletBalance||0);
      EncryptedStorage.set("user_balance", res.data.user.walletBalance);
      setUpiId(res.data.user.upi || "");
    } catch (err) {
      console.error("Balance Fetch Error", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // ✅ Save or update UPI ID (API)
  const handleUpiSave = async (e) => {
    e.preventDefault();
   const userId= JSON.parse(EncryptedStorage.get("battlehub_user")).userId;
    if (!upiId.trim()) return alert("Please enter a valid UPI ID!");

    try {
      setLoading(true);
      const res = await api.put(
        `/users/${userId}/updateUser`,
        {upiId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("UPI ID updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update UPI ID.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Withdraw request (API)
  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!upiId) return alert("Please set your UPI ID first!");
    if (!withdrawAmount || withdrawAmount <= 0)
      return alert("Enter valid withdraw amount!");
    if (withdrawAmount > balance)
      return alert("Insufficient balance!");

    try {
      setWithdrawLoading(true);

      const res = await api.post(
        `/wallet/withdraw`,
        {
          userId,
          amount: Number(withdrawAmount),
          upiId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Withdraw request of ₹${withdrawAmount} submitted!`);
      setWithdrawAmount("");

      fetchBalance(); // refresh balance
    } catch (err) {
      console.error(err);
      alert("Failed to submit withdrawal request.");
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900/80 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
        My Wallet 💰
      </h2>

      {/* Wallet Balance */}
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
            className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
          />

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>

      {/* Withdraw */}
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
            className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
          />

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg flex items-center justify-center"
          >
            {withdrawLoading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Withdraw"
            )}
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-2">
          Withdrawals will be processed within 24 hours after approval.
        </p>
      </form>

      {/* Transaction History Placeholder */}
      <div className="mt-8 bg-gray-800 p-5 rounded-xl border border-gray-700 text-center text-gray-400 text-sm">
        🕒 Transaction history will appear here once integrated with backend.
      </div>
    </div>
  );
}
