export default function CompletedMatches() {
  // Sample top 5 results (later you’ll fetch this from backend)
  const completedMatches = [
    {
      id: 1,
      title: "Erangel Squad Match",
      type: "Squad",
      date: "Nov 4, 2025",
      prizePool: "₹500",
      topTeams: [
        { rank: 1, team: "Team Hydra", kills: 25, prize: "₹250" },
        { rank: 2, team: "Soul X", kills: 18, prize: "₹150" },
        { rank: 3, team: "GodL Alpha", kills: 12, prize: "₹70" },
        { rank: 4, team: "Nexus OP", kills: 8, prize: "₹20" },
        { rank: 5, team: "BG Titans", kills: 6, prize: "₹10" },
      ],
      topKiller: { name: "Hydra ZEN", kills: 10 },
    },
    {
      id: 2,
      title: "Livik Duo Battle",
      type: "Duo",
      date: "Nov 3, 2025",
      prizePool: "₹300",
      topTeams: [
        { rank: 1, team: "Alpha Duo", kills: 16, prize: "₹150" },
        { rank: 2, team: "The Ghosts", kills: 12, prize: "₹80" },
        { rank: 3, team: "VenomX", kills: 9, prize: "₹40" },
        { rank: 4, team: "Rogue Bros", kills: 7, prize: "₹20" },
        { rank: 5, team: "Thunder", kills: 5, prize: "₹10" },
      ],
      topKiller: { name: "VenomX Leo", kills: 9 },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
       Today Completed Matches 🏆
      </h2>

      {completedMatches.length > 0 ? (
        <div className="grid gap-6">
          {completedMatches.map((match) => (
            <div
              key={match.id}
              className="bg-gray-900/80 border border-gray-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
            >
              {/* Match Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {match.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {match.date} • {match.type} • Prize Pool:{" "}
                    <span className="text-yellow-400 font-semibold">
                      {match.prizePool}
                    </span>
                  </p>
                </div>
                <div className="text-yellow-400 font-semibold mt-3 sm:mt-0">
                  🏅 Highest Kills: {match.topKiller.name} ({match.topKiller.kills})
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300 border-collapse">
                  <thead className="bg-gray-800 text-yellow-400 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left rounded-tl-lg">Rank</th>
                      <th className="px-4 py-2 text-left">Team Name</th>
                      <th className="px-4 py-2 text-center">Kills</th>
                      <th className="px-4 py-2 text-center rounded-tr-lg">Prize Won</th>
                    </tr>
                  </thead>
                  <tbody>
                    {match.topTeams.map((team, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-800 ${
                          team.rank === 1
                            ? "bg-yellow-500/10"
                            : "hover:bg-gray-800/50"
                        }`}
                      >
                        <td className="px-4 py-2 font-semibold text-yellow-400">
                          #{team.rank}
                        </td>
                        <td className="px-4 py-2 font-medium">{team.team}</td>
                        <td className="px-4 py-2 text-center">{team.kills}</td>
                        <td className="px-4 py-2 text-center text-green-400 font-semibold">
                          {team.prize}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-20">
          No completed matches yet 😴
        </div>
      )}
    </div>
  );
}
