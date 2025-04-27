import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userRole: ''
  });

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
      <h1 style={styles.title}>Page de l'Utilisateur</h1>
      <p style={styles.subtitle}>Bienvenue sur la page de votre profil utilisateur.</p>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Liste des utilisateurs</h2>
        
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
                  <option value="USER">Utilisateur</option>
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

// Styles CSS en JavaScript
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '24px',
  },
  error: {
    color: '#e74c3c',
    backgroundColor: '#fadbd8',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '16px',
    backgroundColor: '#f5f7fa',
    borderBottom: '1px solid #e6e9ed',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '2px solid #e6e9ed',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#5e6977',
  },
  tr: {
    borderBottom: '1px solid #e6e9ed',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#333',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#e1f5fe',
    color: '#0288d1',
  },
  editButton: {
    border: 'none',
    background: 'none',
    color: '#3498db',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '16px',
  },
  deleteButton: {
    border: 'none',
    background: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#2c3e50',
  },
  modalText: {
    fontSize: '14px',
    color: '#5e6977',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#e6e9ed',
    color: '#5e6977',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  confirmDeleteButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#5e6977',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #dcdfe6',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #dcdfe6',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  emptyMessage: {
    padding: '16px',
    color: '#7f8c8d',
  },
};

export default UserPage;