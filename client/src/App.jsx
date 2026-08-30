import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoutes from './components/ProtectedRoutes'
import Protectedlayout from './components/Protectedlayout'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Pricing from './pages/Pricing'
import MeetingRoom from './pages/MeetingRoom'

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/* public routes */}
         <Route path="/login" element={<Login mode="login" />} />
         <Route path="/register" element={<Login mode="register" />} />
        {/* private routes */}
         <Route element={<ProtectedRoutes />}>
           <Route element={<Protectedlayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/pricing" element={<Pricing />} />
           </Route>
           <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
         </Route>
        {/* other routes */}
         <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App
