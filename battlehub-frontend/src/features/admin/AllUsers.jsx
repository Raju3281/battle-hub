import React, { useState, useEffect } from "react";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState(null);

  // 🧠 Mock API: Load all users
  useEffect(() => {
    const mockUsers = [
      {
        id: "U001",
        name: "Raju Kuthadi",
        phone: "9999990001",
        email: "raju@example.com",
        team: "Team Alpha",
        wallet: 120,
        upi: "raju@upi",
        isBlocked: false,
        matchesPlayed: 8,
        rank: "Diamond",
        joinDate: "2025-10-01",
      },
      {
        id: "U002",
        name: "John Wick",
        phone: "9999990002",
        email: "john@example.com",
        team: "Team Bravo",
        wallet: 80,
        upi: "",
        isBlocked: true,
        matchesPlayed: 5,
        rank: "Gold",
        joinDate: "2025-09-25",
      },
      {
        id: "U003",
        name: "Sai Kumar",
        phone: "9999990003",
        email: "sai@example.com",
        team: "Team Charlie",
        wallet: 150,
        upi: "sai@ybl",
        isBlocked: false,
        matchesPlayed: 10,
        rank: "Platinum",
        joinDate: "2025-09-18",
      },
      {
        id: "U004",
        name: "Arjun Das",
        phone: "9999990004",
        email: "arjun@example.com",
        team: "Team Delta",
        wallet: 45,
        upi: "arjun@okaxis",
        isBlocked: false,
        matchesPlayed: 3,
        rank: "Silver",
        joinDate: "2025-10-08",
      },
    ];
    setUsers(mockUsers);
  }, []);

  // 🔍 Search logic
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.team.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.upi.toLowerCase().includes(search.toLowerCase())
  );

  // 🚫 Block / Unblock
  const toggleBlockUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        All Registered Users 👥
      </h2>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, team, phone, or UPI..."
          className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700 w-full md:w-96"
        />
        <p className="text-gray-400 text-sm">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800 text-yellow-400">
            <tr>
              <th className="p-3 border-b border-gray-700">User ID</th>
              <th className="p-3 border-b border-gray-700">Name</th>
              <th className="p-3 border-b border-gray-700">Phone</th>
              <th className="p-3 border-b border-gray-700">Team</th>
              <th className="p-3 border-b border-gray-700">UPI ID</th>
              <th className="p-3 border-b border-gray-700">Wallet (₹)</th>
              <th className="p-3 border-b border-gray-700">Status</th>
              <th className="p-3 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className={`hover:bg-gray-800 transition ${
                    u.isBlocked ? "opacity-60" : ""
                  }`}
                >
                  <td className="p-3 border-b border-gray-800 text-gray-400">
                    {u.id}
                  </td>
                  <td className="p-3 border-b border-gray-800">{u.name}</td>
                  <td className="p-3 border-b border-gray-800">{u.phone}</td>
                  <td className="p-3 border-b border-gray-800 text-yellow-400">
                    {u.team}
                  </td>
                  <td className="p-3 border-b border-gray-800">
                    {u.upi ? (
                      <span className="text-green-400">{u.upi}</span>
                    ) : (
                      <span className="text-gray-500 italic">Not added</span>
                    )}
                  </td>
                  <td className="p-3 border-b border-gray-800">₹{u.wallet}</td>
                  <td className="p-3 border-b border-gray-800">
                    {u.isBlocked ? (
                      <span className="text-red-500 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-400 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="p-3 border-b border-gray-800 flex gap-2">
                    <button
                      onClick={() => toggleBlockUser(u.id)}
                      className={`px-3 py-1 rounded font-semibold transition ${
                        u.isBlocked
                          ? "bg-green-600 hover:bg-green-500 text-white"
                          : "bg-red-600 hover:bg-red-500 text-white"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => setViewUser(u)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="p-4 text-center text-gray-400 border-t border-gray-800"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewUser && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setViewUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-yellow-500 rounded-lg p-6 w-[90%] max-w-lg shadow-lg"
          >
            <h3 className="text-xl text-yellow-400 font-bold mb-4">
              {viewUser.name}
            </h3>

            <div className="space-y-2 text-gray-300">
              <p>
                🆔 User ID:{" "}
                <span className="text-yellow-400">{viewUser.id}</span>
              </p>
              <p>
                📞 Phone:{" "}
                <span className="text-yellow-400">{viewUser.phone}</span>
              </p>
              <p>
                ✉️ Email:{" "}
                <span className="text-yellow-400">{viewUser.email}</span>
              </p>
              <p>
                🧑‍🤝‍🧑 Team:{" "}
                <span className="text-yellow-400">{viewUser.team}</span>
              </p>
              <p>
                🪙 Wallet Balance:{" "}
                <span className="text-green-400 font-semibold">
                  ₹{viewUser.wallet}
                </span>
              </p>
              <p>
                💳 UPI ID:{" "}
                {viewUser.upi ? (
                  <span className="text-yellow-400">{viewUser.upi}</span>
                ) : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
              <p>
                🎮 Matches Played:{" "}
                <span className="text-yellow-400">{viewUser.matchesPlayed}</span>
              </p>
              <p>
                🏆 Rank:{" "}
                <span className="text-yellow-400">{viewUser.rank}</span>
              </p>
              <p>
                📅 Joined On:{" "}
                <span className="text-yellow-400">{viewUser.joinDate}</span>
              </p>
              <p>
                🚫 Status:{" "}
                {viewUser.isBlocked ? (
                  <span className="text-red-500 font-semibold">Blocked</span>
                ) : (
                  <span className="text-green-400 font-semibold">Active</span>
                )}
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => toggleBlockUser(viewUser.id)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  viewUser.isBlocked
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                {viewUser.isBlocked ? "Unblock User" : "Block User"}
              </button>
              <button
                onClick={() => setViewUser(null)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
