import React, { useState, useContext, createContext, useCallback } from 'react';
import {
  addEmpresaRequest as apiSubirEmpresa,
  getEmpresasRequest as apiGetEmpresas,
  getEmpresaRequest as apiGetEmpresa,
  updateEmpresaRequest as apiActualizarEmpresa,
  deleteEmpresaRequest as apiEliminarEmpresa,
  asociarParticipanteRequest as apiAsociarParticipante,
  desasociarParticipanteRequest as apiDesasociarParticipante,
  getEstadisticasEmpresaRequest as apiGetEstadisticas,
  getParticipantesPorCursoRequest as apiGetParticipantesPorCurso,
} from '../api/auth.empresas';

export const EmpresasContext = createContext();

export const useEmpresas = () => {
    const context = useContext(EmpresasContext);
    if (!context) {
        throw new Error('useEmpresas must be used within a EmpresasProvider');
    }
    return context;
}

export function EmpresasProvider({ children }) {
    const [empresas, setEmpresas] = useState([]);
    const [error, setError] = useState([]);
    const [empresaActual, setEmpresaActual] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);
    const [participantesPorCurso, setParticipantesPorCurso] = useState(null);

    // Crear nueva empresa con validaciones
    const createEmpresa = async (empresa) => {
        const errores = [];

        // Validar formato de RFC
        const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
        if (empresa.rfc && !rfcRegex.test(empresa.rfc)) {
            errores.push("El RFC no tiene un formato válido");
        }

        // Validar correo si existe
        if (empresa.correo) {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(empresa.correo)) {
                errores.push("El formato del correo electrónico no es válido");
            }
        }

        // Validar correo de contacto si existe
        if (empresa.contacto?.correo) {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(empresa.contacto.correo)) {
                errores.push("El formato del correo de contacto no es válido");
            }
        }

        if (errores.length > 0) {
            setError(errores);
            throw new Error(errores.join(" "));
        }

        try {
            const res = await apiSubirEmpresa(empresa);
            setError([]);
            return res;
        } catch (err) {
            setError([err.response ? err.response.data : 'Error al agregar la empresa']);
            throw err;
        }
    };

    // Obtener todas las empresas
    const getEmpresas = useCallback(async () => {
        try {
            const res = await apiGetEmpresas();
            setEmpresas(res.data);
        } catch (error) {
            console.error(error);
            setError([error.response ? error.response.data : 'Error al obtener empresas']);
        }
    }, []);

    // Obtener una empresa específica
    const getEmpresa = useCallback(async (id) => {
        try {
            const res = await apiGetEmpresa(id);
            setEmpresaActual(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener la empresa:", error);
            setError([error.response ? error.response.data : 'Error al obtener empresa']);
            throw error;
        }
    }, []);

     // Función para obtener participantes agrupados por curso
  const getParticipantesPorCurso = useCallback(async (empresaId) => {
    try {
      const res = await apiGetParticipantesPorCurso(empresaId);
      setParticipantesPorCurso(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener participantes por curso:", error);
      setError([error.response?.data || 'Error al obtener datos']);
      throw error;
    }
  }, []);

    // Actualizar una empresa
    const updateEmpresa = async (id, empresa) => {
        const errores = [];

        // Validar formato de RFC
        const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
        if (empresa.rfc && !rfcRegex.test(empresa.rfc)) {
            errores.push("El RFC no tiene un formato válido");
        }

        // Validar correo si existe
        if (empresa.correo) {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(empresa.correo)) {
                errores.push("El formato del correo electrónico no es válido");
            }
        }

        // Validar correo de contacto si existe
        if (empresa.contacto?.correo) {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(empresa.contacto.correo)) {
                errores.push("El formato del correo de contacto no es válido");
            }
        }

        if (errores.length > 0) {
            setError(errores);
            throw new Error(errores.join(" "));
        }

        try {
            const res = await apiActualizarEmpresa(id, empresa);
            setError([]);
            return res;
        } catch (err) {
            setError([err.response ? err.response.data : 'Error al actualizar empresa']);
            throw err;
        }
    };

    // Eliminar una empresa
    const deleteEmpresa = async (id) => {
        try {
            await apiEliminarEmpresa({ id });
            setEmpresas(empresas.filter(empresa => empresa.id !== id));
        } catch (err) {
            setError([err.response ? err.response.data : 'Error al eliminar empresa']);
            throw err;
        }
    };

    // Asociar participante a empresa
    const asociarParticipante = async (empresaId, participanteId) => {
        try {
            const res = await apiAsociarParticipante(empresaId, participanteId);
            // Actualizar empresa actual si es necesario
            if (empresaActual && empresaActual._id === empresaId) {
                setEmpresaActual(prev => ({
                    ...prev,
                    participantes: [...prev.participantes, {
                        participante_id: participanteId,
                        fecha_asociacion: new Date(),
                        estado: 'activo'
                    }]
                }));
            }
            return res;
        } catch (err) {
            setError([err.response ? err.response.data : 'Error al asociar participante']);
            throw err;
        }
    };

    // Desasociar participante de empresa
    const desasociarParticipante = async (empresaId, participanteId) => {
        try {
            const res = await apiDesasociarParticipante(empresaId, participanteId);
            // Actualizar empresa actual si es necesario
            if (empresaActual && empresaActual._id === empresaId) {
                setEmpresaActual(prev => ({
                    ...prev,
                    participantes: prev.participantes.filter(
                        p => p.participante_id.toString() !== participanteId
                    )
                }));
            }
            return res;
        } catch (err) {
            setError([err.response ? err.response.data : 'Error al desasociar participante']);
            throw err;
        }
    };

    // Obtener estadísticas de una empresa
    const getEstadisticasEmpresa = useCallback(async (empresaId) => {
        try {
            const res = await apiGetEstadisticas(empresaId);
            setEstadisticas(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            setError([error.response ? error.response.data : 'Error al obtener estadísticas']);
            throw error;
        }
    }, []);

    return (
        <EmpresasContext.Provider value={{
            empresas,
            empresaActual,
            estadisticas,
            createEmpresa,
            getEmpresas,
            getEmpresa,
            updateEmpresa,
            deleteEmpresa,
            asociarParticipante,
            desasociarParticipante,
            getEstadisticasEmpresa,
            getParticipantesPorCurso,
            participantesPorCurso,
            error
        }}>
            {children}
        </EmpresasContext.Provider>
    );
}