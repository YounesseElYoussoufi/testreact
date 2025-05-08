import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Fichier CSS avec les styles améliorés

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur quand l'utilisateur corrige le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      // Stocker les données utilisateur dans localStorage
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('username', response.data.name);
      localStorage.setItem('email', formData.email);
      
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Erreur de connexion. Veuillez réessayer.';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // SVG Logo du cabinet dentaire - Dent humaine réaliste
  const DentalLogo = () => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      {/* Racines de la dent */}
      <path fill="#38b6ff" d="M256,380c-10,40-30,80-60,85c-25,4-40-20-45-50c-5-35,5-70-20-85c-25,15-15,50-20,85c-5,30-20,54-45,50c-30-5-50-45-60-85c-15-60-15-120,5-170c15-35,35-65,65-85c15-10,35-15,55-15h0c20,0,40,5,55,15c30,20,50,50,65,85C266,260,266,320,256,380z"/>
      {/* Email de la dent */}
      <path fill="#ffffff" d="M256,155c-40-30-80-30-120,0c-5,5-5,15,0,20c40,30,80,30,120,0C261,170,261,160,256,155z"/>
      {/* Contour supérieur */}
      <path fill="#ffffff" d="M166,120c0,0,30-15,90-15s90,15,90,15c5,2,10-1,12-6c2-5-1-10-6-12c0,0-35-17-96-17s-96,17-96,17c-5,2-8,7-6,12C157,114,161,118,166,120z"/>
    </svg>
  );

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo">
            <DentalLogo />
          </div>
        </div>
        <h2 className="login-title">Connexion à votre espace</h2>
        
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="votre@email.com"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
                placeholder="Votre mot de passe"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-footer">
            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
          
          <div className="form-links">
            <a href="/forgot-password" className="forgot-password-link">Mot de passe oublié ?</a>
            <a href="/register" className="register-link">Nouveau patient ?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;