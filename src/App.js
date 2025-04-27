import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './conponents/Login';
import Home from './conponents/Home';
import UserPage from './conponents/User'; // Assurez-vous d'avoir créé cette page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérification de l'authentification à chaque chargement du composant
  useEffect(() => {
    const token = localStorage.getItem('token'); // Vérifie si le token est présent dans le localStorage
    if (token) {
      setIsAuthenticated(true); // Si un token existe, l'utilisateur est considéré comme connecté
    } else {
      setIsAuthenticated(false); // Sinon, l'utilisateur n'est pas connecté
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          {/* Si l'utilisateur est authentifié, redirige vers la page Home */}
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          {/* Page de connexion */}
          <Route path="/login" element={<Login />} />
          {/* Page utilisateur */}
          <Route path="/user" element={<UserPage />} /> {/* Assurez-vous que cette page existe */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
