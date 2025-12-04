import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Registration from './components/Registration'
import Login from './components/Login'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import AdminProfile from './components/AdminProfile'
import RegistrationRequests from './components/RegistrationRequests'
import Footer from './components/Footer'
import './App.css'

function Home() {
  return (
    <div className="app-container">
      <div className="grid-background"></div>
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>
      <div className="app-content">
        <Hero />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/registrations" element={<RegistrationRequests />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
