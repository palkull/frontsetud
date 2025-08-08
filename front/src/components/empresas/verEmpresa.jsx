import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmpresas } from "../../context/EmpresasContext";
import { 
  FaArrowLeft, FaBuilding, FaTag, FaIdCard, FaPhone, FaEnvelope, 
  FaMapMarkerAlt, FaUsers, FaChartBar, FaBookOpen, FaUserTie, 
  FaPhoneAlt, FaRegEnvelope, FaUserCheck, FaUserClock, FaGraduationCap, FaBriefcase, FaPlus, FaCalendarCheck
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

// Componente principal para ver el detalle de una empresa
function VerEmpresa() {
  const { id } = useParams();
  const { getEmpresa, getEstadisticasEmpresa } = useEmpresas();
  const [empresa, setEmpresa] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);
  const navigate = useNavigate();

  // Función para cargar los datos de la empresa
  const loadEmpresaData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const empresaData = await getEmpresa(id);
      setEmpresa(empresaData);
      
      // Cargar estadísticas después de obtener la empresa
      if (empresaData) {
        setLoadingEstadisticas(true);
        const stats = await getEstadisticasEmpresa(id);
        setEstadisticas(stats);
      }
    } catch (error) {
      console.error("Error cargando la empresa:", error);
      setEmpresa(null);
      toast.error("Error al cargar los datos de la empresa", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setLoadingEstadisticas(false);
    }
  }, [id, getEmpresa, getEstadisticasEmpresa]);

  // useEffect para llamar la carga de datos cuando el componente se monta
  useEffect(() => {
    loadEmpresaData();
  }, [loadEmpresaData]);

  // Renderiza un estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">Cargando empresa...</h2>
        </div>
      </div>
    );
  }

  // Renderiza un mensaje de error si la empresa no se encuentra
  if (!empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Empresa no encontrada</h2>
          <button
            type="button"
            onClick={() => navigate("/empresas")}
            className="flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition mx-auto"
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium text-sm">Regresar a Empresas</span>
          </button>
        </div>
      </div>
    );
  }

  const participantes = empresa.participantes || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative py-10">
      <button
        type="button"
        onClick={() => navigate("/empresas")}
        className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm">Regresar</span>
      </button>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
            <FaBuilding className="text-3xl text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">{empresa.nombre}</h1>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
              empresa.estado === 'activa' 
                ? 'bg-green-100 text-green-800' 
                : empresa.estado === 'inactiva' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {empresa.estado}
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Datos Básicos de la Empresa */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
              Información Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info icon={<FaTag />} label="Tipo" value={empresa.tipo} />
              <Info icon={<FaIdCard />} label="RFC" value={empresa.rfc} />
              <Info icon={<FaPhone />} label="Teléfono" value={empresa.telefono} />
              <Info icon={<FaEnvelope />} label="Correo Electrónico" value={empresa.correo} />
              <Info icon={<FaMapMarkerAlt />} label="Dirección" value={empresa.direccion} />
              <Info icon={<FaMapMarkerAlt />} label="Municipio" value={empresa.municipio} />
            </div>
          </section>

          {/* Información de Contacto */}
          {empresa.contacto && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
                Persona de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info icon={<FaUserTie />} label="Nombre" value={empresa.contacto.nombre} />
                <Info icon={<FaBriefcase />} label="Puesto" value={empresa.contacto.puesto} />
                <Info icon={<FaPhoneAlt />} label="Teléfono" value={empresa.contacto.telefono} />
                <Info icon={<FaRegEnvelope />} label="Correo" value={empresa.contacto.correo} />
              </div>
            </section>
          )}

          {/* Estadísticas */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
              Estadísticas
            </h2>
            {loadingEstadisticas ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-2"></div>
                <p className="text-gray-500 dark:text-gray-400">Cargando estadísticas...</p>
              </div>
            ) : estadisticas ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <FaUsers className="text-2xl text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-bold">{estadisticas.estadisticas.total_participantes}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Participantes</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <FaUserCheck className="text-2xl text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-lg font-bold">{estadisticas.estadisticas.participantes_activos}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Activos</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                  <FaUserClock className="text-2xl text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-lg font-bold">{estadisticas.estadisticas.participantes_inactivos}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Inactivos</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <FaGraduationCap className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-lg font-bold">{estadisticas.estadisticas.cursos_completados}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Cursos completados</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No se encontraron estadísticas para esta empresa
              </div>
            )}
          </section>

          {/* Participantes Asociados */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
              Participantes Asociados ({participantes.length})
            </h2>
            
            {participantes.length > 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participantes.map((participante, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            to={`/verParticipante/${participante.participante_id}`} 
                            className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-2"
                          >
                            <FaUserTie />
                            {participante.nombre || 'Participante sin nombre'}
                          </Link>
                          <div className="text-sm text-gray-500 mt-2">
                            <div className="flex items-center gap-2">
                              <FaCalendarCheck />
                              <span>
                                Asociado el: {new Date(participante.fecha_asociacion).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs capitalize px-2 py-1 rounded-full ${
                                participante.estado === 'activo' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {participante.estado}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {participante.cursos_completados || 0} cursos
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FaUsers className="mx-auto text-4xl mb-2" />
                <p>Esta empresa no tiene participantes asociados.</p>
              </div>
            )}
                            <div className="text-center mt-4">
                  <Link
                    to={`/add-participantes-to/${id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/add-participantes-to/${id}`);
                        console.log("se envia el id:", id);
                      }}
                    >
                      <FaPlus className="mr-2" />
                      Agregar Participante
                    </button>
                  </Link>
                </div>
          </section>

          {/* Cursos con Participantes */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
              Cursos con Participantes
            </h2>
            
            {empresa.cursos_con_participantes && empresa.cursos_con_participantes.length > 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
                {empresa.cursos_con_participantes.map((curso, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/cursos/${curso.curso_info?.id}`} 
                          className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-2"
                        >
                          <FaBookOpen />
                          {curso.curso_info?.nombre || 'Curso sin nombre'}
                        </Link>
                        <div className="text-sm text-gray-500 mt-2">
                          <div className="flex items-center gap-2">
                            <FaCalendarCheck />
                            <span>
                              {curso.curso_info?.fechaInicio ? 
                                `${new Date(curso.curso_info.fechaInicio).toLocaleDateString()} - ${new Date(curso.curso_info.fechaFin).toLocaleDateString()}` : 
                                'Sin fechas definidas'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <FaUserTie />
                            <span>Instructor: {curso.curso_info?.instructor || 'No asignado'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {curso.participantes.length} participantes
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {curso.participantes.map((participante, pIndex) => (
                        <div 
                          key={pIndex} 
                          className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded"
                        >
                          <Link 
                            to={`/verParticipante/${participante.id}`} 
                            className="text-blue-600 dark:text-blue-300 hover:underline"
                          >
                            {participante.nombre}
                          </Link>
                          <span className={`text-xs capitalize px-2 py-1 rounded-full ${
                            participante.estado === 'inscrito' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            participante.estado === 'completado' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {participante.estado}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FaBookOpen className="mx-auto text-4xl mb-2" />
                <p>No hay cursos con participantes de esta empresa.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default VerEmpresa;