import { useEffect, useState } from "react";

// Utility to calculate time difference
const calculateTimeLeft = (matchTime) => {
  const now = new Date();
  const target = new Date(matchTime);
  const difference = target - now;

  if (difference <= 0) return "Started";

  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export default function BookedMatches() {
  // Sample data — later you’ll fetch from backend
  const [bookedMatches, setBookedMatches] = useState([
    {
      id: 1,
      title: "Erangel Squad Match",
      type: "Squad",
      date: "Nov 7, 2025",
      time: "18:00", // 6:00 PM in 24h format
      entryFee: 50,
      prize: "₹500",
      roomId: "239874",
      password: "BGMI@123",
    },
    {
      id: 2,
      title: "Livik Duo Battle",
      type: "Duo",
      date: "Nov 7, 2025",
      time: "20:30", // 8:30 PM
      entryFee: 30,
      prize: "₹300",
      roomId: "128765",
      password: "DUO@456",
    },
  ]);

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {};
      bookedMatches.forEach((match) => {
        const matchDateTime = `${match.date} ${match.time}`;
        newTimes[match.id] = calculateTimeLeft(matchDateTime);
      });
      setTimeLeft(newTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [bookedMatches]);

  // Function to determine if Room ID should be visible
  const canShowRoomDetails = (matchDate, matchTime) => {
    const now = new Date();
    const matchDateTime = new Date(`${matchDate} ${matchTime}`);
    const difference = matchDateTime - now;
    return difference <= 15 * 60 * 1000; // 15 minutes before start
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
        Your Booked Matches 🎮
      </h2>

      {bookedMatches.length > 0 ? (
        <div className="grid gap-5">
          {bookedMatches.map((match) => {
            const showRoom = canShowRoomDetails(match.date, match.time);
            const countdown = timeLeft[match.id] || "";

            return (
              <div
                key={match.id}
                className="bg-gray-900/80 border border-gray-800 p-5 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
              >
                {/* Match Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {match.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {match.date} • {match.time}
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
                    | Prize:{" "}
                    <span className="text-yellow-400 font-medium">
                      {match.prize}
                    </span>
                  </p>
                </div>

                {/* Room Details */}
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="text-sm text-gray-400">
                    {countdown === "Started" ? (
                      <span className="text-green-400 font-semibold">
                        Match Started
                      </span>
                    ) : (
                      <span className="text-yellow-400">
                        Starts in: {countdown}
                      </span>
                    )}
                  </div>

                  {showRoom ? (
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-sm">
                      <p>
                        Room ID:{" "}
                        <span className="text-yellow-400 font-semibold">
                          {match.roomId}
                        </span>
                      </p>
                      <p>
                        Password:{" "}
                        <span className="text-yellow-400 font-semibold">
                          {match.password}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-sm">
                      Room ID & Password will unlock 15 min before start 🔒
                    </div>
                  )}

                  <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200">
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
    </div>
  );
}
