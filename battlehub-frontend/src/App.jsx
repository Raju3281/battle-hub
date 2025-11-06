import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import DashboardLayout from './features/dashboard/DashboardLayout';
import Matches from './features/dashboard/matches/Matches';
import BookedMatches from './features/dashboard/BookedMatches';
import CompletedMatches from './features/dashboard/CompletedMatches';
import Recharge from './features/dashboard/Recharge';
import Solo from './features/dashboard/matches/Solo';
import Duo from './features/dashboard/matches/Duo';
import Squad from './features/dashboard/matches/Squad';
import JoinSquad from './features/dashboard/matches/JoinSquad';
import JoinSolo from './features/dashboard/matches/JoinSolo';
import JoinDuo from './features/dashboard/matches/JoinDuo';
import Wallet from './features/dashboard/Wallet';
import WatchOnYouTube from './features/dashboard/WatchOnYoutube';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="matches" replace />} />
          <Route path="matches" element={<Matches />}>
            <Route index element={<Navigate to="squad" replace />} />{/* Default tab */}
            <Route path="squad" element={<Squad />} />
             <Route path="squad/join" element={<JoinSquad />} /> 
             <Route path="duo" element={<Duo />} />
            <Route path="duo/join" element={<JoinDuo />} />

            <Route path="solo" element={<Solo />} />
            <Route path="solo/join" element={<JoinSolo />} />
          </Route>
          
          <Route path="booked" element={<BookedMatches />} />
          <Route path="completed" element={<CompletedMatches />} />
          <Route path="recharge" element={<Recharge />} />
          <Route path="wallet" element={<Wallet />} /> 
           <Route path="watch" element={<WatchOnYouTube />} />
        </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
