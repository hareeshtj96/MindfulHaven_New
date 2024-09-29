import React from "react"
import {BrowserRouter as Router,  Routes, Route} from 'react-router-dom'
import UserRoute from "./Routes/UserRoutes/UserRoute"
import TherapistRoutes from "./Routes/TherapistRoutes/TherapistRoutes"
import AdminRoute from "./Routes/AdminRoutes/AdminRoute"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/*" element={ <UserRoute />} />
        <Route path="/therapist/*" element={ <TherapistRoutes />}/>
        <Route path="/admin/*" element={ <AdminRoute />  } /> 
      </Routes>
    </Router>
  )
}

export default App
