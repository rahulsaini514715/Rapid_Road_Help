//-----------------------------------------------------------

import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../src/App.css";

// Components
import Navbar from "./Components/User_Panel/Navbar/Navbar";
import AdminNavbar from "./Components/User_Panel/Navbar/AdminNavbar";
import Dashboard from "./Components/User_Panel/Dashboard/Dashboard";
import About_Us from "./Components/User_Panel/About_Us/About_Us";
import Service from "./Components/User_Panel/Service/Service";
import Track_Request from "./Components/User_Panel/Track_Request/Track_Request";
import ContactUs from "./Components/User_Panel/Contact_Us/Contact_Us";
import FAQ from "./Components/User_Panel/FAQs.jsx/FAQs";
import LoginPage from "./Components/Pages/LoginPage/LoginPage";
import SignupPage from "./Components/Pages/SignupPage/SignupPage";
import GarageRegister from "./Components/Admin_panel/Shop_Register/GarageRegister";
import Status_Update from "./Components/Admin_panel/Status_Update/Status_Update";

import { AuthProvider, AuthContext } from "./Components/AuthContext/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import History from "./Components/Admin_panel/History/History";
import GarageHistory from "./Components/Admin_panel/Garages/Garages";
import Garage_Update from "./Components/Admin_panel/Garage_Update/Garage_Update"
import Mechanic from "./Components/Admin_panel/Mechanic/Mechanic";
function App() {
  
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

// ✅ Separate component so we can use AuthContext
function AppContent() {
  const { user } = useContext(AuthContext);

  console.log("Current User:", user);

  // 🟢 Case 1: Agar user null hai (login hi nahi kiya)
  if (!user) {
    return (
      <>
        <Navbar showLimited={true} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<About_Us />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="*" element={<LoginPage />} /> {/* default redirect */}
        </Routes>
      </>
    );
  }

  // 🟢 Case 2: Agar user login hai & role == admin
  if (user.role === "admin") {
    return (
      <>
        <AdminNavbar />
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/garage-register" element={<GarageRegister />} />
          {/* <Route path="/status-update" element={<Status_Update />} /> */}
          <Route path="/" element={<Status_Update />} />
          <Route path="/history" element={<History />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/getGarage" element={<GarageHistory />} />
          <Route path="/garageUpdate" element={<Garage_Update />} />
          <Route path="/assignMechanic" element={<Mechanic />} />
          
        </Routes>
      </>
    );
  }

  // 🟢 Case 3: Agar user login hai & role == user
  if (user.role === "user") {
    return (
      <>
        <Navbar />
        <Routes>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<Service />} />
          <Route path="/track-request" element={<Track_Request />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About_Us />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </>
    );
  }

  // 🟢 Case 4: Fallback (jab role undefined hai)
  return (
    <>
      <Navbar showLimited={true} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;

