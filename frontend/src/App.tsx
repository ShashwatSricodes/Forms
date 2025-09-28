import './App.css'
import Navbar from './layouts/Navbar';
import HomePage from './features/home/page.tsx';
import Footer from './layouts/Footer';

function App() {
  return (
    <>
     <div style={{ fontFamily: 'Geist, sans-serif' }}>
      <Navbar />
     <HomePage/>
      <Footer/>
      </div>
     
    </>
  )
}

export default App
