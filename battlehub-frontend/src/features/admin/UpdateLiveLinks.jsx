import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function UpdateLiveLinks() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [matchLink, setMatchLink] = useState("");
  const [status, setStatus] = useState("");

  // 1️⃣ Load all matches for dropdown
  const loadMatches = async () => {
    try {
      const res = await api.get("/matches"); // your existing route
      setMatches(res.data);
    } catch (err) {
      console.error("Error loading matches:", err);
    }
  };

  // 2️⃣ Load existing match link when match selected
  const loadMatchLink = async (matchId) => {
    if (!matchId) return;

    try {
      const res = await api.get(`/matches/match-link/${matchId}`);
      setMatchLink(res.data.matchLink || "");
    } catch (err) {
      console.error("Error loading match link:", err);
      setMatchLink("");
    }
  };

  const updateMatchLink = async () => {
    if (!selectedMatch) {
      return setStatus("Please select a match first.");
    }
    if (!matchLink.trim()) {
      return setStatus("Please enter a valid YouTube link.");
    }

    try {
      await api.post(`/matches/match-link/${selectedMatch}`, {
        matchLink,
      });

      setStatus("Match link updated successfully ✔️");
    } catch (err) {
      console.error("Error updating match link:", err);
      setStatus("Failed to update match link ❌");
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-xl">
      <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">
        🎥 Update Match Link (Live or Video)
      </h2>

      {/* Match Selector */}
      <label className="text-gray-300 text-sm mb-1 block">
        Select Match
      </label>

      <select
        value={selectedMatch}
        onChange={(e) => {
          setSelectedMatch(e.target.value);
          loadMatchLink(e.target.value);
        }}
        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white mb-4"
      >
        <option value="">-- Select Match --</option>
        {matches.map((match) => (
          <option key={match._id} value={match._id}>
            {match.matchName} — {new Date(match.matchTime).toLocaleString()}
          </option>
        ))}
      </select>

      {/* Show Link Input only when match is selected */}
      {selectedMatch && (
        <>
          <label className="text-gray-300 text-sm mb-1 block">
            Match Link (YouTube Video / Live Stream)
          </label>

          <input
            type="text"
            value={matchLink}
            onChange={(e) => setMatchLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=XXXX"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />

          <button
            onClick={updateMatchLink}
            className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition"
          >
            Update Match Link
          </button>
        </>
      )}

      {status && (
        <div className="mt-4 text-center text-sm text-gray-300">
          {status}
        </div>
      )}
    </div>
  );
}
