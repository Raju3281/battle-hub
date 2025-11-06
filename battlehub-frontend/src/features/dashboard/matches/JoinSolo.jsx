import { useState } from "react";

export default function JoinSolo() {
  const [formData, setFormData] = useState({
    name: "",
    bgmiId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Solo Registered:", formData);
    alert("Solo Match Registered Successfully! 🏆");
  };

  return (
    <div className="w-full flex justify-center">
      <div className=" p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Join Solo Match 🎯
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Player Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
              value={formData.bgmiId}
              onChange={(e) =>
                setFormData({ ...formData, bgmiId: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 text-white placeholder-gray-500"
              placeholder="Enter BGMI ID"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg mt-4 transition-all duration-200"
            >
              Register Solo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
