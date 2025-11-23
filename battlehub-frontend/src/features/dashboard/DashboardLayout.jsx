import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import EncryptedStorage from "../../utils/encryptedStorage";
import { Auth } from "../../utils/auth";
import api from "../../utils/api";
import { LogOutIcon } from "lucide-react";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Matches", path: "matches" },
    { name: "Booked Matches", path: "booked" },
    { name: "Completed Matches", path: "completed" },
    { name: "Recharge", path: "recharge" },
    { name: "Watch on Youtube", path: "watch" },
    { name: "Refer and Earn", path: "refer-earn" },
    { name: "💬 Help/Suppport", path: "help-support" },
  ];

  const [userBalance, setUserBalance] = useState(0);

  const getUserBalance = async (id) => {
    const res = await api.get(`/payments/balance/${id}`);
    EncryptedStorage.set("user_balance", res.data.balance);
    setUserBalance(res.data.balance);
  };

  useEffect(() => {
    const id = JSON.parse(EncryptedStorage.get("battlehub_user")).userId;

    getUserBalance(id);
    const interval = setInterval(() => getUserBalance(id), 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex bg-gray-950 text-white overflow-hidden">

      {/* SIDEBAR */}
      <div
        className={`fixed md:relative h-full bg-gray-900 border-r border-gray-800 p-4 flex flex-col justify-between transition-all duration-300 z-40
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
        md:translate-x-0 md:w-64 overflow-hidden`}
      >
        {/* Top section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-yellow-400">BattleHub ⚔️</h1>

            {/* Close button (mobile only) */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-yellow-400 hover:text-yellow-300 text-2xl leading-none md:hidden"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
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
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* HEADER (fixed inside right area) */}
        <header className="flex justify-between items-center bg-gray-900 border-b border-gray-800 px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setIsOpen(true)}
              className="text-yellow-400 text-2xl leading-none md:hidden"
            >
              ☰
            </button>

            <h2 className="text-lg font-semibold text-yellow-400 hidden md:block">
              {JSON.parse(EncryptedStorage.get("battlehub_user")).username}
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex items-center w-auto gap-4">

            {/* Wallet */}
            <div
              onClick={() => navigate("wallet")}
              className="flex items-center gap-4 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
            >
              <span className="text-yellow-400 text-lg">💰</span>
              <span className="font-semibold text-yellow-400">{userBalance}</span>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                Auth.logout();
                navigate("/login");
              }}
              title="Logout"
              className="block text-sm w-full text-left rounded-lg font-medium text-gray-400 hover:bg-gray-800 hover:text-yellow-400 p-2"
            >
              <LogOutIcon />
            </button>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
