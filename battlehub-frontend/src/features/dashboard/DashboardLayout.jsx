import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import EncryptedStorage from "../../utils/encryptedStorage";
import { Auth } from "../../utils/auth";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);
const navigate = useNavigate();
  const menuItems = [
    { name: "Matches", path: "matches" },
    { name: "Booked Matches", path: "booked" },
    { name: "Completed Matches", path: "completed" },
    { name: "Recharge", path: "recharge" },
    { name: "Watch on Youtube", path: "watch" },
  ];
  useEffect(() => {
    EncryptedStorage.set("user_balance", 0);


  }, []);

  return (
    <div className="w-full h-full flex bg-gray-950 text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:static  h-screen bg-gray-900 border-r border-gray-800 p-4 flex flex-col justify-between transition-all duration-300 z-40 ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        } md:translate-x-0`}
      >
        {/* Top section */}
        <div>
          {/* Logo & close button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-yellow-400">BattleHub ⚔️</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-yellow-400 hover:text-yellow-300 text-2xl leading-none md:hidden"
            >
              ✕
            </button>
          </div>

          {/* Navigation menu */}
        <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
            <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
                `flex items-center rounded-lg px-4 py-3 font-medium transition-all duration-200 
                ${
                isActive
                    ? "bg-yellow-500 text-black shadow-lg"
                    : "bg-transparent hover:bg-gray-800 text-gray-300"
                }`
            }
            >
            {item.name}
            </NavLink>
        ))}
        </nav>
        </div>
         {/* Logout / Support */}
        {/* <div className="border-t border-gray-800 pt-4 mt-6"> */}
          <button
            onClick={() => 
              {Auth.logout();
                navigate("/login")}}
            className="block w-full text-left rounded-lg px-3 font-medium text-gray-400 hover:bg-gray-800 hover:text-yellow-400"
          >
            🚪 Logout
          </button>

        {/* Help/Support fixed at bottom */}
        <div className="border-t border-gray-800 pt-4 mt-6">
          <NavLink
            to="help"
            className="block rounded-lg px-3 py-2 font-medium text-gray-400 hover:bg-gray-800 hover:text-yellow-400"
          >
            💬 Help / Support
          </NavLink>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        {/* Header */}
<header className="flex justify-between items-center bg-gray-900 border-b border-gray-800 px-6 py-3 sticky top-0 z-20">
  <div className="flex items-center gap-3">
    {/* Hamburger (mobile only) */}
    <button
      onClick={() => setIsOpen(true)}
      className="text-yellow-400 text-2xl leading-none md:hidden"
    >
      ☰
    </button>

    <h2 className="text-lg font-semibold text-yellow-400 hidden md:block">
      John Wick
    </h2>
  </div>

  {/* Right Section — Wallet + Profile */}
  <div className="flex items-center gap-6">
    {/* Wallet Display */}
    <div
      onClick={() => navigate("wallet")}
      className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
    >
      <span className="text-yellow-400 text-lg">💰</span>
      <span className="font-semibold text-yellow-400">{EncryptedStorage.get("user_balance")}</span>
    </div>

    {/* Profile */}
    <div className="flex items-center gap-3">
      <span className="text-gray-300 hidden sm:inline">Hi, Raju</span>
      <img
        src="https://ui-avatars.com/api/?name=R+K&background=yellow&color=black"
        alt="Profile"
        className="w-10 h-10 rounded-full border border-yellow-400"
      />
    </div>
  </div>
</header>


        {/* Main Page Content */}
        <main className="flex-1 w-full p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
