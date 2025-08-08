import axios from './axios';

export const getParticipantesRequest = () => axios.get(`/participantes/verParticipantes`);

export const getParticipanteRequest = (id) => axios.get(`/participantes/verParticipante/${id}`);

export const addParticipanteRequest = (participante) => axios.post(`/participantes/add-participante`, participante);

export const updateParticipanteRequest = (participante) => axios.put(`/actualizarParticipante/${participante._id}`, participante);

export const deleteParticipanteRequest = (id) => axios.delete(`/eliminarParticipante/${id._id}`);

// Nueva función para subir certificado a un participante específico
export const subirCertificadoRequest = (participanteId, certificadoFile) => {
    const formData = new FormData();
    formData.append('certificado', certificadoFile);
    
    return axios.post(`/participantes/participante/${participanteId}/certificado`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Función para obtener participantes con detalles de cursos
export const getParticipantesConCursosRequest = (empresaId) => 
    axios.get(`/empresas/${empresaId}/participantes-con-cursos`);

// Función para obtener estadísticas de cursos
export const getEstadisticasCursosRequest = (empresaId) => 
    axios.get(`/empresas/${empresaId}/estadisticas-cursos`);

// Función para obtener participantes agrupados por curso
export const getParticipantesPorCursoRequest = (empresaId) => 
    axios.get(`/empresas/${empresaId}/participantes-por-curso`);