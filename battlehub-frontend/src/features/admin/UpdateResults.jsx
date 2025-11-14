import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
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

  // --------------------------------------------
  // 🔥 Fetch all matches (pending + completed)
  // --------------------------------------------
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        const { data } = await api.get("/matches");

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
          ? data.matches
          : [];

        setMatches(list.filter((m) => m.status !== "completed"));
        setCompletedMatches(list.filter((m) => m.status === "completed"));
      } catch (err) {
        toast.error("Failed to load matches.");
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, []);

  // --------------------------------------------
  // 🔥 Load match prizeDistribution + Teams
  // --------------------------------------------
  useEffect(() => {
    const loadDetails = async () => {
      if (!selectedMatch) {
        setTeams([]);
        setWinners([]);
        setHighestKill({
          team: "",
          prize: "",
          leaderId: "",
          leaderPhone: "",
        });
        return;
      }

      try {
        const { data: match } = await api.get(`/matches/${selectedMatch}`);

        // Fetch teams for that match
        const { data: teamRes } = await api.get(`/teams/${selectedMatch}`);

        const formattedTeams = teamRes.teams.map((t) => ({
          name: t.teamName,
          leaderId: t.leaderId,
          leaderPhone: t.players[0]?.phone || "",
        }));

        setTeams(formattedTeams);

        // Auto-set prizeDistribution
        if (match.prizeDistribution?.length > 0) {
          setWinners(
            match.prizeDistribution.map((p) => ({
              rank: p.rank,
              team: "",
              kills: "",
              prize: p.amount,
              leaderId: "",
              leaderPhone: "",
            }))
          );
        } else {
          setWinners([
            {
              team: "",
              kills: "",
              prize: "",
              leaderId: "",
              leaderPhone: "",
            },
          ]);
        }
      } catch (err) {
        toast.error("Failed to load match details.");
      }
    };

    loadDetails();
  }, [selectedMatch]);

  // --------------------------------------------
  // 🔢 Derived Values
  // --------------------------------------------
  const selectedMatchData = useMemo(
    () => matches.find((m) => m._id === selectedMatch),
    [selectedMatch, matches]
  );

  const totalDistributed = useMemo(() => {
    const winnersTotal = winners.reduce(
      (sum, w) => sum + (Number(w.prize) || 0),
      0
    );
    const hk = Number(highestKill.prize) || 0;
    return winnersTotal + hk;
  }, [winners, highestKill]);

  const remainingPrize =
    (selectedMatchData?.prizePool || 0) - totalDistributed;

  // --------------------------------------------
  // 🔥 Handlers
  // --------------------------------------------

  const handleWinnerChange = (index, field, value) => {
    let updated = [...winners];

    if (field === "team") {
      const selectedTeam = teams.find((t) => t.name === value);
      updated[index] = {
        ...updated[index],
        team: value,
        teamName: value,
        leaderId: selectedTeam?.leaderId || "",
        leaderPhone: selectedTeam?.leaderPhone || "",
      };
    } else {
      updated[index][field] = value;
    }

    setWinners(updated);
  };

  const handleHighestKillChange = (field, value) => {
    if (field === "team") {
      const selectedTeam = teams.find((t) => t.name === value);
      setHighestKill({
        ...highestKill,
        team: value,
        teamName: value,
        leaderId: selectedTeam?.leaderId || "",
        leaderPhone: selectedTeam?.leaderPhone || "",
      });
    } else {
      setHighestKill({ ...highestKill, [field]: value });
    }
  };

  // --------------------------------------------
  // 🔥 Submit Results
  // --------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMatch) return toast.error("Select a match!");

    const payload = {
      winners: winners.map((w) => ({
        teamName: w.team,
        kills: Number(w.kills) || 0,
        prize: Number(w.prize) || 0,
        leaderId: w.leaderId,
        leaderPhone: w.leaderPhone,
      })),
      highestKill: {
        teamName: highestKill.team,
        prize: Number(highestKill.prize) || 0,
        leaderId: highestKill.leaderId,
        leaderPhone: highestKill.leaderPhone,
      },
      remarks,
    };

    try {
      await api.put(`/results/${selectedMatch}`, payload);
      toast.success("Results saved!");

      setCompletedMatches((prev) => [
        ...prev,
        { ...selectedMatchData, status: "completed" },
      ]);

      setMatches(matches.filter((m) => m._id !== selectedMatch));

      setSelectedMatch("");
      setWinners([]);
      setRemarks("");
      setHighestKill({
        team: "",
        prize: "",
        leaderId: "",
        leaderPhone: "",
      });
    } catch (err) {
      toast.error("Failed to update results.");
    }
  };

  // --------------------------------------------
  // 🔥 View Match Modal
  // --------------------------------------------
  const handleViewMatch = async (matchId) => {
    try {
      setViewLoading(true);
      const { data } = await api.get(`/matches/${matchId}`);
      setViewData(data);
    } catch (err) {
      toast.error("Failed to fetch match details.");
    } finally {
      setViewLoading(false);
    }
  };

  // --------------------------------------------
  // UI STARTS HERE
  // --------------------------------------------

  return (
    <div className="min-h-screen w-full p-6 bg-gradient-to-br from-gray-950 to-black text-white">
      <ToastContainer theme="dark" />

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Update Match Results 🏆
      </h2>

      {/* Match Selector */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Match</label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="bg-gray-800 text-white p-3 rounded-lg w-full sm:w-80 border border-gray-700"
        >
          <option value="">-- Choose a match --</option>
          {matches.map((m) => (
            <option key={m._id} value={m._id}>
              {m.matchName} ({m.matchType})
            </option>
          ))}
        </select>
      </div>

      {/* FORM */}
      {selectedMatchData && (
        <form
          onSubmit={handleSubmit}
          className="border border-gray-800 bg-gray-900 p-6 rounded-xl max-w-4xl mx-auto space-y-6"
        >
          {/* Prize Summary */}
          <div className="bg-gray-950 border border-gray-800 p-4 rounded-lg text-gray-300 mb-4">
            <p>💰 Prize Pool: ₹{selectedMatchData.prizePool}</p>
            <p>🎁 Distributed: ₹{totalDistributed}</p>
            <p>
              💵 Remaining:{" "}
              <span
                className={
                  remainingPrize < 0 ? "text-red-500" : "text-green-400"
                }
              >
                ₹{remainingPrize < 0 ? 0 : remainingPrize}
              </span>
            </p>
          </div>

          {/* Winners */}
          {winners.map((w, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-gray-950 border border-gray-800 p-4 rounded-lg"
            >
              <span className="text-yellow-400 font-semibold text-sm">
                Rank #{w.rank || i + 1}
              </span>

              <select
                value={w.team}
                onChange={(e) => handleWinnerChange(i, "team", e.target.value)}
                className="bg-gray-800 p-2 text-white border border-gray-700 rounded-lg"
              >
                <option value="">-- Team --</option>
                {teams.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Kills"
                value={w.kills}
                onChange={(e) => handleWinnerChange(i, "kills", e.target.value)}
                className="bg-gray-800 p-2 text-white border border-gray-700 rounded-lg"
              />

              <input
                disabled
                value={w.prize}
                className="bg-gray-800 text-gray-500 p-2 border border-gray-700 rounded-lg cursor-not-allowed"
              />
            </div>
          ))}

          {/* Highest Kill */}
          <div className="bg-gray-950 border border-gray-800 p-4 rounded-lg">
            <h4 className="text-yellow-400 mb-2 font-semibold">
              Highest Kill 💀
            </h4>

            <select
              value={highestKill.team}
              onChange={(e) =>
                handleHighestKillChange("team", e.target.value)
              }
              className="bg-gray-800 p-2 text-white border border-gray-700 rounded-lg w-full sm:w-64 mb-3"
            >
              <option value="">-- Select Team --</option>
              {teams.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Prize"
              value={highestKill.prize}
              onChange={(e) =>
                handleHighestKillChange("prize", e.target.value)
              }
              className="bg-gray-800 p-2 text-white border border-gray-700 rounded-lg w-full sm:w-64"
            />
          </div>

          <textarea
            placeholder="Remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="bg-gray-800 text-white p-3 border border-gray-700 rounded-lg w-full h-24"
          ></textarea>

          <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold">
            Save Results
          </button>
        </form>
      )}

      {/* Completed Matches */}
      <div className="mt-10">
        <h3 className="text-xl text-yellow-400 font-semibold mb-3">
          Completed Matches 📜
        </h3>

        <div className="overflow-x-auto border border-gray-800 rounded-lg">
          <table className="w-full text-left text-gray-300 text-sm">
            <thead className="bg-gray-800 text-yellow-400">
              <tr>
                <th className="p-3">Match</th>
                <th className="p-3">Type</th>
                <th className="p-3">Prize Pool</th>
                <th className="p-3">Time</th>
                <th className="p-3">View</th>
              </tr>
            </thead>
            <tbody>
              {completedMatches.map((m) => (
                <tr key={m._id} className="hover:bg-gray-800 transition">
                  <td className="p-3">{m.matchName}</td>
                  <td className="p-3">{m.matchType}</td>
                  <td className="p-3">₹{m.prizePool}</td>
                  <td className="p-3 text-gray-400">
                    {new Date(m.matchTime).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewMatch(m._id)}
                      className="bg-blue-600 px-3 py-1 rounded text-white"
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
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center"
          onClick={() => setViewData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-yellow-500 p-5 rounded-xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl text-yellow-400 font-bold mb-2">
              {viewData.matchName}
            </h3>

            {viewLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <>
                {viewData.results?.winners?.length > 0 && (
                  <>
                    <h4 className="text-yellow-400 mb-2 font-semibold">
                      Winners 🏆
                    </h4>

                    <table className="w-full border border-gray-800">
                      <thead className="bg-gray-800 text-yellow-400">
                        <tr>
                          <th className="p-2">Rank</th>
                          <th className="p-2">Team</th>
                          <th className="p-2">Kills</th>
                          <th className="p-2">Prize</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewData.results.winners.map((w, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="p-2">#{index + 1}</td>
                            <td className="p-2">{w.teamName}</td>
                            <td className="p-2">{w.kills}</td>
                            <td className="p-2 text-yellow-400 font-semibold">
                              ₹{w.prize}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                <button
                  onClick={() => setViewData(null)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded mt-4"
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
