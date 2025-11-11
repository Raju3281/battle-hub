import React, { useState, useEffect, useMemo } from "react";

export default function UpdateResults() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [winners, setWinners] = useState([
    { team: "", kills: "", prize: "", leaderId: "", leaderPhone: "" },
  ]);
  const [highestKill, setHighestKill] = useState({
    team: "",
    prize: "",
    leaderId: "",
    leaderPhone: "",
  });
  const [remarks, setRemarks] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [viewData, setViewData] = useState(null);

  // Mock Matches
  useEffect(() => {
    setMatches([
      { id: "m001", name: "Match 1 – Erangel", type: "squad", prizePool: 500 },
      { id: "m002", name: "Match 2 – Miramar", type: "duo", prizePool: 300 },
      { id: "m003", name: "Match 3 – Solo Rush", type: "solo", prizePool: 200 },
    ]);
  }, []);

  // Mock Results
  useEffect(() => {
    setAllResults([
      {
        id: "m001",
        name: "Match 1 – Erangel",
        prizePool: 500,
        winners: [
          {
            team: "Team Alpha",
            kills: 12,
            prize: 250,
            leaderId: "U001",
            leaderPhone: "9999990001",
          },
          {
            team: "Team Bravo",
            kills: 9,
            prize: 150,
            leaderId: "U002",
            leaderPhone: "9999990002",
          },
        ],
        highestKill: {
          team: "Team Alpha",
          prize: 50,
          leaderId: "U001",
          leaderPhone: "9999990001",
        },
        remarks: "Tough competition!",
      },
    ]);
  }, []);

  // Mock Teams by Match
  useEffect(() => {
    if (!selectedMatch) {
      setTeams([]);
      return;
    }

    const mockTeams = {
      m001: [
        { name: "Team Alpha", leaderId: "U001", leaderPhone: "9999990001" },
        { name: "Team Bravo", leaderId: "U002", leaderPhone: "9999990002" },
        { name: "Team Charlie", leaderId: "U003", leaderPhone: "9999990003" },
        { name: "Team Delta", leaderId: "U004", leaderPhone: "9999990004" },
      ],
      m002: [
        { name: "Team Omega", leaderId: "U005", leaderPhone: "9999990005" },
        { name: "Team Titan", leaderId: "U006", leaderPhone: "9999990006" },
      ],
      m003: [
        { name: "Player Raju", leaderId: "U007", leaderPhone: "9999990007" },
        { name: "Player John", leaderId: "U008", leaderPhone: "9999990008" },
      ],
    };
    setTeams(mockTeams[selectedMatch] || []);
  }, [selectedMatch]);

  // Derived values
  const selectedMatchData = useMemo(
    () => matches.find((m) => m.id === selectedMatch),
    [selectedMatch, matches]
  );

  const totalDistributed = useMemo(() => {
    const total = winners.reduce(
      (sum, w) => sum + (parseInt(w.prize) || 0),
      0
    );
    const hkPrize = parseInt(highestKill.prize) || 0;
    return total + hkPrize;
  }, [winners, highestKill]);

  const remainingPrize =
    (selectedMatchData?.prizePool || 0) - totalDistributed;

  // Add / Remove rows
  const addWinnerRow = () =>
    setWinners([
      ...winners,
      { team: "", kills: "", prize: "", leaderId: "", leaderPhone: "" },
    ]);

  const removeWinnerRow = (index) => {
    if (winners.length === 1) return;
    setWinners(winners.filter((_, i) => i !== index));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMatch) return alert("Select a match first!");

    const match = selectedMatchData;
    const resultData = {
      id: match.id,
      name: match.name,
      prizePool: match.prizePool,
      winners,
      highestKill,
      remarks,
    };

    setAllResults((prev) => {
      const exists = prev.find((r) => r.id === match.id);
      return exists
        ? prev.map((r) => (r.id === match.id ? resultData : r))
        : [...prev, resultData];
    });

    alert(`✅ Results saved for ${match.name}`);
    setWinners([{ team: "", kills: "", prize: "", leaderId: "", leaderPhone: "" }]);
    setHighestKill({ team: "", prize: "", leaderId: "", leaderPhone: "" });
    setRemarks("");
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Update Match Results 🏆
      </h2>

      {/* Match Selector */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Match</label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 w-full sm:w-80"
        >
          <option value="">-- Choose a match --</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.type.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Prize Pool Info */}
      {selectedMatch && (
        <div className="mb-6 text-gray-300 bg-gray-900 border border-gray-800 p-4 rounded-lg">
          <p>
            💰 Prize Pool:{" "}
            <span className="text-yellow-400 font-semibold">
              ₹{selectedMatchData?.prizePool}
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

      {/* Responsive Form */}
      {selectedMatch && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-4xl border border-gray-800 p-6 rounded-xl bg-gray-900 mx-auto"
        >
          <h3 className="text-yellow-400 font-semibold text-lg mb-3">
            Prize Distribution for {selectedMatchData?.name}
          </h3>

          {winners.map((w, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 border border-gray-800 p-4 rounded-lg bg-gray-950"
            >
              {/* Team */}
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
                {w.leaderPhone && (
                  <p className="text-xs text-gray-400 mt-1">
                    📞 {w.leaderPhone} ({w.leaderId})
                  </p>
                )}
              </div>

              {/* Kills */}
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Kills</label>
                <input
                  type="number"
                  value={w.kills}
                  onChange={(e) => handleWinnerChange(i, "kills", e.target.value)}
                  className="bg-gray-800 text-white w-full p-2 rounded-lg border border-gray-700 text-sm"
                />
              </div>

              {/* Prize */}
              <div>
                <label className="block text-gray-300 mb-1 text-sm">
                  Prize (₹)
                </label>
                <input
                  type="number"
                  value={w.prize}
                  onChange={(e) => handleWinnerChange(i, "prize", e.target.value)}
                  className="bg-gray-800 text-white w-full p-2 rounded-lg border border-gray-700 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-start sm:justify-end col-span-full lg:col-span-2">
                {i === winners.length - 1 && (
                  <button
                    type="button"
                    onClick={addWinnerRow}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    ➕ Add
                  </button>
                )}
                {winners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWinnerRow(i)}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    🗑 Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Highest Kill */}
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
                {highestKill.leaderPhone && (
                  <p className="text-xs text-gray-400 mt-1">
                    📞 {highestKill.leaderPhone} ({highestKill.leaderId})
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">
                  Prize (₹)
                </label>
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
            <label className="block text-gray-300 mb-1 mt-3 text-sm">
              Remarks
            </label>
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

      {/* Results History */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">
          Previous Match Results 📋
        </h3>
        {allResults.length === 0 ? (
          <p className="text-gray-400">No match results yet.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="w-full text-left text-gray-300 text-sm">
              <thead className="bg-gray-800 text-yellow-400">
                <tr>
                  <th className="p-3 border-b border-gray-700">Match</th>
                  <th className="p-3 border-b border-gray-700">Top Teams</th>
                  <th className="p-3 border-b border-gray-700">Prize Pool</th>
                  <th className="p-3 border-b border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-800 transition">
                    <td className="p-3 border-b border-gray-800">{m.name}</td>
                    <td className="p-3 border-b border-gray-800 text-yellow-400">
                      {m.winners.map((w) => w.team).join(", ")}
                    </td>
                    <td className="p-3 border-b border-gray-800">
                      ₹{m.prizePool}
                    </td>
                    <td className="p-3 border-b border-gray-800">
                      <button
                        onClick={() => setViewData(m)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal View */}
      {viewData && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setViewData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-yellow-500 rounded-lg p-6 w-[95%] sm:w-[90%] max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]"
          >
            <h3 className="text-xl text-yellow-400 font-bold mb-3">
              {viewData.name}
            </h3>
            <p className="text-gray-300 mb-3">
              💰 Prize Pool: ₹{viewData.prizePool}
            </p>

            <table className="w-full text-left text-gray-300 border border-gray-800 rounded mb-3 text-sm">
              <thead className="bg-gray-800 text-yellow-400">
                <tr>
                  <th className="p-2">Rank</th>
                  <th className="p-2">Team</th>
                  <th className="p-2">Leader</th>
                  <th className="p-2">Kills</th>
                  <th className="p-2">Prize (₹)</th>
                </tr>
              </thead>
              <tbody>
                {viewData.winners.map((w, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="p-2 text-gray-400">#{i + 1}</td>
                    <td className="p-2">{w.team}</td>
                    <td className="p-2 text-gray-400 text-xs">
                      {w.leaderPhone} ({w.leaderId})
                    </td>
                    <td className="p-2">{w.kills}</td>
                    <td className="p-2 text-yellow-400 font-semibold">
                      ₹{w.prize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {viewData.highestKill?.team && (
              <p className="text-gray-300 mb-2 text-sm">
                💀 Highest Kill:{" "}
                <span className="text-yellow-400 font-semibold">
                  {viewData.highestKill.team}
                </span>{" "}
                (₹{viewData.highestKill.prize}) — Leader:{" "}
                <span className="text-gray-400">
                  {viewData.highestKill.leaderPhone} (
                  {viewData.highestKill.leaderId})
                </span>
              </p>
            )}

            <p className="text-gray-300 mt-3 text-sm">
              📝 Remarks: {viewData.remarks || "—"}
            </p>

            <button
              onClick={() => setViewData(null)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded mt-4 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
