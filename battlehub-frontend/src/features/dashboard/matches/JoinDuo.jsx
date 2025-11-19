import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function JoinDuo() {
  const [formData, setFormData] = useState({
    teamName: "",
    players: [
      { name: "", bgmiId: "" },
      { name: "", bgmiId: "" },
    ],
  });

  const handleChange = (i, field, value) => {
    const updatedPlayers = [...formData.players];
    updatedPlayers[i][field] = value;
    setFormData({ ...formData, players: updatedPlayers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Duo Registered:", formData);
    toast.success("Duo Registered Successfully! ⚔️");
  };

  return (
    <div className="w-full flex justify-center">
            <ToastContainer theme="dark" position="top-right" />

      <div className=" p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Join Duo Match 🎮
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Team Name</label>
            <input
              type="text"
              required
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 text-white placeholder-gray-500"
              placeholder="Enter team name"
            />
          </div>

          <div className="grid gap-4">
            {formData.players.map((player, i) => (
              <div key={i} className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Player {i + 1} {i === 0 && <span className="text-gray-400 text-sm">(Leader)</span>}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={player.name}
                      onChange={(e) => handleChange(i, "name", e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-yellow-400 text-white placeholder-gray-500"
                      placeholder="Enter BGMI name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">BGMI ID</label>
                    <input
                      type="text"
                      required
                      value={player.bgmiId}
                      onChange={(e) => handleChange(i, "bgmiId", e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-yellow-400 text-white placeholder-gray-500"
                      placeholder="Enter BGMI ID"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg mt-4 transition-all duration-200"
            >
              Register Duo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
