import { useEffect, useState } from "react";
import api from "../../utils/api";
import EncryptedStorage from "../../utils/encryptedStorage";

//
// ⭐ 1) UNIVERSAL DATE PARSER — ALWAYS TREAT AS LOCAL IST
//
const parseDate = (value) => {
  if (!value) return null;

  // Remove trailing Z because it forces UTC conversion
  const clean = typeof value === "string" ? value.replace("Z", "") : value;

  // Normal parsing → now treated as IST/local
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
};

//
// ⭐ 2) Format to Indian 12-hour format
//
const formatIndian12Hour = (value) => {
  if (!value) return "Invalid Date";

  const dateObj = parseDate(value);
  if (!dateObj) return "Invalid Date";

  return dateObj.toLocaleString("en-IN", {
    hour12: true,
  });
};

//
// ⭐ 3) COUNTDOWN CALCULATE (using corrected IST date)
//
const calculateTimeLeft = (value) => {
  const parsedDate = parseDate(value);
  if (!parsedDate) return "--";

  const now = new Date();
  const diff = parsedDate - now;

  if (diff <= 0) return "Started";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export default function BookedMatches() {
  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;

  const [bookedMatches, setBookedMatches] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);

  //
  // LOAD MATCHES
  //
  const loadMatches = async () => {
    try {
      const res = await api.get(`/matches/booked/${userId}`);
      setBookedMatches(res.data.bookedMatches || []);
    } catch (error) {
      console.error("Error fetching booked matches:", error);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  //
  // ⭐ LIVE COUNTDOWN UPDATE (uses new IST parseDate)
  //
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {};

      bookedMatches.forEach((match) => {
        newTimes[match.matchId] = calculateTimeLeft(match.matchTime);
      });

      setTimeLeft(newTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [bookedMatches]);

  //
  // MATCH STATUS
  //
  const isCompleted = (matchTime) => {
    const parsed = parseDate(matchTime);
    if (!parsed) return false;
    return parsed - new Date() <= 0;
  };

  //
  // OPEN MODAL
  //
  const openModal = async (matchId) => {
    try {
      const res = await api.get(`/matches/details/${matchId}`);
      setMatchDetails(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading match details:", err);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
        Your Booked Matches 🎮
      </h2>

      {bookedMatches.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          You haven’t booked any matches yet 😢
        </div>
      ) : (
        <div className="grid gap-5">
          {bookedMatches.map((match) => {
            const countdown = timeLeft[match.matchId] || "--";
            const completed = isCompleted(match.matchTime);

            return (
              <div
                key={match.matchId}
                className="bg-gray-900/80 border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
              >
                {/* MATCH INFO */}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {match.title}
                  </h3>

                  {/* ⭐ Correct 12-hour IST Display */}
                  <p className="text-gray-400 text-sm">
                    {formatIndian12Hour(match.matchTime)}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Type:{" "}
                    <span className="text-yellow-400 font-medium">
                      {match.type}
                    </span>{" "}
                    | Entry Fee:{" "}
                    <span className="text-yellow-400 font-medium">
                      ₹{match.entryFee}
                    </span>{" "}
                    | Prize Pool:{" "}
                    <span className="text-yellow-400 font-medium">
                      ₹{match.prizePool}
                    </span>
                  </p>
                </div>

                {/* STATUS */}
                <div className="flex flex-col sm:items-end gap-2">
                  {completed ? (
                    <span className="text-red-500 font-semibold text-sm">
                      Match Completed ❌
                    </span>
                  ) : (
                    <span className="text-yellow-400 text-sm">
                      Starts in: {countdown}
                    </span>
                  )}

                  <button
                    onClick={() => openModal(match.matchId)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && matchDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-lg border border-gray-700">

            <h2 className="text-xl font-bold text-yellow-400 mb-3">
              {matchDetails.match.title}
            </h2>

            <p className="text-gray-300 text-sm mb-2">
              Prize Pool:{" "}
              <span className="text-yellow-400 font-semibold">
                ₹{matchDetails.match.prizePool}
              </span>
            </p>

            <h3 className="text-lg font-semibold text-yellow-400 mt-4 mb-3">
              Slot List
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {matchDetails.slots.map((slot) => (
                <div
                  key={slot.slotNumber}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                >
                  <p className="text-yellow-300 font-semibold mb-2">
                    Slot {slot.slotNumber}: {slot.teamName}
                  </p>

                  <div className="text-gray-300 text-sm ml-3 space-y-1">
                    {slot.players.map((p, index) => (
                      <p key={index}>
                        {index + 1}. {p.playerName}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-5 w-full bg-red-500 hover:bg-red-400 text-black py-2 rounded-lg font-semibold"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
