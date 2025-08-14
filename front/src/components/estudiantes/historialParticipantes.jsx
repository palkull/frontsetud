import { useParticipantes } from "../../context/ParticipantesContext";
import Nav from "../../components/nav/nav";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaEye, FaFileExcel, FaArrowLeft, FaCalendarAlt, FaClock, FaBuilding } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function HistorialParticipantes() {
  const { historialParticipantes, estadisticasHistorial, getHistorialParticipantes, error } = useParticipantes();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar historial al montar
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        await getHistorialParticipantes();
      } catch (error) {
        console.error("Error al cargar historial:", error);
        toast.error("Error al cargar el historial de participantes");
      } finally {
        setLoading(false);
      }
    };
    cargarHistorial();
  }, []);

  // Filtrado - Verificar que historialParticipantes existe y es un array
  const filteredParticipantes = (historialParticipantes || []).filter(participante => {
    const nombre = participante.nombre ? participante.nombre.toLowerCase() : "";
    const empresa = participante.empresaProdecendia ? participante.empresaProdecendia.toLowerCase() : "";
    const correo = participante.correo ? participante.correo.toLowerCase() : "";
    
    const matchesSearch = nombre.includes(search.toLowerCase()) || 
                          empresa.includes(search.toLowerCase()) ||
                          correo.includes(search.toLowerCase());
    
    const matchesEmpresa = empresaFilter ? empresa.includes(empresaFilter.toLowerCase()) : true;
    
    // Filtro por mes de baja
    let matchesFecha = true;
    if (fechaFilter && participante.fecha_baja) {
      const fechaBaja = new Date(participante.fecha_baja);
      const [year, month] = fechaFilter.split('-');
      matchesFecha = fechaBaja.getFullYear() == year && (fechaBaja.getMonth() + 1) == month;
    }
    
    return matchesSearch && matchesEmpresa && matchesFecha;
  });

  // Exportar historial a Excel
  const handleExportExcel = () => {
    if (filteredParticipantes.length === 0) {
      toast.warn("No hay datos en el historial para exportar.");
      return;
    }

    const dataToExport = filteredParticipantes.map(p => ({
      'Nombre': p.nombre,
      'Empresa': p.empresaProdecendia,
      'Puesto': p.puesto,
      'Correo': p.correo,
      'Teléfono': p.telefono,
      'Fecha de Registro': p.fecha_creacion_formateada,
      'Fecha de Baja': p.fecha_baja_formateada,
      'Tiempo Activo': p.tiempo_activo?.texto || 'N/A',
      'Cursos Completados': p.estadisticas_cursos?.completados || 0,
      'Cursos Abandonados': p.estadisticas_cursos?.abandonados || 0,
      'Total Cursos': p.estadisticas_cursos?.total || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HistorialEstudiantes");
    XLSX.writeFile(workbook, `HistorialEstudiantes_${new Date().toLocaleDateString('es-MX').replace(/\//g, '-')}.xlsx`);
    
    toast.success("Historial exportado correctamente");
  };

  // Ver detalles del participante
  const handleVerMas = (id) => {
    navigate(`/verParticipante/${id}`);
  };

  // Empresas únicas para el filtro - Verificar que historialParticipantes existe
  const empresasUnicas = [...new Set((historialParticipantes || []).map(p => p.empresaProdecendia).filter(Boolean))];

  if (loading) {
    return (
      <>
        <Nav />
        <div className="container mx-auto px-4 mt-4 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando historial...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 mt-4">
        {/* Header con estadísticas */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to="/participantes"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft />
              Volver
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Historial de Estudiantes
            </h1>
          </div>

          {/* Tarjetas de estadísticas */}
          {estadisticasHistorial && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">Total Inactivos</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-300">{estadisticasHistorial.total_inactivos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-400">Bajas Este Mes</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{estadisticasHistorial.bajas_este_mes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">Cursos Completados</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300">{estadisticasHistorial.total_cursos_completados}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <FaBuilding className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Empresas Afectadas</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{estadisticasHistorial.empresas_afectadas}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Topbar */}
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm dark:border-gray-700 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-900 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-all font-medium"
            >
              <FaFileExcel className="text-lg" />
              Exportar Historial
            </button>
          </div>
        </nav>

        {/* Búsqueda y filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, empresa o correo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <FaFilter className="text-lg" />
              <span className="font-medium text-sm">Filtros</span>
            </button>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Empresa</label>
                <select
                  value={empresaFilter}
                  onChange={e => setEmpresaFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                >
                  <option value="">Todas las empresas</option>
                  {empresasUnicas.map(empresa => (
                    <option key={empresa} value={empresa}>{empresa}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Mes de Baja</label>
                <input
                  type="month"
                  value={fechaFilter}
                  onChange={e => setFechaFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setEmpresaFilter("");
                    setFechaFilter("");
                    setSearch("");
                  }}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabla de historial */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-red-200">
              <thead>
                <tr className="bg-red-50 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Empresa</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Puesto</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Fecha Baja</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Tiempo Activo</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Cursos</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 dark:divide-gray-700">
                {filteredParticipantes.map(participante => (
                  <tr key={participante._id} className="hover:bg-red-25 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{participante.nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{participante.correo}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {participante.empresaProdecendia || 'Sin empresa'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {participante.puesto || 'No especificado'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <FaCalendarAlt className="text-xs" />
                        <span className="text-sm">{participante.fecha_baja_formateada}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FaClock className="text-xs" />
                        <span className="text-sm">{participante.tiempo_activo?.texto || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          ✓ {participante.estadisticas_cursos?.completados || 0}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          ✗ {participante.estadisticas_cursos?.abandonados || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
                        onClick={() => handleVerMas(participante._id)}
                        title="Ver detalles"
                      >
                        <FaEye />
                        Ver más
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Mensaje cuando no hay datos */}
            {filteredParticipantes.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-12">
                {(historialParticipantes || []).length === 0 
                  ? (
                    <div>
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-lg font-medium mb-2">No hay historial de estudiantes</p>
                      <p className="text-sm">Aún no se han dado de baja estudiantes del sistema.</p>
                    </div>
                  ) 
                  : (
                    <div>
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-lg font-medium mb-2">No se encontraron resultados</p>
                      <p className="text-sm">No hay estudiantes en el historial con los filtros aplicados.</p>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        </div>

        {/* Footer con información adicional */}
        {filteredParticipantes.length > 0 && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div>
                Mostrando {filteredParticipantes.length} de {historialParticipantes.length} registros en el historial
              </div>
              <div>
                Total de cursos completados en el historial: {filteredParticipantes.reduce((sum, p) => sum + (p.estadisticas_cursos?.completados || 0), 0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HistorialParticipantes;