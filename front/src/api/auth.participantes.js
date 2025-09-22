import axios from './axios';

export const getParticipantesRequest = () => axios.get(`/participantes/verParticipantes`);

export const getParticipanteRequest = (id) => axios.get(`/participantes/verParticipante/${id}`);

export const addParticipanteRequest = (participante) => axios.post(`/participantes/add-participante`, participante);

export const updateParticipanteRequest = (participante) => axios.put(`/actualizarParticipante/${participante._id}`, participante);

export const deleteParticipanteRequest = async (id) => {
    try {
        return await axios.delete(`/participantes/participante/${id}/bajar`);
    } catch (error) {
        console.error('Error en deleteParticipanteRequest:', error);
        throw error;
    }
};

export const getHistorialParticipantesRequest = async () => {
    try {
        return await axios.get('/participantes/historial-participantes');
    } catch (error) {
        console.error('Error en getHistorialParticipantesRequest:', error);
        throw error;
    }
};

// subir certificado a un participante específico
export const subirCertificadoRequest = (participanteId, formData) => {
    console.log('Sending request to:', `/participantes/participante/${participanteId}/certificado`); // Debug log
    return axios.post(`/participantes/participante/${participanteId}/certificado`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            console.log('Upload progress:', Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
    });
};

// Nueva función para obtener la URL del certificado para visualización
export const verCertificadoRequest = (participanteId) => 
    axios.get(`/participantes/participante/${participanteId}/certificado/ver`);

// Nueva función para descargar certificado
export const descargarCertificadoRequest = (participanteId) => 
    axios.get(`/participantes/participante/${participanteId}/certificado/descargar`, {
        responseType: 'blob', // Importante para archivos binarios
        headers: {
            'Accept': 'application/pdf'
        }
    });

// Función para obtener participantes con detalles de cursos
export const getParticipantesConCursosRequest = (empresaId) => 
    axios.get(`/empresas/${empresaId}/participantes-con-cursos`);

// Función para obtener estadísticas de cursos
export const getEstadisticasCursosRequest = (empresaId) => 
    axios.get(`/empresas/${empresaId}/estadisticas-cursos`);

// Función para obtener participantes agrupados por curso
export const getParticipantesPorCursoRequest = (empresaId) => 
    axios.get(`/empresas/${empresaId}/participantes-por-curso`);