import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userRole: 'PATIENT',
    password: ''
  });
  
  // Ajout du hook useNavigate pour la navigation
  const navigate = useNavigate();

  // Fonction pour retourner à la page d'accueil
  const navigateToHome = () => {
    navigate('/'); // Redirection vers la page d'accueil
  };

  // Récupérer les utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/auth/users');
        setUsers(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
      }
    };

    fetchUsers();
  }, []);

  // Fonction pour ouvrir le modal de création
  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      userRole: 'PATIENT',
      password: ''
    });
    setShowCreateModal(true);
  };

  // Fonction pour ouvrir le modal de mise à jour
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      userRole: user.userRole
    });
    setShowEditModal(true);
  };

  // Fonction pour gérer les modifications du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour créer un utilisateur
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        userRole: formData.userRole,
        password: formData.password
      });
      
      // Ajouter le nouvel utilisateur à la liste
      setUsers([...users, response.data]);
      
      setShowCreateModal(false);
    } catch (err) {
      setError('Erreur lors de la création de l\'utilisateur');
    }
  };

  // Fonction pour mettre à jour un utilisateur
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/api/auth/users/${selectedUser.id}`, formData);
      
      // Mettre à jour la liste des utilisateurs
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...formData } : user
      ));
      
      setShowEditModal(false);
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  // Fonction pour ouvrir le modal de suppression
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/users/${selectedUser.id}`);
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Page de l'Utilisateur</h1>
        {/* Bouton pour revenir à l'accueil */}
        <button 
          onClick={navigateToHome} 
          style={styles.homeButton}>
          ← Retour à l'accueil
        </button>
      </div>
      <p style={styles.subtitle}>Bienvenue sur la page de votre profil utilisateur.</p>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Liste des utilisateurs</h2>
          <button 
            onClick={openCreateModal} 
            style={styles.createButton}>
            + Créer un utilisateur
          </button>
        </div>
        
        {users.length === 0 ? (
          <p style={styles.emptyMessage}>Aucun utilisateur trouvé.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Rôle</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{user.userRole}</span>
                    </td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => openEditModal(user)}
                        style={styles.editButton}
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => openDeleteModal(user)}
                        style={styles.deleteButton}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de création d'utilisateur */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Créer un nouvel utilisateur</h3>
            <form onSubmit={handleCreate}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="password">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="userRole">
                  Rôle
                </label>
                <select
                  id="userRole"
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="PATIENT">Patient</option>
                  <option value="SECRETAIRE">Secrétaire</option>
                  <option value="DENTISTE">Dentiste</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Confirmer la suppression</h3>
            <p style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.name} ?
              Cette action est irréversible.
            </p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.cancelButton}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                style={styles.confirmDeleteButton}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Modifier l'utilisateur</h3>
            <form onSubmit={handleUpdate}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="userRole">
                  Rôle
                </label>
                <select
                  id="userRole"
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="PATIENT">Patient</option>
                  <option value="SECRETAIRE">Secrétaire</option>
                  <option value="DENTISTE">Dentiste</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px'
  },
  error: {
    color: '#d32f2f',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  homeButton: {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '1px solid #eee'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  createButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s'
  },
  emptyMessage: {
    padding: '20px',
    textAlign: 'center',
    color: '#666'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #ddd'
  },
  tr: {
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '12px 15px',
    fontSize: '14px',
    color: '#333'
  },
  badge: {
    backgroundColor: '#e0f2f1',
    color: '#00796b',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  editButton: {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    marginRight: '8px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '500px',
    maxWidth: '90%',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px'
  },
  modalText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    marginRight: '10px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  saveButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  confirmDeleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

export default UserPage;