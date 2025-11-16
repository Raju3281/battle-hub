import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

// -----------------------------
// 🔥 Universal Date Parser
// -----------------------------
const parseDate = (value) => {
  if (!value) return null;

  if (!isNaN(Number(value))) {
    const num = Number(value);
    const ms = num.toString().length === 10 ? num * 1000 : num;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;

  return null;
};

// -----------------------------
// 🔥 Indian Time Formatter
// -----------------------------
const formatIndianTime = (dateValue) => {
  const d = parseDate(dateValue);
  if (!d) return "Invalid Date";

  return new Date(dateValue.replace("Z", "")).toLocaleString("en-IN", {
    hour12: true,
  });
};

export default function Squad() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    api
      .get("matches/squad")
      .then((res) => setMatches(res.data.matches))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold text-yellow-400 mb-4">Squad Matches</h3>

      <div className="grid gap-4">
        {matches.map((m) => (
          <div
            key={m._id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:shadow-yellow-500/30 transition"
          >
            <div>
              <h4 className="font-semibold">{m.matchName}</h4>

              <p className="text-gray-400 text-sm">{formatIndianTime(m.matchTime)}</p>

              <p className="text-yellow-400 text-sm">Entry fee : Rs.{m.entryFee}</p>
            </div>

            <div className="flex flex-col gap-2">
              {/* View Details Button */}
              <button
                onClick={() => setSelectedMatch(m)}
                className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-lg font-medium"
              >
                View Details
              </button>

              {/* Join Button */}
              <button
                onClick={() =>
                  navigate(`/dashboard/matches/squad/join/${m._id}`)
                }
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-lg font-medium"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --------------------------------
          📌 VIEW DETAILS MODAL
      -------------------------------- */}
      {selectedMatch && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={() => setSelectedMatch(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white p-6 rounded-lg w-[90%] max-w-md border border-yellow-500 shadow-lg"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-3">
              {selectedMatch.matchName}
            </h3>

            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-yellow-400">Match Time: </span>
              {formatIndianTime(selectedMatch.matchTime)}
            </p>

            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-yellow-400">Entry Fee: </span>
              ₹{selectedMatch.entryFee}
            </p>

            <p className="text-gray-300 mb-4">
              <span className="font-semibold text-yellow-400">Prize Pool: </span>
              ₹{selectedMatch.prizePool}
            </p>
            {/* 🔥 Rank-wise Prize Breakdown */}
{selectedMatch.prizePool&& (
  <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mb-4">
    <h4 className="text-yellow-400 font-semibold mb-2">Rank Rewards:</h4>

    <ul className="space-y-1">
      {(selectedMatch.prizeDistribution||[]).map((p) => (
        <li
          key={p._id}
          className="flex justify-between text-gray-300 text-sm bg-gray-900 px-3 py-2 rounded"
        >
          <span>Rank {p.rank}</span>
          <span className="text-yellow-400 font-semibold">₹{p.amount}</span>
        </li>
      ))}
    </ul>
  </div>
)}


            <button
              onClick={() => setSelectedMatch(null)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
