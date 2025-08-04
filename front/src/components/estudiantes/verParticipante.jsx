import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useParticipantes } from "../../context/ParticipantesContext";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaIdCard, FaBookOpen, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

// Componente principal para ver el detalle de un participante
function VerParticipante() {
  const { id } = useParams();
  const { getParticipante } = useParticipantes();
  const [participante, setParticipante] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log("ID recibido:", id);


  // Función para cargar los datos del participante
  const loadParticipanteData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const participanteData = await getParticipante(id);
      setParticipante(participanteData);
    } catch (error) {
      console.error("Error cargando el participante:", error);
      setParticipante(null);
    } finally {
      setLoading(false);
    }
  }, [id, getParticipante]);

  // useEffect para llamar la carga de datos cuando el componente se monta
  useEffect(() => {
    loadParticipanteData();
  }, [loadParticipanteData]);

  // Renderiza un estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">Cargando participante...</h2>
        </div>
      </div>
    );
  }

  // Renderiza un mensaje de error si el participante no se encuentra
  if (!participante) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Participante no encontrado</h2>
          <button
            type="button"
            onClick={() => navigate("/estudiantes")}
            className="flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition mx-auto"
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium text-sm">Regresar a Estudiantes</span>
          </button>
        </div>
      </div>
    );
  }

  const cursosInscritos = participante.cursos_inscritos || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
      <button
        type="button"
        onClick={() => navigate("/estudiantes")}
        className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm">Regresar</span>
      </button>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <FaUser className="text-3xl text-blue-700 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">{participante.nombre}</h1>
        </div>
        
        <div className="space-y-8">
          {/* Datos Personales y de Contacto */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Datos Personales y de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info icon={<FaEnvelope />} label="Correo Electrónico" value={participante.correo} />
              <Info icon={<FaPhone />} label="Teléfono" value={participante.telefono} />
              <Info icon={<FaUser />} label="Edad" value={`${participante.edad} años`} />
              <Info icon={<FaIdCard />} label="CURP" value={participante.curp} />
            </div>
          </section>

          {/* Información Profesional */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Información Profesional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info icon={<FaBuilding />} label="Empresa de Procedencia" value={participante.empresaProdecendia} />
              <Info icon={<FaBriefcase />} label="Puesto" value={participante.puesto} />
            </div>
          </section>

          {/* Historial de Cursos */}
          {cursosInscritos.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
                Historial de Cursos ({cursosInscritos.length})
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-72 overflow-y-auto">
                {cursosInscritos.map((inscripcion, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div>
                      <Link to={`/cursos/${inscripcion.curso_id?._id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-2">
                        <FaBookOpen />
                        {inscripcion.curso_id?.nombre || 'Curso no disponible'}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <FaCalendarCheck />
                        <span>Inscrito el: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs capitalize px-2 py-1 rounded-full ${
                        inscripcion.estado === 'inscrito' ? 'bg-blue-100 text-blue-800' :
                        inscripcion.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {inscripcion.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

           {/* Mensaje si no hay cursos */}
           {cursosInscritos.length === 0 && (
                <section>
                    <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FaBookOpen className="mx-auto text-4xl mb-2" />
                        <p>Este participante aún no se ha inscrito a ningún curso.</p>
                    </div>
                </section>
            )}
        </div>
      </div>
    </div>
  );
}

// Componente reutilizable para mostrar información
function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
        <div className="text-blue-500 dark:text-blue-300 mt-1">{icon}</div>
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</span>
            <span className="text-base text-gray-800 dark:text-gray-100">
                {value || <span className="italic text-gray-400 dark:text-gray-500">Sin información</span>}
            </span>
        </div>
    </div>
  );
}

export default VerParticipante;