import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api"; // ✅ common axios instance
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateResults() {
  const [matches, setMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [winners, setWinners] = useState([]);
  const [highestKill, setHighestKill] = useState({
    team: "",
    prize: "",
    leaderId: "",
    leaderPhone: "",
  });
  const [remarks, setRemarks] = useState("");
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ✅ Fetch all matches (pending + completed)
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        const { data } = await api.get("/matches");

        const matchList = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
          ? data.matches
          : [];

        setMatches(matchList.filter((m) => m.status !== "completed"));
        setCompletedMatches(matchList.filter((m) => m.status === "completed"));
      } catch (error) {
        console.error("❌ Error fetching matches:", error);
        toast.error("Failed to load matches. Please try again.");
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, []);

  // ✅ Auto-load prize distribution and teams from backend
  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!selectedMatch) {
        setTeams([]);
        setWinners([]);
        return;
      }

      try {
        const { data: match } = await api.get(`/matches/${selectedMatch}`);

        // 🟢 Auto-load prizeDistribution
        if (match.prizeDistribution?.length > 0) {
          const autoWinners = match.prizeDistribution.map((p) => ({
            rank: p.rank,
            team: "",
            kills: "",
            prize: p.amount,
            leaderId: "",
            leaderPhone: "",
          }));
          setWinners(autoWinners);
        } else {
          setWinners([{ team: "", kills: "", prize: "", leaderId: "", leaderPhone: "" }]);
        }

        // 🟢 Mock teams for now
        const mockTeams = [
          { name: "Team Alpha", leaderId: "U001", leaderPhone: "9999990001" },
          { name: "Team Bravo", leaderId: "U002", leaderPhone: "9999990002" },
          { name: "Team Charlie", leaderId: "U003", leaderPhone: "9999990003" },
          { name: "Team Delta", leaderId: "U004", leaderPhone: "9999990004" },
        ];
        setTeams(mockTeams);
      } catch (error) {
        console.error("❌ Error loading match details:", error);
        toast.error("Failed to load match details.");
      }
    };

    fetchMatchDetails();
  }, [selectedMatch]);

  // 🧮 Derived values
  const selectedMatchData = useMemo(
    () => matches.find((m) => m._id === selectedMatch),
    [selectedMatch, matches]
  );

  const totalDistributed = useMemo(() => {
    const total = winners.reduce((sum, w) => sum + (parseInt(w.prize) || 0), 0);
    const hkPrize = parseInt(highestKill.prize) || 0;
    return total + hkPrize;
  }, [winners, highestKill]);

  const remainingPrize = (selectedMatchData?.prizePool || 0) - totalDistributed;

  // ✅ Winner & Kill change handlers
  const handleWinnerChange = (index, field, value) => {
    let updated = [...winners];
    if (field === "team") {
      const t = teams.find((tm) => tm.name === value);
      updated[index] = {
        ...updated[index],
        team: value,
        leaderId: t?.leaderId || "",
        leaderPhone: t?.leaderPhone || "",
      };
    } else updated[index][field] = value;
    setWinners(updated);
  };

  const handleHighestKillChange = (field, value) => {
    if (field === "team") {
      const t = teams.find((tm) => tm.name === value);
      setHighestKill({
        ...highestKill,
        team: value,
        leaderId: t?.leaderId || "",
        leaderPhone: t?.leaderPhone || "",
      });
    } else setHighestKill({ ...highestKill, [field]: value });
  };

  // ✅ Submit Results
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return toast.error("Select a match first!");

    const match = selectedMatchData;
    const payload = {
      winners: winners.map((w) => ({
        team: w.team,
        kills: parseInt(w.kills) || 0,
        prize: parseInt(w.prize) || 0,
        leaderId: w.leaderId,
        leaderPhone: w.leaderPhone,
        userId: "69140c8f1366a8f6e1545c84", // replace with actual user ID
      })),
      highestKill: {
        team: highestKill.team,
        prize: parseInt(highestKill.prize) || 0,
        leaderId: highestKill.leaderId,
        leaderPhone: highestKill.leaderPhone,
        userId: "69140c8f1366a8f6e1545c84",
      },
      remarks,
    };

    try {
      await api.put(`/results/${match._id}`, payload);
      toast.success("🏆 Match results updated successfully!");

      setCompletedMatches((prev) => [...prev, { ...match, status: "completed" }]);
      setMatches(matches.filter((m) => m._id !== match._id));

      // Reset form
      setSelectedMatch("");
      setWinners([]);
      setHighestKill({ team: "", prize: "", leaderId: "", leaderPhone: "" });
      setRemarks("");
    } catch (err) {
      console.error("❌ Error updating results:", err);
      toast.error(err.response?.data?.message || "Failed to update results.");
    }
  };

  // ✅ View Completed Match Details
  const handleViewMatch = async (matchId) => {
    try {
      setViewLoading(true);
      const { data } = await api.get(`/matches/${matchId}`);
      setViewData(data);
    } catch (error) {
      console.error("❌ Error fetching match details:", error);
      toast.error("Failed to fetch match details.");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <ToastContainer theme="dark" position="top-right" />
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Update Match Results 🏆
      </h2>

      {/* Match Selector */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Match</label>
        {loadingMatches ? (
          <p className="text-gray-400">Loading matches...</p>
        ) : (
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 w-full sm:w-80"
          >
            <option value="">-- Choose a match --</option>
            {matches.length > 0 ? (
              matches.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.matchName} ({m.matchType?.toUpperCase?.()})
                </option>
              ))
            ) : (
              <option disabled>No pending matches</option>
            )}
          </select>
        )}
      </div>

      {/* Match Info + Form */}
      {selectedMatch && selectedMatchData && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-4xl border border-gray-800 p-6 rounded-xl bg-gray-900 mx-auto"
        >
          <h3 className="text-yellow-400 font-semibold text-lg mb-3">
            Prize Distribution for {selectedMatchData?.matchName}
          </h3>

          <div className="mb-4 text-gray-300 bg-gray-950 border border-gray-800 p-3 rounded-lg">
            <p>💰 Prize Pool: ₹{selectedMatchData?.prizePool}</p>
            <p>🎁 Distributed: ₹{totalDistributed}</p>
            <p>
              💵 Remaining:{" "}
              <span
                className={remainingPrize < 0 ? "text-red-500" : "text-green-400"}
              >
                ₹{remainingPrize < 0 ? 0 : remainingPrize}
              </span>
            </p>
          </div>

          {/* Winners Section */}
          {winners.map((w, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 border border-gray-800 p-4 rounded-lg bg-gray-950"
            >
              <span className="text-yellow-400 font-semibold text-sm">
                Rank #{w.rank || i + 1}
              </span>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Team</label>
                <select
                  value={w.team}
                  onChange={(e) => handleWinnerChange(i, "team", e.target.value)}
                  className="bg-gray-800 text-white w-full p-2 rounded-lg border border-gray-700 text-sm"
                >
                  <option value="">-- Select Team --</option>
                  {teams.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Kills</label>
                <input
                  type="number"
                  value={w.kills}
                  onChange={(e) => handleWinnerChange(i, "kills", e.target.value)}
                  className="bg-gray-800 text-white w-full p-2 rounded-lg border border-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">Prize (₹)</label>
                <input
                  type="number"
                  value={w.prize}
                  disabled
                  className="bg-gray-800 text-gray-400 w-full p-2 rounded-lg border border-gray-700 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          ))}

          {/* Highest Kill Section */}
          <div className="border border-gray-800 p-4 rounded-lg bg-gray-950 mt-6">
            <h4 className="text-yellow-400 font-semibold mb-2">
              💀 Highest Kill Bonus
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Team</label>
                <select
                  value={highestKill.team}
                  onChange={(e) =>
                    handleHighestKillChange("team", e.target.value)
                  }
                  className="bg-gray-800 text-white w-full p-2 rounded-lg border border-gray-700 text-sm"
                >
                  <option value="">-- Select Team --</option>
                  {teams.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Prize (₹)</label>
                <input
                  type="number"
                  value={highestKill.prize}
                  onChange={(e) =>
                    handleHighestKillChange("prize", e.target.value)
                  }
                  className="bg-gray-800 text-white w-full p-2 rounded-lg border border-gray-700 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-gray-300 mb-1 mt-3 text-sm">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="bg-gray-800 text-white w-full p-3 rounded-lg border border-gray-700 h-24 text-sm"
              placeholder="Optional notes or remarks..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg transition text-sm"
          >
            Save Results
          </button>
        </form>
      )}

      {/* ✅ Completed Matches */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">
          Completed Matches History 📜
        </h3>
        {completedMatches.length === 0 ? (
          <p className="text-gray-400">No completed matches yet.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="w-full text-left text-gray-300 text-sm">
              <thead className="bg-gray-800 text-yellow-400">
                <tr>
                  <th className="p-3 border-b border-gray-700">Match</th>
                  <th className="p-3 border-b border-gray-700">Type</th>
                  <th className="p-3 border-b border-gray-700">Prize Pool</th>
                  <th className="p-3 border-b border-gray-700">Time</th>
                  <th className="p-3 border-b border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {completedMatches.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-800 transition">
                    <td className="p-3 border-b border-gray-800">{m.matchName}</td>
                    <td className="p-3 border-b border-gray-800">
                      {m.matchType?.toUpperCase?.()}
                    </td>
                    <td className="p-3 border-b border-gray-800">₹{m.prizePool}</td>
                    <td className="p-3 border-b border-gray-800 text-gray-400">
                      {new Date(m.matchTime).toLocaleString()}
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
                <p className="text-gray-300 mb-1">💰 Prize Pool: ₹{viewData.prizePool}</p>
                <p className="text-gray-300 mb-1">
                  🕒 Match Time: {new Date(viewData.matchTime).toLocaleString()}
                </p>

                {viewData.results?.winners?.length > 0 && (
                  <>
                    <h4 className="text-yellow-400 mt-4 mb-2 font-semibold">🏆 Winners</h4>
                    <table className="w-full text-left text-gray-300 border border-gray-800 rounded mb-3 text-sm">
                      <thead className="bg-gray-800 text-yellow-400">
                        <tr>
                          <th className="p-2">Rank</th>
                          <th className="p-2">Team</th>
                          <th className="p-2">Kills</th>
                          <th className="p-2">Prize</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewData.results.winners.map((w, i) => (
                          <tr key={i} className="border-b border-gray-800">
                            <td className="p-2 text-gray-400">#{i + 1}</td>
                            <td className="p-2">{w.team}</td>
                            <td className="p-2">{w.kills}</td>
                            <td className="p-2 text-yellow-400 font-semibold">₹{w.prize}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {viewData.results?.highestKill?.team && (
                  <p className="text-gray-300 mt-3 text-sm">
                    💀 Highest Kill:{" "}
                    <span className="text-yellow-400 font-semibold">
                      {viewData.results.highestKill.team}
                    </span>{" "}
                    (₹{viewData.results.highestKill.prize})
                  </p>
                )}

                {viewData.results?.remarks && (
                  <p className="text-gray-300 mt-3 text-sm">
                    📝 Remarks: {viewData.results.remarks}
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
