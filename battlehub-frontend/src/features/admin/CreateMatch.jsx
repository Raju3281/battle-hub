import React, { useState, useMemo, useEffect } from "react";
import api from "../../utils/api"; // shared axios instance
import { getTimeDate } from "../../utils/time";
import { toast, ToastContainer } from "react-toastify";

export default function CreateMatch() {
  // Match Details
  const [matchName, setMatchName] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [totalPrizePool, setTotalPrizePool] = useState("");
  const [matchType, setMatchType] = useState("squad");
  const [matchTime, setMatchTime] = useState("");

  // Prize Distribution
  const [rankCount, setRankCount] = useState(3);
  const [prizes, setPrizes] = useState([]);
  const [highestKill, setHighestKill] = useState("");
  const [remarks, setRemarks] = useState("");

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Matches List
  const [matches, setMatches] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
const [members, setMembers] = useState("");
const [gunType, setGunType] = useState("");

  // 🔥 Convert datetime-local → IST (Fix timezone problem)
  const convertToIST = (value) => {
    const localDate = new Date(value);
    // remove timezone offset to avoid UTC conversion
    const ist = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return ist.toISOString();
  };

  // Auto initialize prizes
  useEffect(() => {
    const newPrizes = Array.from({ length: rankCount }, (_, i) => ({
      rank: i + 1,
      amount: "",
    }));
    setPrizes(newPrizes);
  }, [rankCount]);

  // Total Prize Calculations
  const totalDistributed = useMemo(() => {
    const rankTotal = prizes.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
    const highest = parseInt(highestKill) || 0;
    return rankTotal + highest;
  }, [prizes, highestKill]);

  const remainingPrize = (parseInt(totalPrizePool) || 0) - totalDistributed;

  // Auto Split
  const autoSplit = () => {
  const total = parseInt(totalPrizePool) || 0;
  if (!total) return toast.error("Enter total prize pool first!");

  let splits = [];

  if (rankCount === 1) {
    splits = [1]; // Full prize to Rank 1
  } else if (rankCount === 3) {
    splits = [0.5, 0.3, 0.2];
  } else if (rankCount === 5) {
    splits = [0.4, 0.25, 0.15, 0.1, 0.1];
  } else if (rankCount === 10) {
    splits = [0.25, 0.18, 0.14, 0.11, 0.08, 0.07, 0.06, 0.05, 0.03, 0.03];
  } else {
    splits = Array(rankCount).fill(1 / rankCount); // fallback equal split
  }

  const distributed = splits.map((ratio, i) => ({
    rank: i + 1,
    amount: Math.round(total * ratio),
  }));

  setPrizes(distributed);
};
useEffect(() => {
  setPrizes(Array.from({ length: rankCount }, (_, i) => ({
    rank: i + 1,
    amount: "",
  })));
}, [rankCount]);
  // Load matches
  const fetchMatches = async () => {
    try {
      const { data } = await api.get("/matches");
      setMatches(Array.isArray(data) ? data : data.matches || []);
    } catch (err) {
      toast.error("Failed to load matches");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Create Match
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

   const matchData = {
  matchName,
  matchType,  // keep matchType for structure (if needed), or remove if backend doesn't need it
  matchMap:
    matchType === "tdm"
      ? `tdm,${members},${gunType}` // 👉 combined field
      : matchType, // 👉 solo / duo / squad normal cases
  entryFee,
  prizePool: totalPrizePool,
  matchTime: convertToIST(matchTime),
  prizeDistribution: prizes,
  highestKillBonus: highestKill,
  remarks,
};


    try {
      await api.post("/matches/create", matchData);
      setMessage("✅ Match created successfully!");
       toast.success("✅ Match created successfully!");
      fetchMatches();

      // reset
      setGunType("");
      setMembers("");
      setMatchType("squad");
      setMatchName("");
      setEntryFee("");
      setTotalPrizePool("");
      setMatchTime("");
      setPrizes([]);
      setHighestKill("");
      setRemarks("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // View Match Details
  const handleViewMatch = async (id) => {
    try {
      setViewLoading(true);
      const { data } = await api.get(`/matches/${id}`);
      setViewData(data);
    } catch (err) {
      toast.error("Failed to fetch details");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="text-white w-full p-4 sm:p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen">
            <ToastContainer theme="dark" position="top-right" />

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Create New Match ⚔️</h2>

      {message && (
        <p className={`mb-4 text-center font-semibold ${
            message.includes("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* CREATE FORM */}
      <form onSubmit={handleSubmit}
        className="space-y-5 max-w-2xl border border-gray-800 p-6 rounded-lg bg-gray-900 mx-auto mb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Match Name"
            value={matchName}
            onChange={(e) => setMatchName(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded border border-gray-700"
            required
          />

          <select
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded border border-gray-700"
          >
            <option value="squad">Squad</option>
            <option value="tdm">TDM</option>
            {/* <option value="solo">Solo</option> */}
          </select>
        </div>
{matchType === "tdm" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Members Dropdown */}
    <select
      value={members}
      onChange={(e) => setMembers(e.target.value)}
      className="bg-gray-800 text-white p-3 rounded border border-gray-700"
      required
    >
      <option value="">Select Members</option>
      <option value="1v1">1v1</option>
      <option value="2v2">2v2</option>
      <option value="3v3">3v3</option>
      <option value="4v4">4v4</option>
    </select>

    {/* Gun Type Dropdown */}
    <select
      value={gunType}
      onChange={(e) => setGunType(e.target.value)}
      className="bg-gray-800 text-white p-3 rounded border border-gray-700"
      required
    >
      <option value="">Select Gun Type</option>
      <option value="M24">M24</option>
      <option value="M416">M416</option>
      <option value="SCAR-L">SCAR-L</option>
      <option value="Shotgun">Shotgun</option>
    </select>
  </div>
)}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Entry Fee (₹)"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded border border-gray-700"
            required
          />

          <input
            type="number"
            placeholder="Total Prize Pool (₹)"
            value={totalPrizePool}
            onChange={(e) => setTotalPrizePool(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded border border-gray-700"
            required
          />
        </div>

        {/* DATETIME: user-selected time → IST → stored */}
        <input
          type="datetime-local"
          value={matchTime}
          onChange={(e) => setMatchTime(e.target.value)}
          className="bg-gray-800 text-white p-3 rounded border border-gray-700"
          required
        />

        {/* PRIZE DISTRIBUTION SECTION */}
        <hr className="border-gray-700 my-4" />

        <h3 className="text-yellow-400 text-lg font-semibold">🏆 Prize Distribution</h3>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-400">Top Ranks:</label>
            <select
              value={rankCount}
              onChange={(e) => setRankCount(parseInt(e.target.value))}
              className="bg-gray-800 text-white p-2 rounded border border-gray-700"
            >
               <option value="1">Top 1</option>
              <option value="3">Top 3</option>
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
            </select>
          </div>

          <button
            type="button"
            onClick={autoSplit}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Auto Split 💰
          </button>
        </div>

        {totalPrizePool && (
          <div className="bg-gray-950 border border-gray-800 p-3 rounded-md mb-4">
            <p>💰 Prize Pool: ₹{totalPrizePool}</p>
            <p>🎁 Distributed: ₹{totalDistributed}</p>
            <p>
              💵 Remaining:
              <span className={remainingPrize < 0 ? "text-red-500" : "text-green-400"}>
                ₹{remainingPrize < 0 ? 0 : remainingPrize}
              </span>
            </p>
          </div>
        )}

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
              className="bg-gray-800 text-white p-2 rounded border border-gray-700 w-full"
              placeholder="Prize"
            />
          </div>
        ))}

        {/* Highest Kill */}
        <div className="border border-gray-800 p-3 rounded-lg bg-gray-950 mt-4">
          <h4 className="text-yellow-400 font-semibold mb-2">💀 Highest Kill Bonus</h4>

          <input
            type="number"
            value={highestKill}
            onChange={(e) => setHighestKill(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded border border-gray-700 w-full"
            placeholder="Bonus amount"
          />
        </div>

        {/* Remarks */}
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="bg-gray-800 text-white p-3 rounded border border-gray-700 w-full h-24"
          placeholder="Optional remarks..."
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className={`bg-yellow-500 text-black font-bold px-6 py-2 rounded 
          ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-400"}`}
        >
          {loading ? "Creating..." : "Create Match 🎮"}
        </button>
      </form>

      {/* MATCHES LIST */}
      <div className="mt-10">
        <h3 className="text-xl text-yellow-400 mb-4">Matches Created 📋</h3>

        <div className="overflow-x-auto border border-gray-800 rounded-lg">
          <table className="w-full text-gray-300 text-sm">
            <thead className="bg-gray-800 text-yellow-400">
              <tr>
                <th className="p-3">Match</th>
                <th className="p-3">Type</th>
                <th className="p-3">Prize Pool</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {matches.map((m) => (
                <tr key={m._id} className="hover:bg-gray-800">
                  <td className="p-3">{m.matchName}</td>

                  <td className="p-3">{m.matchType?.toUpperCase()}</td>

                  <td className="p-3">₹{m.prizePool}</td>

                  <td className="p-3 text-gray-400">
                    {new Date(getTimeDate(m.matchTime)).toLocaleString("en-IN", {
                      hour12: true,
                    })}
                  </td>

                  <td className="p-3">{m.status}</td>

                  <td className="p-3">
                    <button
                      onClick={() => handleViewMatch(m._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View 👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewData && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setViewData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-yellow-500 p-6 rounded-lg w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {viewLoading ? (
              <p className="text-gray-400 text-center">Loading match details...</p>
            ) : (
              <>
                <h3 className="text-xl text-yellow-400 font-bold mb-3">
                  {viewData.matchName}
                </h3>

                <p className="text-gray-300">🎮 {viewData.matchType.toUpperCase()}</p>

                <p className="text-gray-300">
                  🕒{" "}
                  {new Date(getTimeDate(viewData.matchTime)).toLocaleString("en-IN", {
                    hour12: true,
                  })}
                   {/* {new Date(viewData.matchTime)} */}
                </p>

                <p className="text-gray-300">💰 Prize Pool: ₹{viewData.prizePool}</p>

                {viewData.prizeDistribution?.length > 0 && (
                  <>
                    <h4 className="text-yellow-400 mt-4">🏆 Prize Distribution</h4>
                    <table className="w-full text-sm border border-gray-800 mt-2">
                      <thead className="bg-gray-800 text-yellow-400">
                        <tr>
                          <th className="p-2">Rank</th>
                          <th className="p-2">Prize</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewData.prizeDistribution.map((p, i) => (
                          <tr key={i} className="border-b border-gray-700">
                            <td className="p-2">#{p.rank}</td>
                            <td className="p-2 text-yellow-400 font-bold">
                              ₹{p.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {viewData.highestKillBonus && (
                  <p className="text-gray-300 mt-3">
                    💀 Highest Kill Bonus: ₹{viewData.highestKillBonus}
                  </p>
                )}

                {viewData.remarks && (
                  <p className="text-gray-300 mt-3">📝 {viewData.remarks}</p>
                )}

                <button
                  onClick={() => setViewData(null)}
                  className="bg-yellow-500 text-black font-bold px-4 py-2 rounded mt-4"
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
