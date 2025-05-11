import React, { useState } from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Par défaut, le drawer est ouvert
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    // Logique de déconnexion
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    alert('Déconnexion réussie');
    
    // Redirection vers la page de connexion
    navigate('/login');
  };

  const navigateToUserPage = () => {
    navigate('/user'); // Redirige vers la page de l'utilisateur
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button 
              onClick={toggleDrawer} 
              className="menu-button"
            >
              {isDrawerOpen ? "✕" : "☰"}
            </button>
            <h1 className="dashboard-title">Dashboard</h1>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                👤
              </div>
              <div className="user-details">
                <p className="username">{username}</p>
                <p className="user-email">{email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              <span className="logout-icon">⭳</span>
              <span>Déconnecter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Drawer */}
      <div className="main-container">
        {/* Drawer / Sidebar */}
        <div className={`drawer ${isDrawerOpen ? 'drawer-open' : 'drawer-closed'}`}>
          <div className="drawer-content">
            {isDrawerOpen && <h2 className="drawer-title">Menu</h2>}
            <nav className="drawer-nav">
              <a href="#dashboard" className="nav-item">
                <span className="nav-icon">🏠</span>
                {isDrawerOpen && <span className="nav-text">Dashboard</span>}
              </a>
              {/* Utiliser onClick pour naviguer vers la page utilisateur */}
              <a 
                href="#user" 
                className="nav-item"
                onClick={navigateToUserPage} // Ajout du clic pour naviguer vers la page utilisateur
              >
                <span className="nav-icon">👤</span>
                {isDrawerOpen && <span className="nav-text">User</span>}
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-area">
          <div className="welcome-card">
            <h2 className="welcome-title">Bienvenue, {username} ! 🎉</h2>
            <p className="welcome-text">Voici votre tableau de bord personnel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
