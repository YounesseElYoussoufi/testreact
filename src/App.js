import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './conponents/Login';
import Admin from './conponents/Admin';
import UserPage from './conponents/User';
import PatientPage from './conponents/Patient';
import CabinetDentairePage from './conponents/CabinetDentaire';
import RegisterPatient from './conponents/RegisterPatient';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const getRedirectPage = () => {
    if (role === 'ADMIN') return <Admin />;
    if (role === 'PATIENT') return <PatientPage />;
    if (role === 'CABINET_DENTAIRE') return <CabinetDentairePage />;
    return <UserPage />; // Par défaut
  };

  return (
    <Router>
      <div>
      <Routes>
  <Route path="/" element={isAuthenticated ? getRedirectPage() : <Navigate to="/login" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/admin" element={<Admin />} /> {/* <- ajoutée ici */}
  <Route path="/user" element={<UserPage />} />
  <Route path="/patient" element={<PatientPage />} />
  <Route path="/cabinet" element={<CabinetDentairePage />} />
  <Route path="/register" element={<RegisterPatient />} />
</Routes>

      </div>
    </Router>
  );
}

export default App;
