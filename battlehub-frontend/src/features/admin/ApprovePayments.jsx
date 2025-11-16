import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../utils/api";
import EncryptedStorage from "../../utils/encryptedStorage";

export default function ApprovePayments() {
  const [payments, setPayments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState("");


  const getImageUrl = (screenshot) => {
    if (!screenshot?.data) return "";

    const base64String = btoa(
      new Uint8Array(screenshot.data.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    return `data:${screenshot.contentType};base64,${base64String}`;
  };
  // ✅ Fetch pending payments
  const fetchPayments = async () => {
    try {
      const token = JSON.parse(EncryptedStorage.get("battlehub_user"))?.token;
      const { data } = await api.get(
        "/payments/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayments(data || []);
    } catch (err) {
      toast.error("Failed to load payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 💰 Approve (single API)
  const handleApprove = async (paymentId) => {
    try {
      const token = JSON.parse(EncryptedStorage.get("battlehub_user"))?.token;

      const { data } = await api.put(
        `/wallet/update-status/${paymentId}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message || "Payment approved!");
      fetchPayments();
    } catch (err) {
      toast.error("Error approving payment");
    }
  };

  // ❌ Reject (single API)
  const handleReject = async () => {
    try {
      if (!rejectReason.trim())
        return toast.error("Enter rejection reason!");

      const token = JSON.parse(EncryptedStorage.get("battlehub_user"))?.token;

      const { data } = await api.put(
        `/wallet/update-status/${rejectModal.id}`,
        { status: "rejected", reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.warning(data.message || "Payment rejected!");

      setRejectModal({ open: false, id: null });
      setRejectReason("");
      fetchPayments();
    } catch (err) {
      toast.error("Error rejecting payment");
    }
  };


  return (
    <div className="text-white p-4 sm:p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen">
      <ToastContainer theme="dark" position="top-right" />
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Approve / Reject Payments 💳
      </h2>

      {payments.length === 0 ? (
        <p className="text-gray-400 text-center">No pending payments.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {payments.map((p) => (
            <div
              key={p._id}
              className={`rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-md ${p.status !== "pending" ? "opacity-60" : ""
                }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-yellow-400">
                  {p.user?.username}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${p.status === "approved"
                    ? "bg-green-600"
                    : p.status === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                    }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-1">User ID: {p.user?._id}</p>
              <p className="text-gray-400 text-sm mb-1">
                Amount: <span className="text-yellow-400">₹{p.amount}</span>
              </p>
              <p className="text-gray-400 text-sm mb-3">UPI: {p.upi}</p>

              {p.screenshot && (
                <img
                  src={getImageUrl(p.screenshot)}
                  alt="screenshot"
                  className="rounded border border-gray-700 cursor-pointer h-48 w-full object-cover mb-3"
                  onClick={() => setSelectedImage(getImageUrl(p.screenshot))}
                />
              )}

              {p.status === "pending" && (
                <div className="flex justify-between">
                  <button
                    onClick={() => setSelectedImage(getImageUrl(p.screenshot))}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(p._id)}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setRejectModal({ open: false, id: null })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-red-500 rounded-lg p-6 w-[90%] max-w-md"
          >
            <h3 className="text-lg font-bold text-red-400 mb-3">
              ❌ Reject Payment
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="bg-gray-800 text-white w-full p-3 rounded border border-gray-700 h-24"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectModal({ open: false, id: null })}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
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
