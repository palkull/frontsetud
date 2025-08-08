import axios from './axios';

export const getAdminsRequest = () =>axios.get(`/verUsuarios`);

export const getAdminRequest = (id) =>axios.get(`/VerUsuario/${id}`);

export const addAdminRequest = (admin) => axios.post(`/addUser`, admin);

export const updateAdminRequest = (admin) => axios.put(`/actualizarCurso/${admin._id}`, admin);

export const deleteAdminRequest = (id) => axios.put(`/deleteUser/${id}`);

export const verifyTokenRequest = () => axios.get(`/verify`);