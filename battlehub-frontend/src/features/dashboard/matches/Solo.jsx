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

// -----------------------------
// 🔥 Indian Time - minus 15 min
// -----------------------------
const formatIndianTimeMinus15 = (dateValue) => {
  if (!dateValue) return "Invalid Date";
  const replaced = dateValue.replace("Z", "");
  const d = new Date(replaced);
  if (isNaN(d.getTime())) return "Invalid Date";
  d.setMinutes(d.getMinutes() - 15);
  return d.toLocaleString("en-IN", { hour12: true });
};

// -----------------------------
// ⏳ HH:MM:SS formatter
// -----------------------------
const formatHHMMSS = (ms) => {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function Solo() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // fetch solo matches
  useEffect(() => {
    api
      .get("matches/solo")
      .then((res) => setMatches(res.data.matches))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  // rerender timer every second
  useEffect(() => {
    const t = setInterval(() => {
      setMatches((prev) => [...prev]);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold text-red-400 mb-4">Solo Matches</h3>

      <div className="grid gap-4">
        {matches
          .filter((m) => {
            const matchDate = parseDate(m.matchTime);
            return Date.now() < matchDate.getTime();
          })
          .map((m) => {
            const matchDate = parseDate(m.matchTime);

            const FIVE_HOURS_30_MIN = 5.5 * 60 * 60 * 1000;
            const FIFTEEN_MIN = 15 * 60 * 1000;

            const regEnd = new Date(
              matchDate.getTime() - FIVE_HOURS_30_MIN - FIFTEEN_MIN
            );

            const msLeft = regEnd - Date.now();
            const registrationOpen = msLeft > 0;

            return (
              <div
                key={m._id}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:shadow-red-500/30 transition"
              >
                <div>
                  <h4 className="font-semibold">{m.matchName}</h4>
                  <p className="text-gray-400 text-sm">
                    {formatIndianTime(m.matchTime)}
                  </p>

                  {registrationOpen ? (
                    <p className="text-green-400 text-sm font-semibold">
                      Registration Ends In: {formatHHMMSS(msLeft)}
                    </p>
                  ) : (
                    <p className="text-red-400 text-sm font-semibold">
                      Registration Ended
                    </p>
                  )}

                  <p className="text-yellow-400 text-sm">
                    Entry fee : Rs.{m.entryFee}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedMatch(m)}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-lg font-medium"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/dashboard/matches/solo/join/${m._id}`)
                    }
                    className={`px-3 py-1 rounded-lg font-medium ${
                      registrationOpen
                        ? "bg-red-500 hover:bg-red-400 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!registrationOpen}
                  >
                    Join
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Details Modal */}
      {selectedMatch && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={() => setSelectedMatch(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white p-6 rounded-lg w-[90%] max-w-md border border-red-500 shadow-lg"
          >
            <h3 className="text-xl font-bold text-red-400 mb-3">
              {selectedMatch.matchName}
            </h3>

            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-red-400">Match Time:</span>{" "}
              {formatIndianTime(selectedMatch.matchTime)}
            </p>

            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-red-400">Entry Fee:</span>{" "}
              ₹{selectedMatch.entryFee}
            </p>

            <p className="text-gray-300 mb-4">
              <span className="font-semibold text-red-400">Prize Pool:</span>{" "}
              ₹{selectedMatch.prizePool}
            </p>

            {selectedMatch.prizePool && (
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mb-4">
                <h4 className="text-red-400 font-semibold mb-2">
                  Rank Rewards:
                </h4>

                <ul className="space-y-1">
                  {(selectedMatch.prizeDistribution || []).map((p) => (
                    <li
                      key={p._id}
                      className="flex justify-between text-gray-300 text-sm bg-gray-900 px-3 py-2 rounded"
                    >
                      <span>Rank {p.rank}</span>
                      <span className="text-yellow-400 font-semibold">
                        ₹{p.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedMatch(null)}
              className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-medium w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
