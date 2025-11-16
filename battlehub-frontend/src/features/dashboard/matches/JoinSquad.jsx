import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import EncryptedStorage from "../../../utils/encryptedStorage";

export default function JoinSquad() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;

  // Player structure MUST match backend
  const [formData, setFormData] = useState({
    teamName: "",
    players: [
      { playerName: "", inGameId: "" },
      { playerName: "", inGameId: "" },
      { playerName: "", inGameId: "" },
      { playerName: "", inGameId: "" },
    ],
  });

  // Update players input
  const handleChange = (index, field, value) => {
    const updated = [...formData.players];
    updated[index][field] = value;
    setFormData({ ...formData, players: updated });
  };

  const handleTeamChange = (e) => {
    setFormData({ ...formData, teamName: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        userId,
        teamName: formData.teamName,
        players: formData.players, // backend expects name & inGameId
      };

      const res = await api.post(`/matches/join/${matchId}`, payload);

      console.log("Joined:", res.data);
      alert("Squad Registered Successfully!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Join Error:", error);

      // Show duplicate BGMI ID if exists
      if (error?.response?.data?.duplicateId) {
        alert(
          `Duplicate BGMI ID: ${error.response.data.duplicateId} already registered for this match`
        );
      } else {
        alert(error?.response?.data?.message || "Error joining match!");
      }
    }
  };
  const [matchFee,setMatchFee]=useState(0);
useEffect(() => {
   api
      .get(`matches/matchFee/${matchId}`)
      .then((res) => setMatchFee(res.data.entryFee))
      .catch((err) => console.error("Fetch Error:", err));
}, []);

  return (
    <div className="w-full flex justify-center">
      <div className="p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl">

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
              className="w-full p-3 rounded-lg bg-gray-800"
              placeholder="Enter Team Name"
            />
          </div>

          {/* Players */}
          <div className="grid gap-4">
            {formData.players.map((player, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-xl">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Player {index + 1}
                  {index === 0 && (
                    <span className="text-gray-400 text-sm"> (Leader)</span>
                  )}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={player.name}
                    onChange={(e) =>
                      handleChange(index, "playerName", e.target.value)
                    }
                    className="p-2.5 rounded-lg bg-gray-900"
                    placeholder="Player Name"
                  />

                  <input
                    type="text"
                    required
                    value={player.inGameId}
                    onChange={(e) =>
                      handleChange(index, "inGameId", e.target.value)
                    }
                    className="p-2.5 rounded-lg bg-gray-900"
                    placeholder="BGMI ID"
                  />
                </div>
              </div>
            ))}
          </div>
<h2 className="text-xl font-bold text-yellow-400 text-center mb-6">
          Entry Fee: Rs.{matchFee} 
        </h2>
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg w-full"
          >
            Register Squad
          </button>
        </form>
      </div>
    </div>
  );
}
