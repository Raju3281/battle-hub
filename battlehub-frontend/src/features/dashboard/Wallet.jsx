import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EncryptedStorage from "../../utils/encryptedStorage";
import api from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";

export default function Wallet() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [transactions, setTransactions] = useState([]); // 🆕 History list

  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;
  const token = user?.token;

  // 🟡 Convert base64 from Mongo to image URL
  const getImageUrl = (screenshot) => {
    if (!screenshot?.data) return "";
    const base64String = btoa(
      new Uint8Array(screenshot.data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:${screenshot.contentType};base64,${base64String}`;
  };

  // ✅ Fetch Wallet Balance
  const fetchBalance = async () => {
    try {
      const res = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBalance(res.data.user.walletBalance || 0);
      EncryptedStorage.set("user_balance", res.data.user.walletBalance);
      setUpiId(res.data.user.upi || "");
    } catch (err) {
      console.error("Balance Fetch Error", err);
    }
  };

  // 🆕 Fetch Transaction History
  const fetchHistory = async () => {
    try {
      const res = await api.get(`/wallet/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("History Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchHistory(); // 🆕 Load history too
  }, []);

  // Save UPI
  const handleUpiSave = async (e) => {
    e.preventDefault();
    if (!upiId.trim()) return toast.error("Please enter a valid UPI ID!");

    try {
      setLoading(true);
      await api.put(
        `/users/${userId}/updateUser`,
        { upiId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("UPI ID updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update UPI ID.");
    } finally {
      setLoading(false);
    }
  };

  // Withdraw Money
  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!upiId) return toast.error("Please set your UPI ID first!");
    if (!withdrawAmount || withdrawAmount <= 0)
      return toast.error("Enter valid withdraw amount!");
    if (withdrawAmount < 50)
      return toast.error("Minimum withdraw amount is ₹50");
    if (withdrawAmount > balance)
      return toast.error("Insufficient balance!");

    try {
      setWithdrawLoading(true);

      await api.post(
        `/wallet/withdraw`,
        {
          userId,
          amount: Number(withdrawAmount),
          upiId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Withdraw request of ₹${withdrawAmount} submitted!`);
      setWithdrawAmount("");

      fetchBalance();
      fetchHistory(); // refresh history
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit withdrawal request.");
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900/80 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
      <ToastContainer theme="dark" position="top-right" />
      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
        My Wallet 💰
      </h2>

      {/* BALANCE */}
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

      {/* UPI SECTION */}
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

      {/* WITHDRAW SECTION */}
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
        <p className="text-yellow-400 text-sm mt-2">
          Minimum amount for withdrawal is 50 Rs</p>
        <p className="text-gray-400 text-sm mt-2">
          Withdrawals will be processed within 24 hours.
        </p>
      </form>

      {/* =============================== */}
      {/* 🟦 TRANSACTION HISTORY SECTION */}
      {/* =============================== */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">
          Transaction History 🕒
        </h3>

        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center">No transactions yet.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {t.type === "credit" ? "Credited" : "Debited"}:{" "}
                    <span
                      className={
                        t.type === "credit"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      ₹{t.amount}
                    </span>
                  </p>

                  <p className="text-gray-400 text-sm capitalize">
                    Status:{" "}
                    <span
                      className={
                        t.status === "approved"
                          ? "text-green-400"
                          : t.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    >
                      {t.status}
                    </span>
                  </p>

                  <p className="text-gray-500 text-xs">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Screenshot Preview if available */}
                {t.screenshot && (
                  <img
                    src={getImageUrl(t.screenshot)}
                    alt="proof"
                    className="w-16 h-16 object-cover rounded border border-gray-700"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
