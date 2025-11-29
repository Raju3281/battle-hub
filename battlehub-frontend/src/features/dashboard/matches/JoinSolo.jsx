import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import EncryptedStorage from "../../../utils/encryptedStorage";
import { toast, ToastContainer } from "react-toastify";

export default function JoinSolo() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(EncryptedStorage.get("battlehub_user"));
  const userId = user?.userId;

  const [formData, setFormData] = useState({
    playerName: "",
    inGameId: "",
  });

  const [loading, setLoading] = useState(false);
  const [matchFee, setMatchFee] = useState(0);

  // Fetch match fee like in Squad
  useEffect(() => {
    api
      .get(`matches/matchFee/${matchId}`)
      .then((res) => setMatchFee(res.data.entryFee))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!formData.playerName || !formData.inGameId) {
      return toast.error("Please fill all fields!");
    }

    setLoading(true);

    try {
      const payload = {
        userId,
        players: [{ playerName: formData.playerName, inGameId: formData.inGameId }],
      };

      const res = await api.post(`/matches/join/${matchId}`, payload);

      toast.success("Solo Registered Successfully! 🎯");
      setFormData({ playerName: "", inGameId: "" });
      setLoading(false);
    } catch (error) {
      console.error("Join Error:", error);
      setLoading(false);

      if (error?.response?.data?.duplicateId) {
        toast.error(
          `BGMI ID ${error.response.data.duplicateId} is already registered in another team.`
        );
      } else {
        toast.error(error?.response?.data?.message || "Error joining match!");
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <ToastContainer theme="dark" position="top-right" />
      <div className="p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Join Solo Match 🎯
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Player Name</label>
            <input
              type="text"
              required
              value={formData.playerName}
              onChange={(e) =>
                setFormData({ ...formData, playerName: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 text-white placeholder-gray-500"
              placeholder="Enter BGMI Name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">BGMI ID</label>
            <input
              type="text"
              required
              value={formData.inGameId}
              onChange={(e) =>
                setFormData({ ...formData, inGameId: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 text-white placeholder-gray-500"
              placeholder="Enter BGMI ID"
            />
          </div>

          <h2 className="text-xl font-bold text-yellow-400 text-center">
            Entry Fee: Rs.{matchFee}
          </h2>
          <h2 className="text-xs font-bold text-white text-center mb-4">
            Referral balance is debited first (if available), remaining from wallet.
          </h2>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg mt-4 w-full ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register Solo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
