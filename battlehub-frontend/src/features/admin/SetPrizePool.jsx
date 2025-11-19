import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function SetPrizePool() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [rankCount, setRankCount] = useState(3);
  const [prizes, setPrizes] = useState([]);
  const [highestKill, setHighestKill] = useState("");
  const [remarks, setRemarks] = useState("");
  const [allPrizePools, setAllPrizePools] = useState([]);

  // 🧠 Mock: Load matches (simulate API)
  useEffect(() => {
    const mockMatches = [
      { id: "m001", name: "Match 1 – Erangel", type: "squad", prizePool: 500 },
      { id: "m002", name: "Match 2 – Miramar", type: "duo", prizePool: 300 },
      { id: "m003", name: "Match 3 – Solo Rush", type: "solo", prizePool: 200 },
    ];
    setMatches(mockMatches);
  }, []);

  // 🧩 When match selected or rank count changes
  useEffect(() => {
    const newPrizes = Array.from({ length: rankCount }, (_, i) => ({
      rank: i + 1,
      amount: "",
    }));
    setPrizes(newPrizes);
  }, [rankCount, selectedMatch]);

  const selectedMatchData = useMemo(
    () => matches.find((m) => m.id === selectedMatch),
    [selectedMatch, matches]
  );

  // 🧮 Totals
  const totalDistributed = useMemo(() => {
    const rankTotal = prizes.reduce(
      (sum, p) => sum + (parseInt(p.amount) || 0),
      0
    );
    const highest = parseInt(highestKill) || 0;
    return rankTotal + highest;
  }, [prizes, highestKill]);

  const remainingPrize =
    (selectedMatchData?.prizePool || 0) - totalDistributed;

  // 💾 Save
  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedMatch) return toast.error("Select a match first!");

    const data = {
      matchId: selectedMatch,
      matchName: selectedMatchData.name,
      prizePool: selectedMatchData.prizePool,
      ranks: prizes,
      highestKill: highestKill || 0,
      remarks,
    };

    setAllPrizePools((prev) => {
      const exists = prev.find((p) => p.matchId === data.matchId);
      if (exists) {
        return prev.map((p) => (p.matchId === data.matchId ? data : p));
      } else {
        return [...prev, data];
      }
    });

    toast.success(`✅ Prize Pool Structure saved for ${selectedMatchData.name}`);
  };

  // 🧮 Auto distribute (50/30/20 or similar)
  const autoSplit = () => {
    if (!selectedMatchData) return;
    const total = selectedMatchData.prizePool;
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

  return (
    <div className="text-white">
            <ToastContainer theme="dark" position="top-right" />

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Set Match Prize Pool 🏆
      </h2>

      {/* Match Selection */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 w-full md:w-96"
        >
          <option value="">-- Select Match --</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.type.toUpperCase()})
            </option>
          ))}
        </select>

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
      </div>

      {/* Prize Info */}
      {selectedMatchData && (
        <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg mb-5">
          <p>
            💰 Prize Pool:{" "}
            <span className="text-yellow-400 font-semibold">
              ₹{selectedMatchData.prizePool}
            </span>
          </p>
          <p>
            🎁 Distributed:{" "}
            <span className="text-yellow-400 font-semibold">
              ₹{totalDistributed}
            </span>
          </p>
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

      {/* Auto Split */}
      {selectedMatch && (
        <button
          onClick={autoSplit}
          className="mb-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded"
        >
          Auto Split Prize Pool 💰
        </button>
      )}

      {/* Form */}
      {selectedMatch && (
        <form
          onSubmit={handleSave}
          className="space-y-4 max-w-2xl border border-gray-800 p-5 rounded-lg bg-gray-900"
        >
          <h3 className="text-yellow-400 font-semibold text-lg mb-3">
            Rank-wise Prize Distribution
          </h3>

          {prizes.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border border-gray-800 p-3 rounded-lg bg-gray-950"
            >
              <span className="text-yellow-400 font-bold w-20">
                Rank #{p.rank}
              </span>
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
            className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition"
          >
            Save Prize Pool
          </button>
        </form>
      )}

      {/* Saved Prize Pools */}
      {allPrizePools.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">
            Saved Prize Structures 📋
          </h3>

          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-800 text-yellow-400">
                <tr>
                  <th className="p-3 border-b border-gray-700">Match</th>
                  <th className="p-3 border-b border-gray-700">Prize Pool</th>
                  <th className="p-3 border-b border-gray-700">Top Ranks</th>
                  <th className="p-3 border-b border-gray-700">Highest Kill</th>
                </tr>
              </thead>
              <tbody>
                {allPrizePools.map((p) => (
                  <tr key={p.matchId} className="hover:bg-gray-800 transition">
                    <td className="p-3 border-b border-gray-800">
                      {p.matchName}
                    </td>
                    <td className="p-3 border-b border-gray-800">
                      ₹{p.prizePool}
                    </td>
                    <td className="p-3 border-b border-gray-800 text-yellow-400">
                      {p.ranks.map((r) => `#${r.rank}: ₹${r.amount}`).join(", ")}
                    </td>
                    <td className="p-3 border-b border-gray-800">
                      💀 ₹{p.highestKill || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
