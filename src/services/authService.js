import axios from 'axios';

const API_URL = "http://localhost:8081/api/auth"; // adapte si besoin

export const signup = (userData) => {
  return axios.post(`${API_URL}/signup`, userData);
};

export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const getAllUsers = () => {
  return axios.get(`${API_URL}/users`);
};
