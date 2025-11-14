import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function RoomIdPass() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  // Load all matches for dropdown
  const loadMatches = async () => {
    try {
      const res = await api.get("/matches");
      setMatches(res.data);
    } catch (err) {
      console.error("Error loading matches:", err);
    }
  };

  // Load existing room details (correct API)
  const loadRoomDetails = async (matchId) => {
    try {
      const res = await api.get(`/room/${matchId}`);   // <-- FIXED

      if (res.data.room) {
        setRoomId(res.data.room.roomId || "");
        setPassword(res.data.room.password || "");
      } else {
        setRoomId("");
        setPassword("");
      }
    } catch (err) {
      console.error("Error loading room details:", err);
    }
  };

  // Save room details (correct API)
  const saveRoomDetails = async () => {
    if (!selectedMatch) {
      return setStatus("Please select a match first.");
    }

    try {
      await api.post(`/room/update/${selectedMatch}`, {   // <-- FIXED
        roomId,
        password,
      });

      setStatus("Room details updated successfully ✔️");
    } catch (err) {
      console.error("Error saving room details:", err);
      setStatus("Failed to update room details ❌");
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-xl">
      <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">
        🎮 Share Room ID & Password for Match
      </h2>

      {/* Match selector */}
      <label className="text-gray-300 text-sm mb-1 block">Select Match</label>
      <select
        value={selectedMatch}
        onChange={(e) => {
          setSelectedMatch(e.target.value);
          loadRoomDetails(e.target.value);
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

      {/* Show form only when match is selected */}
      {selectedMatch && (
        <>
          <label className="text-gray-300 text-sm mb-1 block">Room ID</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white mb-3"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <label className="text-gray-300 text-sm mb-1 block">Password</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white mb-3"
            placeholder="Enter Room Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={saveRoomDetails}
            className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition"
          >
            Save Room Details
          </button>
        </>
      )}

      {status && (
        <div className="mt-4 text-center text-sm text-gray-300">{status}</div>
      )}
    </div>
  );
}
