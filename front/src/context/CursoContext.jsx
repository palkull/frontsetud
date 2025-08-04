import React, { useState, useContext, createContext } from 'react';
import { addCursoRequest, getCursosRequest, deleteCursoRequest, inscribirParticipanteRequest, getCursoRequest } from '../api/auth.cursos';

export const CursoContext = createContext();

export const useCurso = () => {

    const context = useContext(CursoContext);
    
    if (!context) {
        throw new Error('useCurso must be used within a CursoProvider');
    }
    return context;
}

export function CursoProvider({ children }) {
    const [cursos, setCursos] = useState([]);
    const [error, setError] = useState([]);

    const addCurso = async (curso) => {
        // Validaciones antes de enviar al backend
        const errores = [];

        // Validar fechas
        if (curso.fechaInicio && curso.fechaFin) {
            const inicio = new Date(curso.fechaInicio);
            const fin = new Date(curso.fechaFin);
            if (inicio >= fin) {
                errores.push("La fecha de inicio debe ser anterior a la fecha de fin.");
            }
        }

        // Validar cupos
        if (
            curso.cupoMinimo !== undefined &&
            curso.cupoMaximo !== undefined &&
            Number(curso.cupoMinimo) >= Number(curso.cupoMaximo)
        ) {
            errores.push("El cupo mínimo debe ser menor al cupo máximo.");
        }

        if (errores.length > 0) {
            setError(errores);
            throw new Error(errores.join(" "));
        }

        // Si pasa las validaciones, enviar al backend
        try {
            const res = await addCursoRequest(curso);
            // Opcional: puedes actualizar la lista de cursos aquí si lo necesitas
            // setCursos([...cursos, res.data]);
            setError([]);
            return res;
        } catch (err) {
            setError([err.response ? err.response.data : 'Error al agregar el curso']);
            throw err;
        }
    };

    const getCursos = async () => {
        try {
            const res =await getCursosRequest();
            console.log('Cursos fetched:', res);
            setCursos(res.data);
        } catch (error) {
            console.error(error)
        }
    };

    const inscribirParticipanteEnCurso = async (cursoId, participanteId) => {
    try {
        const res = await inscribirParticipanteRequest(cursoId, participanteId);
        return res;
    } catch (err) {
        setError([err.response ? err.response.data : 'Error al inscribir participante']);
        throw err;
    }
};
    const deleteCurso = async (cursoId) => {
        try {
            await deleteCursoRequest({ id: cursoId });
            setCursos(cursos.filter(curso => curso.id !== cursoId));
        } catch (err) {
            setError([err.response ? err.response.data : 'An error occurred']);
        }
    };

    const getCurso = async (id) => {
        try {
            const res = await getCursoRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error al obtener el curso:", error);
            throw error;
        }
    };

    return (
        <CursoContext.Provider value={{ 
            cursos,
            addCurso,
            getCursos,
            getCurso,
            inscribirParticipanteEnCurso,
            deleteCurso,
            error
            }}>
            {children}
        </CursoContext.Provider>
    );
}

