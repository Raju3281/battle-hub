import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import EncryptedStorage from "../../../utils/encryptedStorage";
import { toast, ToastContainer } from "react-toastify";

export default function JoinTdm() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;

  const [matchInfo, setMatchInfo] = useState(null);
  const [matchFee, setMatchFee] = useState(0);
  const [loading, setLoading] = useState(false);

  // Default form structure
  const [formData, setFormData] = useState({
    teamName: "",
    players: [],
  });

  // Fetch match info (to extract members count)
  useEffect(() => {
    api
      .get(`/matches/${matchId}`)
      .then((res) => {
        setMatchInfo(res.data);

        // Parse "tdm,2v2,M24"
        const [type, members] = res.data.matchMap.split(",");
        const playerCount = parseInt(members.split("v")[0]); // Extract number before 'v'

        // Initialize players array dynamically
        setFormData({
          teamName: "",
          players: Array(playerCount)
            .fill()
            .map(() => ({ playerName: "", inGameId: "" })),
        });
      })
      .catch(() => toast.error("Failed to fetch match details"));
  }, [matchId]);

  // Entry Fee Fetch
  useEffect(() => {
    api
      .get(`matches/matchFee/${matchId}`)
      .then((res) => setMatchFee(res.data.entryFee))
      .catch(() => console.error("Fetch Error"));
  }, [matchId]);

  // Handle input updates
  const handlePlayerChange = (index, field, value) => {
    const updated = [...formData.players];
    updated[index][field] = value;
    setFormData({ ...formData, players: updated });
  };

  const handleTeamChange = (e) => {
    setFormData({ ...formData, teamName: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // 🔥 SAME PAYLOAD AS SQUAD
      const payload = {
        userId,
        teamName: formData.teamName,
        players: formData.players,
      };

      const res = await api.post(`/matches/join/${matchId}`, payload);

      toast.success("TDM Registration Successful!");
      setLoading(false);
      setFormData({
        teamName: "",
        players: formData.players.map(() => ({ playerName: "", inGameId: "" })),
      });

    //   navigate("/dashboard");
    } catch (error) {
      setLoading(false);

      if (error?.response?.data?.duplicateId) {
        toast.error(
          `Duplicate BGMI ID: ${error.response.data.duplicateId} already registered`
        );
      } else {
        toast.error(error?.response?.data?.message || "Error joining match!");
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <ToastContainer theme="dark" position="top-right" />

      <div className="p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Join TDM Match 🎯
        </h2>

        {/* Show match info */}
        {matchInfo && (
          <div className="bg-gray-800 p-4 rounded-lg text-gray-300 mb-6">
            <p>
              <span className="text-yellow-400 font-semibold">Mode:</span>{" "}
              {matchInfo.matchMap.split(",")[0].toUpperCase()}
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Members:</span>{" "}
              {matchInfo.matchMap.split(",")[1]}
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">Gun:</span>{" "}
              {matchInfo.matchMap.split(",")[2]}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name - Matching Squad Format */}
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
              placeholder="Enter Team Name or (Your Name)"
            />
          </div>

          {/* Dynamic Players */}
          <div className="grid gap-4">
            {formData.players.map((player, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-xl">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Player {index + 1}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={player.playerName}
                    onChange={(e) =>
                      handlePlayerChange(index, "playerName", e.target.value)
                    }
                    className="p-2.5 rounded-lg bg-gray-900"
                    placeholder="Player Name"
                  />

                  <input
                    type="text"
                    required
                    value={player.inGameId}
                    onChange={(e) =>
                      handlePlayerChange(index, "inGameId", e.target.value)
                    }
                    className="p-2.5 rounded-lg bg-gray-900"
                    placeholder="BGMI ID"
                  />
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-yellow-400 text-center">
            Entry Fee: Rs.{matchFee}
          </h2>

          <p className="text-sm text-gray-400 text-center mb-4">
            Referral balance will be debited automatically if available.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg w-full"
          >
            {loading ? "Registering..." : "Register TDM"}
          </button>
        </form>
      </div>
    </div>
  );
}
