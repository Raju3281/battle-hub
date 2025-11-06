import { useNavigate } from "react-router-dom";

export default function Squad() {
  const navigate = useNavigate();

  const matches = [
    { id: 1, title: "Erangel Squad Match", time: "Today 6:00 PM", entryFee: 50 },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-yellow-400 mb-4">Squad Matches</h3>
      <div className="grid gap-4">
        {matches.map((m) => (
          <div
            key={m.id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:shadow-yellow-500/30 transition"
          >
            <div>
              <h4 className="font-semibold">{m.title}</h4>
              <p className="text-gray-400 text-sm">{m.time}</p>
            </div>
            <button
              onClick={() => navigate("join")}
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
