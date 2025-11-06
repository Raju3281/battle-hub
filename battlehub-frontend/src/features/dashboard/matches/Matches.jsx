import { NavLink, Outlet } from "react-router-dom";

export default function Matches() {
  const tabs = [
    { path: "squad", label: "Squad" },
    { path: "duo", label: "Duo" },
    { path: "solo", label: "Solo" },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
        Select Match Type ⚔️
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-yellow-500 text-black shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Nested route content */}
      <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl min-h-[60vh]">
        <Outlet />
      </div>
    </div>
  );
}
