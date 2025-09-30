import './App.css'
import Navbar from './layouts/Navbar';
import HomePage from './features/home/page.tsx';
import Footer from './layouts/Footer';
import { Routes, Route } from "react-router-dom";
import SignUp from './features/auth/SignUp.tsx';
import Login from './features/auth/Login.tsx';
import Dashboard from './features/dashboard/Dashboard.tsx';
import Forms from './features/forms/forms.tsx'

function App() {
  return (
    <>
      <div style={{ fontFamily: 'Geist, sans-serif' }}>
        <Forms/>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* Add a specific route for the dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App;