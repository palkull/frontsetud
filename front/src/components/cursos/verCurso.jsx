import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurso } from "../../context/CursoContext";
import { FaArrowLeft } from "react-icons/fa";

function VerCurso() {
  const { id } = useParams();
  const { getCurso } = useCurso();
  const [curso, setCurso] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCurso() {
      try {
        const data = await getCurso(id);
        setCurso(data);
      } catch (error) {
        console.error("Error al obtener el curso:", error);
        setCurso(null);
      }
    }
    fetchCurso();
  }, [id, getCurso]);

  if (!curso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Curso no encontrado</h2>
          <button
            type="button"
            onClick={() => navigate("/cursos")}
            className="flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition mx-auto"
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium text-sm">Regresar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
      <button
        type="button"
        onClick={() => navigate("/cursos")}
        className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm">Regresar</span>
      </button>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center">{curso.nombre}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Tipo:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.tipo}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Modalidad:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.modalidad}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Fecha inicio:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.fechaInicio ? curso.fechaInicio.slice(0, 10) : ""}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Fecha fin:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.fechaFin ? curso.fechaFin.slice(0, 10) : ""}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Horario:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.horario}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Duración (horas):</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.duracion}</span>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Instructor y objetivos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Instructor:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.instructor}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Perfil del instructor:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.perfilInstructor}</span>
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Objetivos:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.objetivos}</span>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Participantes y cupos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Perfil del participante:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.perfilParticipante}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Cupo mínimo:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.cupoMinimo}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Cupo máximo:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.cupoMaximo}</span>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Costos y temario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Costo:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.costo}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Costo general:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.costoGeneral}</span>
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Temario general:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.temario}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Proceso y contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Proceso de inscripción:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.procesoInscripcion}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Correo:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">{curso.correo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerCurso;