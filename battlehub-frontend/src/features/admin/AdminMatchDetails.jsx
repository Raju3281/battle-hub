import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../utils/api";

export default function AdminMatchDetails() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]);

  // Load all matches for dropdown
  useEffect(() => {
    api
      .get("/matches") // Make sure this returns your response
      .then((res) => setMatches(res.data))
      .catch(() => toast.error("Error loading matches"));
  }, []);

  // Fetch match details + teams when dropdown changes
  useEffect(() => {
    if (!selectedMatchId) return;

    api
      .get(`/matches/${selectedMatchId}/details`)
      .then((res) => {
        setMatch(res.data.match);
        setTeams(res.data.teams);
      })
      .catch(() => toast.error("Error loading match details"));
  }, [selectedMatchId]);

  return (
    <div className="p-6 text-white">
      <ToastContainer theme="dark" />

      {/* Match Dropdown */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 font-medium">Select Match</label>
        <select
          className="bg-gray-800 p-3 rounded w-full text-white"
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
        >
          <option value="">-- Select Match --</option>
          {matches.map((m) => (
            <option key={m._id} value={m._id}>
              {m.matchName} ({m.matchType.toUpperCase()}) - 
              {new Date(m.matchTime).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Show Match Info */}
      {match && (
        <div className="bg-gray-800 p-5 rounded-lg mb-5 shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400">{match.matchName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-gray-300">
            <p><strong>Type:</strong> {match.matchType}</p>
            <p><strong>Entry Fee:</strong> ₹{match.entryFee}</p>
            <p><strong>Prize Pool:</strong> ₹{match.prizePool}</p>
            <p><strong>Match Time:</strong> {new Date(match.matchTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {match.status}</p>
          </div>
        </div>
      )}

      {/* Teams Section */}
      {match && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">
            Registered Teams ({teams.length})
          </h3>

          {teams.length === 0 ? (
            <p className="text-gray-400">No teams registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-700 text-yellow-400 text-sm uppercase">
                    <th className="p-3">Slot</th>
                    <th className="p-3">Team Name</th>
                    <th className="p-3">Leader</th>
                    <th className="p-3">Players</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team._id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="p-3 text-center font-bold">{team.slotNumber}</td>
                      <td className="p-3">{team.teamName}</td>
                      <td className="p-3">
                        {team.leaderId?.username || "N/A"} <br />
                        {team.leaderId?.email && (
                          <span className="text-gray-400 text-sm">{team.leaderId.email}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {team.players.map((player, idx) => (
                          <div key={idx} className="text-sm mb-1">
                            🎮 {player.playerName} — {player.inGameId}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
