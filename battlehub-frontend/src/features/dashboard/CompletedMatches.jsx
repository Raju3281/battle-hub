import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function CompletedMatches() {
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch today completed matches from backend
  const loadCompleted = async () => {
    try {
      const res = await api.get("/matches/completed/today");
      setCompletedMatches(res.data.matches || []);
    } catch (err) {
      console.error("Error fetching completed matches:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCompleted();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center text-gray-300 py-10">
        Loading completed matches...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
        Completed Matches 🏆
      </h2>

      {completedMatches.length > 0 ? (
        <div className="grid gap-6">
          {completedMatches.map((match) => (
            <div
              key={match._id}
              className="bg-gray-900/80 border border-gray-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
            >
              {/* Match Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {match.matchName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(match.matchTime).toLocaleString()} •{" "}
                    {match.matchType} • Prize Pool:{" "}
                    <span className="text-yellow-400 font-semibold">
                      ₹{match.prizePool}
                    </span>
                  </p>
                </div>

                {match.results?.highestKill?.teamName ? (
                  <div className="text-yellow-400 font-semibold mt-3 sm:mt-0">
                    🏅 Highest Kills: {match.results.highestKill.teamName} 
                    {/* ({match.results.highestKill.kills || 0}) */}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    Highest killer not updated
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300 border-collapse">
                  <thead className="bg-gray-800 text-yellow-400 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left rounded-tl-lg">Rank</th>
                      <th className="px-4 py-2 text-left">Team Name</th>
                      <th className="px-4 py-2 text-center">Kills</th>
                      <th className="px-4 py-2 text-center rounded-tr-lg">
                        Prize Won
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {match.results?.winners?.length > 0 ? (
                      match.results.winners.map((team, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-800 ${
                            index === 0
                              ? "bg-yellow-500/10"
                              : "hover:bg-gray-800/50"
                          }`}
                        >
                          <td className="px-4 py-2 font-semibold text-yellow-400">
                            #{index + 1}
                          </td>
                          <td className="px-4 py-2 font-medium">
                            {team.teamName}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {team.kills}
                          </td>
                          <td className="px-4 py-2 text-center text-green-400 font-semibold">
                            ₹{team.prize}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4 text-gray-500 italic"
                        >
                          Results not updated yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-20">
          No completed matches today 😴
        </div>
      )}
    </div>
  );
}
