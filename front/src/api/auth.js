import axios from 'axios';
const API_URL = 'http://localhost:3000';

export const registerRequest = admin => axios.post(`${API_URL}/signup`, admin);

export const loginRequest = admin => axios.post(`${API_URL}/login`, admin);