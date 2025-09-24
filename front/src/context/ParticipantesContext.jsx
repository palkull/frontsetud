import React, { useState, useContext, createContext, useCallback } from 'react';
import {
    getParticipanteRequest, 
    getParticipantesRequest, 
    getHistorialParticipantesRequest,
    addParticipanteRequest, 
    deleteParticipanteRequest,
    subirCertificadoRequest,
    verCertificadoRequest,
    descargarCertificadoRequest,
    getParticipantesConCursosRequest
} from '../api/auth.participantes';

export const ParticipantesContext = createContext();

export const useParticipantes = () => {
    const context = useContext(ParticipantesContext);
             
    if (!context) {
        throw new Error('useParticipants must be used within a ParticipantsProvider');
    }
    return context;
}

export function ParticipantesProvider({ children }) {
    const [participantes, setParticipantes] = useState([]);
    const [historialParticipantes, setHistorialParticipantes] = useState([]); // <- NUEVO ESTADO
    const [estadisticasHistorial, setEstadisticasHistorial] = useState(null); 
    const [error, setError] = useState([]);

    const createParticipante = async (participante) => {
        // Validaciones antes de enviar al backend
        const errores = [];

        // Validar edad
        if (participante.edad && (participante.edad < 16 || participante.edad > 100)) {
            errores.push("La edad debe estar entre 16 y 100 años.");
        }

        // Validar formato de correo
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (participante.correo && !emailRegex.test(participante.correo)) {
            errores.push("El formato del correo electrónico no es válido.");
        }

        // Validar formato de teléfono (10 dígitos)
        const phoneRegex = /^[0-9]{10}$/;
        if (participante.telefono && !phoneRegex.test(participante.telefono)) {
            errores.push("El teléfono debe tener exactamente 10 dígitos.");
        }

        // Validar formato de CURP                  
        if (errores.length > 0) {
            setError(errores);
            throw new Error(errores.join(" "));
        }

        // Si pasa las validaciones, enviar al backend
        try {
            const res = await addParticipanteRequest(participante);
                         
            setError([]);
            return res;
        } catch (err) {
            setError([err.response ? err.response.data : 'Error al agregar el participante']);
            throw err;
        }
    };

    const getParticipantes = useCallback(async () => {
        try {
            const res = await getParticipantesRequest();
            console.log('Participantes fetched:', res);
            setParticipantes(res.data);
        } catch (error) {
            console.error(error)
        }
    }, []);

        const getHistorialParticipantes = useCallback(async () => {
        try {
            const res = await getHistorialParticipantesRequest();
            console.log('Historial de participantes fetched:', res.data);
            setHistorialParticipantes(res.data.participantes || []);
            setEstadisticasHistorial(res.data.estadisticas || null);
            setError([]);
            return res.data;
        } catch (error) {
            console.error('Error al obtener historial de participantes:', error);
            const errorMessage = error.response?.data?.message || 'Error al obtener el historial';
            setError([errorMessage]);
            throw error;
        }
    }, []);

const deleteParticipante = async (id) => {
    try {
        // Llamar al request que cambia el status a inactivo
        const res = await deleteParticipanteRequest(id);
        
        // Actualizar el estado local removiendo el participante de la lista
        // o marcándolo como inactivo dependiendo de tu lógica
        setParticipantes(prevParticipantes => 
            prevParticipantes.filter(participante => 
                (participante._id || participante.id) !== id
            )
        );
        
        setError([]);
        return res.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el participante';
        setError([errorMessage]);
        throw new Error(errorMessage);
    }
};

     const getParticipantesConCursos = useCallback(async (empresaId) => {
        try {
            const res = await getParticipantesConCursosRequest(empresaId);
            return res.data;
        } catch (error) {
            console.error("Error al obtener participantes con cursos:", error);
            setError([error.response?.data || 'Error al obtener datos']);
            throw error;
        }
    }, []);


    const getParticipante = useCallback(async (id) => {
        try {
            const res = await getParticipanteRequest(id);
            console.log('Participante fetched:', res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener el participante:", error);
            throw error;
        }
    }, []);

    // Función para subir certificado
    const subirCertificado = async (participanteId, formData) => {
        try {
            console.log('Context: Uploading certificate for participant:', participanteId); // Debug log
            
            // Check if formData contains the file
            const certificadoFile = formData.get('certificado');
            if (!certificadoFile) {
                throw new Error('No se encontró el archivo en el FormData');
            }

            // Log formData contents
            console.log('FormData contents:', {
                file: certificadoFile,
                tipo: formData.get('tipo'),
                descripcion: formData.get('descripcion')
            });

            const res = await subirCertificadoRequest(participanteId, formData);
            console.log('Upload response:', res); // Debug log
            
            setError([]);
            return res.data;
        } catch (err) {
            console.error('Upload error in context:', err); // Detailed error logging
            const errorMessage = err.response?.data?.message || err.message || 'Error al subir el certificado';
            setError([errorMessage]);
            throw new Error(errorMessage);
        }
    };

    // Nueva función para ver certificado
    const verCertificado = async (participanteId) => {
        try {
            const res = await verCertificadoRequest(participanteId);
            setError([]);
            
            // Retornar la URL para abrir en nueva ventana
            if (res.data && res.data.url) {
                return res.data.url;
            } else {
                throw new Error('URL del certificado no disponible');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al obtener el certificado';
            setError([errorMessage]);
            throw new Error(errorMessage);
        }
    };

    // Nueva función para descargar certificado
    const descargarCertificado = async (participanteId, nombreArchivo) => {
        try {
            const res = await descargarCertificadoRequest(participanteId);
            setError([]);
            
            // Crear un blob con los datos del archivo
            const blob = new Blob([res.data], { type: 'application/pdf' });
            
            // Crear URL temporal para el blob
            const url = window.URL.createObjectURL(blob);
            
            // Crear elemento de enlace temporal para descargar
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo || 'certificado.pdf';
            
            // Agregar al DOM, hacer clic y remover
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpiar URL temporal
            window.URL.revokeObjectURL(url);
            
            return { success: true, message: 'Certificado descargado correctamente' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al descargar el certificado';
            setError([errorMessage]);
            throw new Error(errorMessage);
        }
    };

    return (
        <ParticipantesContext.Provider value={{
            participantes,
            createParticipante,
            getParticipantes,
            getParticipante,
            getParticipantesConCursos,
            getHistorialParticipantes,
            estadisticasHistorial,
            historialParticipantes,
            deleteParticipante,
            subirCertificado,
            verCertificado,
            descargarCertificado,
            error
        }}>
            {children}
        </ParticipantesContext.Provider>
    );
}