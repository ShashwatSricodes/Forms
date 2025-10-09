// frontend/src/App.tsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";

// Auth
import Signup from "./features/auth/SignUp";
import Login from "./features/auth/Login";
import AuthCallback from "./features/auth/AuthCallback";

// Pages
import HomePage from "./features/home/page";
import Dashboard from "./features/dashboard/Dashboard";

// Forms
import Form from "./features/forms/Form"; // ✅ updated
import PublicForm from "./features/forms/PublicForm";

// Responses
import ResponsesList from "./features/responses/ResponsesList";

function App() {
  return (
    <div style={{ fontFamily: "Geist, sans-serif" }}>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Public Form (view + submit) */}
        <Route path="/form/:formId" element={<PublicForm />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Forms (Create + Edit unified in Form.tsx) */}
        <Route path="/forms/create" element={<Form />} />
        <Route path="/forms/:formId/edit" element={<Form />} />

        {/* Responses */}
        <Route path="/forms/:formId/responses" element={<ResponsesList />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
