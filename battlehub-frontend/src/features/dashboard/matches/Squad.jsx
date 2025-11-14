import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function Squad() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api.get("matches/squad")
      .then((res) => setMatches(res.data.matches))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);
  return (
    <div>
      <h3 className="text-xl font-bold text-yellow-400 mb-4">
        Squad Matches
      </h3>

      <div className="grid gap-4">
        {matches.map((m) => (
          <div
            key={m._id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:shadow-yellow-500/30 transition"
          >
            <div>
              <h4 className="font-semibold">{m.matchName}</h4>
              <p className="text-gray-400 text-sm">{m.matchTime}</p>
              <p className="text-yellow-400 text-sm">Entry fee : Rs.{m.entryFee}</p>
            </div>

            <button
              onClick={() => navigate(`/dashboard/matches/squad/join/${m._id}`)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-lg font-medium"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
