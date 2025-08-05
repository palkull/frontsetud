import React, { useState, useContext, createContext, useCallback } from 'react';
import {
    getParticipanteRequest, 
    getParticipantesRequest, 
    addParticipanteRequest, 
    deleteParticipanteRequest,
    subirCertificadoRequest
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

    const deleteParticipante = async (participantId) => {
        try {
            await deleteParticipanteRequest({ id: participantId });
            setParticipantes(participantes.filter(participante => participante.id !== participantId));
        } catch (err) {
            setError([err.response ? err.response.data : 'An error occurred']);
        }
    };

    const getParticipante = useCallback(async (id) => {
        try {
            const res = await getParticipanteRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error al obtener el participante:", error);
            throw error;
        }
    }, []);

    // Nueva función para subir certificado
    const subirCertificado = async (participanteId, certificadoFile) => {
        try {
            // Validar que sea un archivo PDF
            if (certificadoFile.type !== 'application/pdf') {
                const error = 'Solo se permiten archivos PDF';
                setError([error]);
                throw new Error(error);
            }

            // Validar tamaño del archivo (10MB máximo)
            if (certificadoFile.size > 10 * 1024 * 1024) {
                const error = 'El archivo PDF no puede ser mayor a 10MB';
                setError([error]);
                throw new Error(error);
            }

            const res = await subirCertificadoRequest(participanteId, certificadoFile);
            setError([]);
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al subir el certificado';
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
            deleteParticipante,
            subirCertificado,
            error
        }}>
            {children}
        </ParticipantesContext.Provider>
    );
}