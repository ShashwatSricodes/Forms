import './App.css'
import Navbar from './layouts/Navbar';
import HomePage from './features/home/page.tsx';
import Footer from './layouts/Footer';
import { Routes, Route } from "react-router-dom";
import SignUp from './features/auth/SignUp.tsx';

function App() {
  return (
    <>
   <div style={{ fontFamily: 'Geist, sans-serif' }}>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
    <Footer/>
    </div>

      
     
    </>
  )
}

export default App
