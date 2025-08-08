import axios from './axios';

// Función para crear una nueva empresa
export const addEmpresaRequest = (empresa) => axios.post('/empresas/add-empresa', empresa);

// Obtener todas las empresas
export const getEmpresasRequest = () => axios.get('/empresas/VerEmpresas');

// Obtener una empresa específica
export const getEmpresaRequest = (id) => axios.get(`/empresas/VerEmpresa/${id}`);

// Actualizar una empresa
export const updateEmpresaRequest = (id, empresa) => axios.put(`/empresas/empresas/${id}`, empresa);

// Eliminar una empresa
export const deleteEmpresaRequest = (id) => axios.delete('/empresas/empresas', { data: { id } });

// Asociar participante a empresa
export const asociarParticipanteRequest = (empresaId, participanteId) => 
  axios.post(`/empresas/empresas/${empresaId}/participantes`, { participanteId });

// Desasociar participante de empresa
export const desasociarParticipanteRequest = (empresaId, participanteId) => 
  axios.delete(`/empresas/empresas/${empresaId}/participantes/${participanteId}`);

// Obtener estadísticas de empresa
export const getEstadisticasEmpresaRequest = (empresaId) => 
  axios.get(`/empresas/empresas/${empresaId}/estadisticas`);

// Obtener participantes por curso
export const getParticipantesPorCursoRequest = (empresaId) => 
  axios.get(`/empresas/empresas/${empresaId}/participantes-por-curso`);

