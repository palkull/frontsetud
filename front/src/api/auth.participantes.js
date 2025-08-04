import axios from './axios';

export const getParticipantesRequest = () =>axios.get(`/participantes/verParticipantes`);

export const getParticipanteRequest = (id) =>axios.get(`/participantes/verParticipante/${id}`);

export const addParticipanteRequest = (participante) => axios.post(`/participantes/add-participante`, participante);

export const updateParticipanteRequest = (participante) => axios.put(`/actualizarParticipante/${participante._id}`, participante);

export const deleteParticipanteRequest = (id) => axios.delete(`/eliminarParticipante/${id._id}`);

