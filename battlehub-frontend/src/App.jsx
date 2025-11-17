import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import AdminLayout from './features/admin/AdminLayout';
import CreateMatch from './features/admin/CreateMatch';
import ApprovePayments from './features/admin/ApprovePayments';
import UpdateResults from './features/admin/UpdateResults';
import AllUsers from './features/admin/AllUsers';
import SetPrizePool from './features/admin/SetPrizePool';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateLiveLinks from './features/admin/UpdateLiveLinks';
import RoomIdPass from './features/admin/RoomIdPass';
import HelpSupport from './features/dashboard/Help';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          {/* <Route path="/dashboard" element={<DashboardLayout />}> */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowed="user">
              <DashboardLayout />
            </ProtectedRoute>}>
            <Route index element={<Navigate to="matches" replace />} />
            <Route path="matches" element={<Matches />}>
              <Route index element={<Navigate to="squad" replace />} />{/* Default tab */}
              <Route path="squad" element={<Squad />} />
              {/* <Route path="squad/join" element={<JoinSquad />} />  */}
              <Route path="squad/join/:matchId" element={<JoinSquad />} />
              <Route path="duo" element={<Duo />} />
              <Route path="duo/join" element={<JoinDuo />} />

              <Route path="solo" element={<Solo />} />
              <Route path="solo/join" element={<JoinSolo />} />
              
            </Route>
            <Route path="help-support" element={<HelpSupport />} />
            <Route path="booked" element={<BookedMatches />} />
            <Route path="completed" element={<CompletedMatches />} />
            <Route path="recharge" element={<Recharge />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="watch" element={<WatchOnYouTube />} />

          </Route>
          {/* <Route path="/admin" element={<AdminLayout />}> */}
          <Route path="/admin" element={
            <ProtectedRoute allowed="admin">
              <AdminLayout />
            </ProtectedRoute>}>
            <Route index element={<Navigate to="approve-payment" replace />} />
            <Route path="approve-payment" element={<ApprovePayments />} />
            <Route path="create-match" element={<CreateMatch />} />
            <Route path="prize" element={<SetPrizePool />} />
            {/* <Route path="schedule" element={<Schedule />} /> */}
            <Route path="update-results" element={<UpdateResults />} />
            <Route path="registered-users" element={<AllUsers />} />
            <Route path="live-links" element={<UpdateLiveLinks />} />
            <Route path="id-pass" element={<RoomIdPass />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
