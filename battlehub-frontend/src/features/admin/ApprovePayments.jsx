import React, { useState } from "react";
import EncryptedStorage from "../../utils/encryptedStorage";

export default function ApprovePayments() {
  // 🧾 Dummy data — simulating real user payment uploads
  const [payments, setPayments] = useState([
    {
      id: 1,
      username: "Raju",
      userId: "u001",
      amount: 150,
      upi: "raju@upi",
      screenshot:
        "https://i.ibb.co/ZKysHDk/phonepe-payment-receipt.jpg", // ✅ PhonePe-style screenshot
      approved: false,
    },
    {
      id: 2,
      username: "John",
      userId: "u002",
      amount: 100,
      upi: "john@upi",
      screenshot:
        "https://i.ibb.co/ypgf4QF/gpay-transaction-receipt.jpg", // ✅ GPay-style screenshot
      approved: false,
    },
    {
      id: 3,
      username: "Arjun",
      userId: "u003",
      amount: 200,
      upi: "arjun@upi",
      screenshot:
        "https://i.ibb.co/X2RXgcx/paytm-transaction-receipt.jpg", // ✅ Paytm-style screenshot
      approved: false,
    },
    {
      id: 4,
      username: "Ravi",
      userId: "u004",
      amount: 300,
      upi: "ravi@upi",
      screenshot:
        "https://i.ibb.co/QvLQ7VZ/googlepay-payment-receipt.jpg", // ✅ GPay mock
      approved: false,
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  // 💰 Approve function
  const handleApprove = (paymentId, userId, amount) => {
    const key = `user_wallet_${userId}`;
    const currentBalance = EncryptedStorage.get(key) || 0;
    const updatedBalance = currentBalance + amount;

    // Update encrypted storage (simulating backend balance update)
    EncryptedStorage.set(key, updatedBalance);

    // Update UI
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, approved: true } : p
      )
    );

    alert(
      `✅ Approved ₹${amount} for ${userId}\n💰 New Balance: ₹${updatedBalance}`
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Approve User Payments 💳
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {payments.map((p) => (
          <div
            key={p.id}
            className={`rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-md transition transform hover:scale-[1.01] ${
              p.approved ? "opacity-60" : ""
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-yellow-400">{p.username}</h3>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  p.approved ? "bg-green-600" : "bg-yellow-600"
                }`}
              >
                {p.approved ? "Approved" : "Pending"}
              </span>
            </div>

            {/* Details */}
            <p className="text-gray-400 text-sm mb-1">User ID: {p.userId}</p>
            <p className="text-gray-400 text-sm mb-1">
              Amount: <span className="text-yellow-400">₹{p.amount}</span>
            </p>
            <p className="text-gray-400 text-sm mb-3">UPI: {p.upi}</p>

            {/* Screenshot Preview */}
            <div className="mb-3">
              <img
                src={p.screenshot}
                alt={`${p.username}'s payment`}
                className="rounded border border-gray-700 cursor-pointer hover:opacity-80 h-48 w-full object-cover"
                onClick={() => setSelectedImage(p.screenshot)}
              />
            </div>

            {/* Action Buttons */}
            {!p.approved && (
              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedImage(p.screenshot)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View
                </button>

                <button
                  onClick={() => handleApprove(p.id, p.userId, p.amount)}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Screenshot Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full Screenshot"
            className="max-w-3xl max-h-[90vh] rounded shadow-lg border border-yellow-500"
          />
        </div>
      )}
    </div>
  );
}
