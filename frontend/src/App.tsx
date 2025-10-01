import "./App.css";
import Navbar from "./layouts/Navbar";
import HomePage from "./features/home/page.tsx";
import Footer from "./layouts/Footer";
import { Routes, Route } from "react-router-dom";
import SignUp from "./features/auth/SignUp.tsx";
import Login from "./features/auth/Login.tsx";
import AuthCallback from "./features/auth/AuthCallback.tsx";
import Dashboard from "./features/dashboard/Dashboard.tsx";
import Forms from "./features/forms/forms.tsx";

function App() {
  return (
    <>
      <div style={{ fontFamily: "Geist, sans-serif" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* OAuth Callback Route - IMPORTANT for Google/GitHub login */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forms" element={<Forms />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
