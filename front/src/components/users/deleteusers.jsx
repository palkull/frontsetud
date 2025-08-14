import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaEye, FaFileExcel, FaArrowLeft, FaCalendarAlt, FaClock, FaBuilding } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Nav from "../../components/nav/nav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function HistorialUsuarios() {
  const { getUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [puesto, setPuesto] = useState("");
  const [rol, setRol] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getUsers();
        setUsers(Array.isArray(res) ? res : [res]);
      } catch (error) {
        console.error("Error al cargar historial:", error);
        toast.error("Error al cargar el historial de usuarios");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getUsers]);

  // Filtrado de usuarios con status en false
  const filteredUsers = (users || []).filter(user => {
    const nombre = user.nombre ? user.nombre.toLowerCase() : "";
    const correo = user.correo ? user.correo.toLowerCase() : "";
    const matchesSearch =
      nombre.includes(search.toLowerCase()) ||
      correo.includes(search.toLowerCase());
    const matchesPuesto = puesto ? user.puesto?.toLowerCase().includes(puesto.toLowerCase()) : true;
    const matchesRol = rol !== "" ? String(user.rol) === rol : true;
    const matchesStatus = user.status === false; // Solo usuarios inactivos
    
    // Filtro por mes de baja (si existe fecha_baja)
    let matchesFecha = true;
    if (fechaFilter && user.fecha_baja) {
      const fechaBaja = new Date(user.fecha_baja);
      const [year, month] = fechaFilter.split('-');
      matchesFecha = fechaBaja.getFullYear() == year && (fechaBaja.getMonth() + 1) == month;
    }
    
    return matchesSearch && matchesPuesto && matchesRol && matchesStatus && matchesFecha;
  });

  // Exportar historial a Excel
  const handleExportExcel = () => {
    if (filteredUsers.length === 0) {
      toast.warn("No hay datos en el historial para exportar.");
      return;
    }

    const dataToExport = filteredUsers.map(u => ({
      'Nombre': u.nombre,
      'Correo': u.correo,
      'Puesto': u.puesto,
      'Rol': u.rol ? 'Administrador' : 'Usuario',
      'Teléfono': u.telefono,
      'Fecha de Registro': u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString('es-MX') : 'N/A',
      'Fecha de Baja': u.fecha_baja ? new Date(u.fecha_baja).toLocaleDateString('es-MX') : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HistorialUsuarios");
    XLSX.writeFile(workbook, `HistorialUsuarios_${new Date().toLocaleDateString('es-MX').replace(/\//g, '-')}.xlsx`);
    
    toast.success("Historial exportado correctamente");
  };

  // Ver más detalles del usuario
  const handleVerMas = (id) => {
    navigate(`/verUsuario/${id}`);
  };

  // Calcular estadísticas básicas
  const estadisticas = {
    total_inactivos: filteredUsers.length,
    administradores_inactivos: filteredUsers.filter(u => u.rol === true).length,
    usuarios_inactivos: filteredUsers.filter(u => u.rol === false).length,
    puestos_afectados: [...new Set(filteredUsers.map(u => u.puesto).filter(Boolean))].length
  };

  // Puestos únicos para el filtro
  const puestosUnicos = [...new Set(users.map(u => u.puesto).filter(Boolean))];

  if (loading) {
    return (
      <>
        <Nav />
        <div className="container mx-auto px-4 mt-4 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
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
              to="/usuarios"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft />
              Volver
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Historial de Usuarios
            </h1>
          </div>

          {/* Tarjetas de estadísticas */}
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
                  <p className="text-2xl font-bold text-red-900 dark:text-red-300">{estadisticas.total_inactivos}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 font-bold">⚡</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-400">Admins Inactivos</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{estadisticas.administradores_inactivos}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">👤</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Usuarios Inactivos</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{estadisticas.usuarios_inactivos}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <FaBuilding className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">Puestos Afectados</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">{estadisticas.puestos_afectados}</p>
                </div>
              </div>
            </div>
          </div>
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
                placeholder="Buscar usuario por nombre o correo..."
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
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Puesto</label>
                <select
                  value={puesto}
                  onChange={e => setPuesto(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                >
                  <option value="">Todos los puestos</option>
                  {puestosUnicos.map(puestoItem => (
                    <option key={puestoItem} value={puestoItem}>{puestoItem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Rol</label>
                <select
                  value={rol}
                  onChange={e => setRol(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                >
                  <option value="">Todos</option>
                  <option value="true">Administrador</option>
                  <option value="false">Usuario</option>
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
                    setPuesto("");
                    setRol("");
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
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Correo</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Puesto</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Ver más</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 dark:divide-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user._id || user.id} className="hover:bg-red-25 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{user.nombre}</div>
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={`mailto:${user.correo}`} 
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                      >
                        {user.correo}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {user.puesto || 'No especificado'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.rol 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {user.rol ? "⚡ Administrador" : "👤 Usuario"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={`tel:${user.telefono}`} 
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500"
                      >
                        {user.telefono}
                      </a>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
                        onClick={() => handleVerMas(user._id || user.id)}
                        title="Ver más detalles"
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
            {filteredUsers.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-12">
                {users.filter(u => u.status === false).length === 0 
                  ? (
                    <div>
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-lg font-medium mb-2">No hay historial de usuarios</p>
                      <p className="text-sm">Aún no se han dado de baja usuarios del sistema.</p>
                    </div>
                  ) 
                  : (
                    <div>
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-lg font-medium mb-2">No se encontraron resultados</p>
                      <p className="text-sm">No hay usuarios en el historial con los filtros aplicados.</p>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        </div>

        {/* Footer con información adicional */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div>
                Mostrando {filteredUsers.length} de {users.filter(u => u.status === false).length} registros en el historial
              </div>
              <div>
                Administradores eliminados: {filteredUsers.filter(u => u.rol === true).length} | Usuarios eliminados: {filteredUsers.filter(u => u.rol === false).length}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HistorialUsuarios;