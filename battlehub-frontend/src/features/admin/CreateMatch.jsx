import React, { useState, useMemo, useEffect } from "react";
import api from "../../utils/api"; // ✅ shared axios instance

export default function CreateMatch() {
  // 🔹 Match Details
  const [matchName, setMatchName] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [totalPrizePool, setTotalPrizePool] = useState("");
  const [matchType, setMatchType] = useState("solo");
  const [matchTime, setMatchTime] = useState("");

  // 🔹 Prize Distribution
  const [rankCount, setRankCount] = useState(3);
  const [prizes, setPrizes] = useState([]);
  const [highestKill, setHighestKill] = useState("");
  const [remarks, setRemarks] = useState("");

  // 🔹 UI Feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Matches list
  const [matches, setMatches] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // 🧩 Auto initialize prizes when rank count changes
  useEffect(() => {
    const newPrizes = Array.from({ length: rankCount }, (_, i) => ({
      rank: i + 1,
      amount: "",
    }));
    setPrizes(newPrizes);
  }, [rankCount]);

  // 🧮 Totals
  const totalDistributed = useMemo(() => {
    const rankTotal = prizes.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
    const highest = parseInt(highestKill) || 0;
    return rankTotal + highest;
  }, [prizes, highestKill]);

  const remainingPrize = (parseInt(totalPrizePool) || 0) - totalDistributed;

  // 💡 Auto Split Prize Pool
  const autoSplit = () => {
    const total = parseInt(totalPrizePool) || 0;
    if (!total) return alert("Enter total prize pool first!");

    const splits =
      rankCount === 3
        ? [0.5, 0.3, 0.2]
        : rankCount === 5
        ? [0.4, 0.25, 0.15, 0.1, 0.1]
        : Array(rankCount).fill(1 / rankCount);

    const distributed = prizes.map((_, i) => ({
      rank: i + 1,
      amount: Math.round(total * splits[i]),
    }));
    setPrizes(distributed);
  };

  // 🧾 Fetch all matches (on load + after creation)
  const fetchMatches = async () => {
    try {
      const { data } = await api.get("/matches");
      setMatches(Array.isArray(data) ? data : data.matches || []);
    } catch (err) {
      console.error("❌ Error fetching matches:", err);
      alert("Failed to load matches.");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // 🧾 Create Match
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const matchData = {
      matchName,
      matchType,
      entryFee,
      prizePool: totalPrizePool,
      matchTime,
      prizeDistribution: prizes,
      highestKillBonus: highestKill,
      remarks,
    };

    try {
      await api.post("/matches/create", matchData);
      alert("🎯 Match created successfully!");
      setMessage("✅ Match created successfully!");
      fetchMatches();

      // Reset form
      setMatchName("");
      setEntryFee("");
      setTotalPrizePool("");
      setMatchTime("");
      setPrizes([]);
      setHighestKill("");
      setRemarks("");
    } catch (err) {
      console.error("❌ Error creating match:", err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🟡 View Match Details (Modal)
  const handleViewMatch = async (id) => {
    try {
      setViewLoading(true);
      const { data } = await api.get(`/matches/${id}`);
      setViewData(data);
    } catch (err) {
      console.error("❌ Error loading match details:", err);
      alert("Failed to fetch match details.");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="text-white w-full p-4 sm:p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Create New Match ⚔️
      </h2>

      {message && (
        <p
          className={`mb-4 text-center font-semibold ${
            message.includes("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* CREATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-w-2xl border border-gray-800 p-6 rounded-lg bg-gray-900 mx-auto mb-10"
      >
        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Match Name"
            value={matchName}
            onChange={(e) => setMatchName(e.target.value)}
            className="bg-gray-800 text-white w-full p-3 rounded border border-gray-700"
            required
          />
          <select
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded border border-gray-700"
          >
            <option value="solo">Solo</option>
            <option value="duo">Duo</option>
            <option value="squad">Squad</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Entry Fee (₹)"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="bg-gray-800 text-white w-full p-3 rounded border border-gray-700"
            required
          />
          <input
            type="number"
            placeholder="Total Prize Pool (₹)"
            value={totalPrizePool}
            onChange={(e) => setTotalPrizePool(e.target.value)}
            className="bg-gray-800 text-white w-full p-3 rounded border border-gray-700"
            required
          />
        </div>

        <input
          type="datetime-local"
          value={matchTime}
          onChange={(e) => setMatchTime(e.target.value)}
          className="bg-gray-800 text-white w-full p-3 rounded border border-gray-700"
          required
        />

        {/* PRIZE POOL */}
        <hr className="border-gray-700 my-4" />
        <h3 className="text-yellow-400 text-lg font-semibold mb-2">
          🏆 Prize Distribution
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-400">Top Ranks:</label>
            <select
              value={rankCount}
              onChange={(e) => setRankCount(parseInt(e.target.value))}
              className="bg-gray-800 text-white p-2 rounded border border-gray-700"
            >
              <option value="3">Top 3</option>
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
            </select>
          </div>

          <button
            type="button"
            onClick={autoSplit}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-2 rounded"
          >
            Auto Split 💰
          </button>
        </div>

        {totalPrizePool && (
          <div className="bg-gray-950 border border-gray-800 p-3 rounded-md mb-4">
            <p>💰 Prize Pool: ₹{totalPrizePool}</p>
            <p>🎁 Distributed: ₹{totalDistributed}</p>
            <p>
              💵 Remaining:{" "}
              <span
                className={`font-semibold ${
                  remainingPrize < 0 ? "text-red-500" : "text-green-400"
                }`}
              >
                ₹{remainingPrize < 0 ? 0 : remainingPrize}
              </span>
            </p>
          </div>
        )}

        {/* Rank-wise Prize Inputs */}
        {prizes.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border border-gray-800 p-3 rounded-lg bg-gray-950"
          >
            <span className="text-yellow-400 font-bold w-20">Rank #{p.rank}</span>
            <input
              type="number"
              value={p.amount}
              onChange={(e) => {
                const updated = [...prizes];
                updated[i].amount = e.target.value;
                setPrizes(updated);
              }}
              className="bg-gray-800 text-white w-full p-2 rounded border border-gray-700"
              placeholder="Enter prize amount"
            />
          </div>
        ))}

        {/* Highest Kill */}
        <div className="border border-gray-800 p-3 rounded-lg bg-gray-950 mt-4">
          <h4 className="text-yellow-400 font-semibold mb-2">
            💀 Highest Kill Bonus
          </h4>
          <input
            type="number"
            value={highestKill}
            onChange={(e) => setHighestKill(e.target.value)}
            className="bg-gray-800 text-white w-full p-2 rounded border border-gray-700"
            placeholder="Enter bonus amount (optional)"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-gray-300 mb-1 mt-3">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="bg-gray-800 text-white w-full p-2 rounded border border-gray-700 h-24"
            placeholder="Optional notes..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Match 🎮"}
        </button>
      </form>

      {/* MATCHES CREATED TABLE */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">
          Matches Created 📋
        </h3>
        {matches.length === 0 ? (
          <p className="text-gray-400">No matches created yet.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="w-full text-left text-gray-300 text-sm">
              <thead className="bg-gray-800 text-yellow-400">
                <tr>
                  <th className="p-3 border-b border-gray-700">Match</th>
                  <th className="p-3 border-b border-gray-700">Type</th>
                  <th className="p-3 border-b border-gray-700">Prize Pool</th>
                  <th className="p-3 border-b border-gray-700">Time</th>
                  <th className="p-3 border-b border-gray-700">Status</th>
                  <th className="p-3 border-b border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-800 transition">
                    <td className="p-3 border-b border-gray-800">{m.matchName}</td>
                    <td className="p-3 border-b border-gray-800">
                      {m.matchType?.toUpperCase?.()}
                    </td>
                    <td className="p-3 border-b border-gray-800">₹{m.prizePool}</td>
                    <td className="p-3 border-b border-gray-800 text-gray-400">
                      {new Date(m.matchTime).toLocaleString()}
                    </td>
                    <td className="p-3 border-b border-gray-800 text-gray-400">
                      {m.status}
                    </td>
                    <td className="p-3 border-b border-gray-800">
                      <button
                        onClick={() => handleViewMatch(m._id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        View 👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🟡 VIEW MODAL */}
      {viewData && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setViewData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-yellow-500 rounded-lg p-6 w-[95%] sm:w-[90%] max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]"
          >
            {viewLoading ? (
              <p className="text-gray-400 text-center">Loading match details...</p>
            ) : (
              <>
                <h3 className="text-xl text-yellow-400 font-bold mb-3">
                  {viewData.matchName}
                </h3>
                <p className="text-gray-300 mb-1">
                  🎮 Type: {viewData.matchType?.toUpperCase?.()}
                </p>
                <p className="text-gray-300 mb-1">
                  💰 Prize Pool: ₹{viewData.prizePool}
                </p>
                <p className="text-gray-300 mb-1">
                  🕒 Match Time: {new Date(viewData.matchTime).toLocaleString()}
                </p>

                {viewData.prizeDistribution?.length > 0 && (
                  <>
                    <h4 className="text-yellow-400 mt-4 mb-2 font-semibold">
                      🏆 Prize Distribution
                    </h4>
                    <table className="w-full text-left text-gray-300 border border-gray-800 rounded mb-3 text-sm">
                      <thead className="bg-gray-800 text-yellow-400">
                        <tr>
                          <th className="p-2">Rank</th>
                          <th className="p-2">Prize</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewData.prizeDistribution.map((p, i) => (
                          <tr key={i} className="border-b border-gray-800">
                            <td className="p-2 text-gray-400">#{p.rank}</td>
                            <td className="p-2 text-yellow-400 font-semibold">
                              ₹{p.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {viewData.highestKillBonus && (
                  <p className="text-gray-300 mt-3 text-sm">
                    💀 Highest Kill Bonus: ₹{viewData.highestKillBonus}
                  </p>
                )}

                {viewData.remarks && (
                  <p className="text-gray-300 mt-3 text-sm">
                    📝 Remarks: {viewData.remarks}
                  </p>
                )}

                <button
                  onClick={() => setViewData(null)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded mt-4 text-sm"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
