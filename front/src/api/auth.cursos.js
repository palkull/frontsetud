import axios from './axios';

export const getCursosRequest = () =>axios.get(`/cursos/verCursos`);

export const getCursoRequest = (id) =>axios.get(`/cursos/verCurso/${id}`);

export const addCursoRequest = (curso) => axios.post(`/cursos/add-curso`, curso);

export const updateCursoRequest = (curso) => axios.put(`/actualizarCurso/${curso._id}`, curso);

export const inscribirParticipanteRequest = (cursoId, participanteId) => axios.post(`/cursos/cursos/${cursoId}/inscribir`, { participanteId });

export const deleteCursoRequest = (id) => axios.delete(`/eliminarCurso/${id._id}`);

export const verifyTokenRequest = () => axios.get(`/verify`);