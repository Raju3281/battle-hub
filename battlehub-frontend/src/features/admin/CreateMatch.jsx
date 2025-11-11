import React, { useState } from "react";

export default function CreateMatch() {
  const [matchName, setMatchName] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [prize, setPrize] = useState("");
  const [matchType, setMatchType] = useState("solo");
  const [matchTime, setMatchTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchData = {
      matchName,
      entryFee,
      prize,
      matchType,
      matchTime,
    };
    console.log("New Match Created:", matchData);
    alert("Match Created Successfully!");
    // TODO: Send matchData to backend (API)
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create New Match</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Match Name"
          value={matchName}
          onChange={(e) => setMatchName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Entry Fee"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Prize"
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="solo">Solo</option>
          <option value="duo">Duo</option>
          <option value="squad">Squad</option>
        </select>
        <input
          type="datetime-local"
          value={matchTime}
          onChange={(e) => setMatchTime(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
