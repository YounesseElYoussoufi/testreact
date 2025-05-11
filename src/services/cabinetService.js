// services/cabinetService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/cabinets';

// Créer un axios instance avec l'en-tête d'autorisation
const axiosAuth = axios.create();

// Intercepteur pour ajouter le token JWT à chaque requête
axiosAuth.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllCabinets = async () => {
  try {
    const response = await axiosAuth.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCabinetsByUserId = async (userId) => {
  try {
    // Si l'API propose un endpoint pour récupérer les cabinets par userId
    const response = await axiosAuth.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    // Si l'API ne propose pas cet endpoint, nous pouvons récupérer tous les cabinets
    // et filtrer côté client (moins efficace, mais fonctionnel)
    const allCabinetsResponse = await axiosAuth.get(API_URL);
    return allCabinetsResponse.data.filter(cabinet => cabinet.userId === userId);
  }
};

export const createCabinet = async (cabinetData) => {
  try {
    const response = await axiosAuth.post(API_URL, cabinetData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCabinet = async (id, cabinetData) => {
  try {
    const response = await axiosAuth.put(`${API_URL}/${id}`, cabinetData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCabinet = async (id) => {
  try {
    const response = await axiosAuth.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};