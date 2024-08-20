import React from "react"
import {BrowserRouter as Router,  Routes, Route} from 'react-router-dom'
import UserRoute from "./Routes/UserRoutes/UserRoute"
import TherapistRoutes from "./Routes/TherapistRoutes/TherapistRoutes"
import AdminRoute from "./Routes/AdminRoutes/AdminRoute"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoute />} />
        <Route path="/therapist/*" element={<TherapistRoutes />}/>
        <Route path="/admin/*" element={<AdminRoute />} /> 
      </Routes>
    </Router>
  )
}

export default App
