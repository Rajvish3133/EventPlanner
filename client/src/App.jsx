import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import EventManagementPanel from "./components/EventManagementPanel";
import EventAdminPanel from "./admin/admin";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path='/dashboard' element={<EventManagementPanel />} />
      <Route path='/admin' element={<EventAdminPanel />} />
    </Routes>
  );
}

export default App;
