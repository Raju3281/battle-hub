import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EncryptedStorage from "../../utils/encryptedStorage";
import api from "../../utils/api";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(EncryptedStorage.get("battlehub_user"))?.token;
      if (!token) {
        toast.error("⚠️ Please login as admin!");
        return;
      }

      const { data } = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(data.users || []);
      // toast.success("✅ Users loaded successfully!");
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Filtered users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // 🚫 Block user
  const blockUser = async (id) => {
    try {
      const token = JSON.parse(EncryptedStorage.get("battlehub_user"))?.token;
      await api.put(
        `/users/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.warning("🚫 User blocked successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user");
    }
  };

  // ✅ Unblock user
  const unblockUser = async (id) => {
    try {
      const token = JSON.parse(EncryptedStorage.get("battlehub_user"))?.token;
      await api.put(
        `/users/${id}/unblock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ User unblocked successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user");
    }
  };

  // 💰 Fetch wallet details
  const fetchWalletDetails = async (id) => {
    try {
      const token = JSON.parse(EncryptedStorage.get("battlehub_user"))?.token;
      const { data } = await api.get(
        `/users/wallet/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWalletData(data);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
      toast.error("Failed to load wallet data");
    }
  };

  // 👁️ View user details
  const handleViewUser = async (user) => {
    setViewUser(user);
    await fetchWalletDetails(user._id);
  };

  return (
    <div className="text-white p-4 sm:p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen">
      <ToastContainer theme="dark" position="top-right" />
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        All Registered Users 👥
      </h2>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 w-full md:w-96"
        />
        <p className="text-gray-400 text-sm">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800 text-yellow-400">
            <tr>
              <th className="p-3 border-b border-gray-700">Name</th>
              <th className="p-3 border-b border-gray-700">Email</th>
              <th className="p-3 border-b border-gray-700">Phone</th>
              <th className="p-3 border-b border-gray-700">Wallet (₹)</th>
              <th className="p-3 border-b border-gray-700">Status</th>
              <th className="p-3 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className={`hover:bg-gray-800 transition ${
                    u.isBlocked ? "opacity-60" : ""
                  }`}
                >
                  <td className="p-3 border-b border-gray-800">{u.username}</td>
                  <td className="p-3 border-b border-gray-800">{u.email}</td>
                  <td className="p-3 border-b border-gray-800">{u.phone}</td>
                  <td className="p-3 border-b border-gray-800 text-green-400 font-semibold">
                    ₹{u.walletBalance || 0}
                  </td>
                  <td className="p-3 border-b border-gray-800">
                    {u.isBlocked ? (
                      <span className="text-red-500 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-400 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="p-3 border-b border-gray-800 flex gap-2">
                    <button
                      onClick={() =>
                        u.isBlocked ? unblockUser(u._id) : blockUser(u._id)
                      }
                      className={`px-3 py-1 rounded font-semibold transition ${
                        u.isBlocked
                          ? "bg-green-600 hover:bg-green-500 text-white"
                          : "bg-red-600 hover:bg-red-500 text-white"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleViewUser(u)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-400 border-t border-gray-800"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewUser && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => {
            setViewUser(null);
            setWalletData(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-yellow-500 rounded-lg p-6 w-[90%] max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl text-yellow-400 font-bold mb-3">
              {viewUser.username}
            </h3>

            <div className="space-y-2 text-gray-300">
              <p>📧 Email: <span className="text-yellow-400">{viewUser.email}</span></p>
              <p>📞 Phone: <span className="text-yellow-400">{viewUser.phone}</span></p>
              <p>🪙 Wallet: <span className="text-green-400 font-semibold">₹{viewUser.walletBalance}</span></p>
              <p>🚫 Status:{" "}
                {viewUser.isBlocked ? (
                  <span className="text-red-500 font-semibold">Blocked</span>
                ) : (
                  <span className="text-green-400 font-semibold">Active</span>
                )}
              </p>
              <p>📅 Joined: {new Date(viewUser.createdAt).toLocaleDateString()}</p>
            </div>

            {/* WALLET DETAILS */}
            {walletData && (
              <>
                <h4 className="text-yellow-400 mt-4 font-semibold">
                  💰 Wallet Transactions ({walletData.totalTransactions})
                </h4>
                {walletData.transactions.length === 0 ? (
                  <p className="text-gray-400 text-sm">No transactions found.</p>
                ) : (
                  <table className="w-full mt-2 text-sm border border-gray-800 rounded">
                    <thead className="bg-gray-800 text-yellow-400">
                      <tr>
                        <th className="p-2">Type</th>
                        <th className="p-2">Amount (₹)</th>
                        <th className="p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletData.transactions.map((tx, i) => (
                        <tr key={i} className="border-b border-gray-800">
                          <td className="p-2">{tx.type}</td>
                          <td className="p-2 text-yellow-400">{tx.amount}</td>
                          <td className="p-2 text-gray-400">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() =>
                  viewUser.isBlocked
                    ? unblockUser(viewUser._id)
                    : blockUser(viewUser._id)
                }
                className={`px-4 py-2 rounded font-semibold transition ${
                  viewUser.isBlocked
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                {viewUser.isBlocked ? "Unblock User" : "Block User"}
              </button>
              <button
                onClick={() => {
                  setViewUser(null);
                  setWalletData(null);
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
