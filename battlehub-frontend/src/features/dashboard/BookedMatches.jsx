import { useEffect, useState } from "react";
import api from "../../utils/api";
import EncryptedStorage from "../../utils/encryptedStorage";

const calculateTimeLeft = (matchTime) => {
  const now = new Date();
  const target = new Date(matchTime);
  const difference = target - now;

  if (difference <= 0) return "Started";

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export default function BookedMatches() {
  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;

  const [bookedMatches, setBookedMatches] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  // MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);

  const loadMatches = async () => {
    try {
      const res = await api.get(`/matches/booked/${userId}`);
      setBookedMatches(res.data.bookedMatches || []);
    } catch (err) {
      console.error("Error fetching booked matches:", err);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

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

  const getRemainingMs = (matchTime) => {
    const now = new Date();
    return new Date(matchTime) - now;
  };

  // Load match details for popup
  const openModal = async (matchId) => {
    const res = await api.get(`/matches/details/${matchId}`);
    setMatchDetails(res.data);
    setShowModal(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
        Your Booked Matches 🎮
      </h2>

      {bookedMatches.length > 0 ? (
        <div className="grid gap-5">
          {bookedMatches.map((match) => {
            const remainingMs = getRemainingMs(match.matchTime);
            const countdown = timeLeft[match.matchId] || "";

            return (
              <div
                key={match.matchId}
                className="bg-gray-900/80 border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
              >
                {/* Match Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {match.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(match.matchTime).toLocaleString()}
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

                {/* Status + Actions */}
                <div className="flex flex-col sm:items-end gap-2">

                  {/* STATUS */}
                  <div className="text-sm text-gray-400">
                    {remainingMs <= 0 ? (
                      <span className="text-red-500 font-semibold">
                        Match Completed ❌
                      </span>
                    ) : (
                      <span className="text-yellow-400">
                        Starts in: {countdown}
                      </span>
                    )}
                  </div>

                  {/* View */}
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
      ) : (
        <div className="text-center text-gray-400 mt-20">
          You haven’t booked any matches yet 😢
        </div>
      )}

      {/* -------------- MODAL -------------- */}
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

            {/* Slot List */}
            <h3 className="text-lg font-semibold text-yellow-400 mt-4 mb-3 text-left">
              Slot List
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {matchDetails.slots.map((slot) => (
                <div
                  key={slot.slotNumber}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-left"
                >
                  <p className="text-yellow-300 font-semibold mb-2 text-left">
                    Slot {slot.slotNumber} : {slot.teamName}
                  </p>

                  <div className="text-gray-300 text-sm ml-3 space-y-1 text-left">
                    {slot.players.map((p, idx) => (
                      <p key={idx}>{idx + 1}. {p.playerName}</p>
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
