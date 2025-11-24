import { useState, useEffect } from "react";
import EncryptedStorage from "../../utils/encryptedStorage";
import api from "../../utils/api";

export default function ReferAndEarn() {
  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;

  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState(null);
  const [referrerInfo, setReferrerInfo] = useState(null); // ⭐ New
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Copy Code
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (referralCode) {
      const link = `${window.location.origin}/register/${referralCode}`;
      setShareLink(link);
    }
  }, [referralCode]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // 📌 Fetch Referral Info (referralCode, referredBy)
  const fetchReferralInfo = async () => {
    try {
      const res = await api.get(`/users/refer/${userId}`);
      setReferralCode(res.data.referralCode);  // from DB
      setReferrerInfo(res.data.referredBy);   // who referred me
    } catch (err) {
      console.error("Failed to fetch referral info", err);
    }
  };

  // 📌 Fetch Referral Stats (referred users & earnings)
  const fetchReferralStats = async () => {
    try {
      const res = await api.get(`/users/refer/history/${userId}`);
      setReferralStats(res.data);
    } catch (err) {
      console.error("Failed to fetch referral stats", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both APIs
  useEffect(() => {
    fetchReferralInfo();
    fetchReferralStats();
  }, [userId]);

  return (
    <div className="max-w-lg mx-auto bg-gray-900/80 text-white border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl mt-6">

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-4">
        Refer & Earn 💸
      </h2>
      <p className="text-center text-gray-300 text-sm mb-6">
        Invite friends & earn when they register using your referral code 🎮
      </p>

      {/* Referral Code Box */}
      {/* <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-sm">Your Referral Code:</p>
          <p className="text-yellow-400 font-bold text-xl tracking-wide">
            {referralCode || "Loading..."}
          </p>
        </div>
        <button
          onClick={copyCode}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg text-sm"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div> */}
      {/* Referral Share Link Box */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-6">
        <p className="text-gray-400 text-sm">Your Referral Link:</p>
        <p className="text-yellow-400 font-bold text-sm break-all mb-6 ">
          {shareLink || "Generating..."}
        </p>

        <div className="flex gap-2 justify-between">
          <button
            onClick={copyLink}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg text-sm"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button>
            <a
              href={`https://wa.me/?text=Join%20BattleHub%20using%20my%20link:%20${encodeURIComponent(shareLink)}`}
              target="_blank"
              className="bg-green-500 hover:bg-green-400 text-black font-semibold px-3 py-2 rounded-lg text-sm"
            >
              WhatsApp Share
            </a>
          </button>
        </div>
      </div>


      {/* Who referred me (Referrer Info) */}
      {referrerInfo && (
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">You Were Referred By</h3>
          <p className="text-gray-300 text-sm">
            👤 <strong>{referrerInfo.username}</strong><br />
            📧 {referrerInfo.email}
          </p>
        </div>
      )}

      {/* Referral Stats */}
      {loading ? (
        <p className="text-center text-gray-400">Loading stats...</p>
      ) : referralStats ? (
        <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl mb-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Your Referral Stats</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>👥 Total Friends Referred: <span className="text-yellow-400">{referralStats.totalReferred}</span></li>
            <li>💰 Total Earned: <span className="text-green-400">₹{referralStats.totalEarned}</span></li>
          </ul>

          {/* Referred Users List */}
          {referralStats.referredUsers?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-yellow-400 mb-2">Referred Users:</h3>
              <ul className="text-gray-300 text-sm space-y-2 max-h-40 overflow-y-auto custom-scroll">
                {referralStats.referredUsers.map((user, idx) => (
                  <li key={idx} className="border-b border-gray-700 pb-2">
                    <strong>{idx + 1}. {user.username}</strong>
                    <br />
                    <span className="text-gray-400 text-xs">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-400">No referrals yet 🙁</p>
      )}

      {/* How it Works */}
      <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl mb-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-2">How It Works:</h3>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>🔗 Share your referral code with friends.</li>
          <li>📝 They must enter code during registration.</li>
          <li>💰 You get ₹5 credited instantly when they register.</li>
        </ul>
      </div>
    </div>
  );
}
