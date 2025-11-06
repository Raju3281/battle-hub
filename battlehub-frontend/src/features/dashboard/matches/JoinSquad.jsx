import { useState } from "react";

export default function JoinSquad() {
  const [formData, setFormData] = useState({
    teamName: "",
    players: [
      { name: "", bgmiId: "" },
      { name: "", bgmiId: "" },
      { name: "", bgmiId: "" },
      { name: "", bgmiId: "" },
    ],
  });

  const handleChange = (index, field, value) => {
    const updatedPlayers = [...formData.players];
    updatedPlayers[index][field] = value;
    setFormData({ ...formData, players: updatedPlayers });
  };

  const handleTeamChange = (e) => {
    setFormData({ ...formData, teamName: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Squad Registered:", formData);
    alert("Squad Registered Successfully! ⚔️");
    // 👉 later connect to API POST /api/matches/join
  };

  return (
    <div className="w-full flex justify-center">
      <div className=" p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Join Squad Match 🎮
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Team Name
            </label>
            <input
              type="text"
              required
              value={formData.teamName}
              onChange={handleTeamChange}
              placeholder="Enter your team name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 text-white placeholder-gray-500"
            />
          </div>

          {/* Player Inputs */}
          <div className="grid gap-4">
            {formData.players.map((player, index) => (
              <div
                key={index}
                className="bg-gray-800/80 p-4 rounded-xl border border-gray-700"
              >
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Player {index + 1}
                  {index === 0 && (
                    <span className="text-gray-400 text-sm"> (Leader)</span>
                  )}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Player Name
                    </label>
                    <input
                      type="text"
                      required
                      value={player.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      placeholder="Enter BGMI Name"
                      className="w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-400 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      BGMI ID
                    </label>
                    <input
                      type="text"
                      required
                      value={player.bgmiId}
                      onChange={(e) =>
                        handleChange(index, "bgmiId", e.target.value)
                      }
                      placeholder="Enter BGMI ID"
                      className="w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-yellow-400 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg mt-4 transition-all duration-200"
            >
              Register Squad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
