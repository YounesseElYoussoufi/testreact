import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cabinet.css';

function Cabinet() {
  const [cabinets, setCabinets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCabinet, setEditingCabinet] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    horaireTravail: '',
    userId: null
  });
  const [formErrors, setFormErrors] = useState({});

  // Configuration Axios avec les headers d'authentification
  const axiosAuth = axios.create();
  axiosAuth.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Récupérer les cabinets du dentiste connecté
  const fetchCabinets = async () => {
    setLoading(true);
    try {
      const userId = parseInt(localStorage.getItem('userId')) || null;
      // On pourrait ajouter un paramètre pour filtrer par userId
      const response = await axiosAuth.get(`http://localhost:8081/api/cabinets`);
      
      // Filtrer les cabinets pour l'utilisateur connecté si nécessaire
      // Cela peut être fait côté serveur idéalement, mais voici une solution côté client
      const userCabinets = response.data.filter(cabinet => 
        cabinet.userId === userId
      );
      
      setCabinets(userCabinets);
    } catch (err) {
      setError('Impossible de charger les cabinets: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'CABINET_DENTAIRE') {
      setError('Vous devez être connecté en tant que cabinet dentaire');
      return;
    }

    // Récupérer l'ID utilisateur pour le formulaire
    const userId = localStorage.getItem('userId');
    setFormData(prev => ({...prev, userId: userId ? parseInt(userId) : null}));
    
    fetchCabinets();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nom) errors.nom = 'Le nom est requis';
    if (!formData.adresse) errors.adresse = 'L\'adresse est requise';
    if (!formData.telephone) errors.telephone = 'Le téléphone est requis';
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    if (!formData.horaireTravail) errors.horaireTravail = 'Les horaires sont requis';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur quand l'utilisateur corrige le champ
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (editingCabinet) {
        // Mise à jour d'un cabinet existant
        await axiosAuth.put(`http://localhost:8081/api/cabinets/${editingCabinet.id}`, formData);
      } else {
        // Création d'un nouveau cabinet
        await axiosAuth.post('http://localhost:8081/api/cabinets', formData);
      }
      
      // Réinitialiser le formulaire et rafraîchir la liste
      resetForm();
      fetchCabinets();
    } catch (err) {
      setError(`Erreur lors de l'enregistrement du cabinet: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (cabinet) => {
    setEditingCabinet(cabinet);
    setFormData({
      nom: cabinet.nom,
      adresse: cabinet.adresse,
      telephone: cabinet.telephone,
      email: cabinet.email,
      horaireTravail: cabinet.horaireTravail,
      userId: cabinet.userId
    });
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cabinet?')) {
      try {
        await axiosAuth.delete(`http://localhost:8081/api/cabinets/${id}`);
        fetchCabinets();
      } catch (err) {
        setError(`Erreur lors de la suppression: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      adresse: '',
      telephone: '',
      email: '',
      horaireTravail: '',
      userId: formData.userId // On garde l'ID de l'utilisateur
    });
    setEditingCabinet(null);
    setIsCreating(false);
    setFormErrors({});
  };

  // SVG Logo du cabinet dentaire - Dent humaine réaliste (repris du composant Login)
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
    <div className="cabinet-container">
      <div className="cabinet-header">
        <div className="logo-container">
          <div className="logo">
            <DentalLogo />
          </div>
        </div>
        <h1>Gestion de votre cabinet dentaire</h1>
        <div className="user-info">
          <span>Bonjour, {localStorage.getItem('username')}</span>
          <button 
            className="logout-button"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cabinet-content">
        <div className="cabinet-action-buttons">
          <button 
            className="action-button"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? 'Annuler' : 'Ajouter un nouveau cabinet'}
          </button>
        </div>

        {isCreating && (
          <div className="cabinet-form-container">
            <h3>{editingCabinet ? 'Modifier le cabinet' : 'Ajouter un nouveau cabinet'}</h3>
            <form onSubmit={handleSubmit} className="cabinet-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">Nom du cabinet</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={formErrors.nom ? 'input-error' : ''}
                  />
                  {formErrors.nom && <span className="error-text">{formErrors.nom}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? 'input-error' : ''}
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={formErrors.telephone ? 'input-error' : ''}
                  />
                  {formErrors.telephone && <span className="error-text">{formErrors.telephone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="horaireTravail">Horaires de travail</label>
                  <input
                    type="text"
                    id="horaireTravail"
                    name="horaireTravail"
                    value={formData.horaireTravail}
                    onChange={handleChange}
                    className={formErrors.horaireTravail ? 'input-error' : ''}
                    placeholder="Ex: Lun-Ven 9h-18h, Sam 9h-12h"
                  />
                  {formErrors.horaireTravail && <span className="error-text">{formErrors.horaireTravail}</span>}
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="adresse">Adresse complète</label>
                <textarea
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className={formErrors.adresse ? 'input-error' : ''}
                  rows="3"
                />
                {formErrors.adresse && <span className="error-text">{formErrors.adresse}</span>}
              </div>

              <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={resetForm}>
                  Annuler
                </button>
                <button type="submit" className="submit-button">
                  {editingCabinet ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="cabinets-list">
          <h3>Mes Cabinets</h3>
          {loading ? (
            <div className="loading">Chargement des cabinets...</div>
          ) : cabinets.length === 0 ? (
            <div className="no-data">Aucun cabinet trouvé. Créez votre premier cabinet.</div>
          ) : (
            <div className="cabinet-cards">
              {cabinets.map(cabinet => (
                <div key={cabinet.id} className="cabinet-card">
                  <h4>{cabinet.nom}</h4>
                  <div className="cabinet-info">
                    <p><strong>Adresse:</strong> {cabinet.adresse}</p>
                    <p><strong>Téléphone:</strong> {cabinet.telephone}</p>
                    <p><strong>Email:</strong> {cabinet.email}</p>
                    <p><strong>Horaires:</strong> {cabinet.horaireTravail}</p>
                  </div>
                  <div className="cabinet-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(cabinet)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(cabinet.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cabinet;