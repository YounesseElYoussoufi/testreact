// src/pages/BasicPatient.js
import React from 'react';

function BasicPatient() {
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bienvenue sur l’espace patient</h2>
      <p>Nom : {username}</p>
      <p>Email : {email}</p>
    </div>
  );
}

export default BasicPatient;
