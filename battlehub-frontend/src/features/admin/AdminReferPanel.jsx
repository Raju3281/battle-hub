import { useEffect, useState } from "react";
import api from "../../utils/api";
import EncryptedStorage from "../../utils/encryptedStorage";

export default function AdminReferPanel() {
  const [referrers, setReferrers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = JSON.parse(
        EncryptedStorage.get("battlehub_user") || "{}"
      )?.token;

      const res = await api.get("users/referData/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // expecting res.data.referrals = []
      setReferrers(res.data.referrals || []);
    } catch (err) {
      console.error("Failed to load admin referral data:", err);
      setError(
        err.response?.data?.message || "Failed to load referral data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-gray-950 text-white p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-yellow-400">
          Referral Overview (Admin) 💸
        </h2>
        <button
          onClick={fetchReferralData}
          className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 border border-gray-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-300">Loading referral data…</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : referrers.length === 0 ? (
        <p className="text-center text-gray-400">
          No referral activity found yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-3 py-2 text-gray-300">#</th>
                <th className="px-3 py-2 text-gray-300">User</th>
                <th className="px-3 py-2 text-gray-300">Email</th>
                <th className="px-3 py-2 text-gray-300">Referral Code</th>
                <th className="px-3 py-2 text-gray-300 text-center">
                  Total Referred
                </th>
                <th className="px-3 py-2 text-gray-300 text-center">
                  Total Earned (₹)
                </th>
                <th className="px-3 py-2 text-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {referrers.map((ref, idx) => (
                <FragmentRow
                  key={ref._id}
                  index={idx}
                  refData={ref}
                  expanded={expandedId === ref._id}
                  onToggle={() => toggleExpand(ref._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 👇 Helper row component (keep in same file or move out if you want)
function FragmentRow({ index, refData, expanded, onToggle }) {
  return (
    <>
      <tr className="border-b border-gray-800 hover:bg-gray-900/60">
        <td className="px-3 py-2 text-gray-400">{index + 1}</td>
        <td className="px-3 py-2">
          <div className="font-semibold text-yellow-300">
            {refData.username}
          </div>
          <div className="text-xs text-gray-400">
            ID: {refData._id?.slice(-6)}
          </div>
        </td>
        <td className="px-3 py-2 text-gray-300">{refData.email}</td>
        <td className="px-3 py-2 text-yellow-400 font-mono">
          {refData.referralCode || "-"}
        </td>
        <td className="px-3 py-2 text-center text-gray-200">
          {refData.totalReferred ?? 0}
        </td>
        <td className="px-3 py-2 text-center text-green-400 font-semibold">
          ₹{refData.totalEarned ?? 0}
        </td>
        <td className="px-3 py-2 text-center">
          <button
            onClick={onToggle}
            className="text-xs px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700"
          >
            {expanded ? "Hide Referrals" : "View Referrals"}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-900/70 border-b border-gray-800">
          <td colSpan={7} className="px-4 py-3">
            {refData.referredUsers && refData.referredUsers.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                  Referred Users ({refData.referredUsers.length})
                </h4>
                <div className="max-h-52 overflow-y-auto pr-1">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-950 border-b border-gray-800">
                        <th className="px-2 py-1 text-gray-300">Name</th>
                        <th className="px-2 py-1 text-gray-300">Email</th>
                        <th className="px-2 py-1 text-gray-300">Phone</th>
                        <th className="px-2 py-1 text-gray-300">
                          Joined On
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {refData.referredUsers.map((u) => (
                        <tr
                          key={u._id}
                          className="border-b border-gray-800 hover:bg-gray-900"
                        >
                          <td className="px-2 py-1 text-gray-200">
                            {u.username}
                          </td>
                          <td className="px-2 py-1 text-gray-300">
                            {u.email}
                          </td>
                          <td className="px-2 py-1 text-gray-400">
                            {u.phone || "-"}
                          </td>
                          <td className="px-2 py-1 text-gray-400">
                            {u.createdAt
                              ? new Date(
                                  u.createdAt
                                ).toLocaleDateString("en-IN")
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-xs">
                No users referred by this player yet.
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
