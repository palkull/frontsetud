import { Link, Outlet, useNavigate } from "react-router-dom";
import Nav from "../../components/nav/nav";
import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function Usuarios() {
  const { getUsers, deleteUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [puesto, setPuesto] = useState("");
  const [rol, setRol] = useState("");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(Array.isArray(res) ? res : [res]);
      } catch (error) {
        console.error(error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, [getUsers]);

  // Filtrado de usuarios
  const filteredUsers = (users || []).filter(user => {
    const nombre = user.nombre ? user.nombre.toLowerCase() : "";
    const correo = user.correo ? user.correo.toLowerCase() : "";
    const matchesSearch =
      nombre.includes(search.toLowerCase()) ||
      correo.includes(search.toLowerCase());
    const matchesPuesto = puesto ? user.puesto === puesto : true;
    const matchesRol = rol !== "" ? String(user.rol) === rol : true;
    const matchesStatus = user.status === true; // Solo usuarios activos
    return matchesSearch && matchesPuesto && matchesRol && matchesStatus;
  });

  // Nueva función para manejar la selección de usuarios a eliminar
  const handleSelectToDelete = (id) => {
    setSelectedToDelete(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(item => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (selectedToDelete.length === 0) {
      toast.warn("Selecciona al menos un usuario para eliminar.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar ${selectedToDelete.length} usuario(s)? Esta acción cambiará su estado a inactivo.`
    );

    if (!confirmacion) return;

    try {
      toast.info("Eliminando usuarios...", {
        position: "top-center",
        autoClose: 1000,
      });

      await deleteUsers(selectedToDelete);
      
      toast.success(
        `${selectedToDelete.length} usuario${selectedToDelete.length > 1 ? 's' : ''} eliminado${selectedToDelete.length > 1 ? 's' : ''} correctamente`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      
      // Limpiar el estado y salir del modo eliminación
      setSelectedToDelete([]);
      setIsDeleteMode(false);
      
      // Actualizar la lista después de eliminar
      const res = await getUsers();
      setUsers(Array.isArray(res) ? res : [res]);
      
    } catch (error) {
      console.error("Error al eliminar usuarios:", error);
      toast.error("Error al eliminar algunos usuarios. Intenta nuevamente.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  // Redirecciona a la página de verUsuario con el id
  const handleVerMas = (id) => {
    navigate(`/verUsuario/${id}`);
  };

  // Obtener puestos únicos para el filtro
  const puestosUnicos = [...new Set(users.map(u => u.puesto).filter(Boolean))];

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 mt-4">
        {/* Topbar elegante */}
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/add-usuarios"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all font-medium"
            >
              <span className="text-sm">➕</span>
              Añadir Usuario
            </Link>

            <Link
              to="/historial-usuarios"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all font-medium"
            >
              <span className="text-sm">📜</span>
              Historial Usuarios
            </Link>
            
            {/* Botón para activar el modo de eliminación */}
            <button
              type="button"
              onClick={() => setIsDeleteMode(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${isDeleteMode ? "bg-red-200 text-red-900" : "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"}`}
            >
              <FaTrash className="text-lg" />
              {isDeleteMode ? "Cancelar" : "Eliminar"}
            </button>
          </div>
        </nav>

        {/* Contenido principal */}
        <section className="md:col-span-3">
          <main className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <Outlet />
            
            {/* Título */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                Usuarios Registrados ({filteredUsers.length})
              </h2>
            </div>

            {/* Barra de acciones cambia en modo eliminación */}
            {isDeleteMode ? (
              <div className="flex items-center justify-between mb-4 p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
                <span className="font-medium text-red-800 dark:text-red-200">
                  {selectedToDelete.length} usuario(s) seleccionado(s)
                </span>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Confirmar Eliminación
                </button>
              </div>
            ) : (
              // Barra de búsqueda y filtros (original)
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex items-center gap-2 w-full md:w-1/2">
                  <FaSearch className="text-blue-500" />
                  <input
                    type="text"
                    placeholder="Buscar usuario por nombre o correo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(f => !f)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                >
                  <FaFilter className="text-lg" />
                  <span className="font-medium text-sm">Filtros</span>
                </button>
              </div>
            )}

            {/* Panel de filtros */}
            {showFilters && (
              <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Puesto</label>
                  <select
                    value={puesto}
                    onChange={e => setPuesto(e.target.value)}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Todos los puestos</option>
                    {puestosUnicos.map(puestoItem => (
                      <option key={puestoItem} value={puestoItem}>{puestoItem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Rol</label>
                  <select
                    value={rol}
                    onChange={e => setRol(e.target.value)}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Todos</option>
                    <option value="true">Administrador</option>
                    <option value="false">Usuario</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setPuesto("");
                      setRol("");
                      setSearch("");
                    }}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de usuarios */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-900">
                    {/* Cabecera para el checkbox, solo visible en modo eliminación */}
                    {isDeleteMode && (
                      <th className="px-4 py-2 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Sel.</th>
                    )}
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Nombre</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Correo</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Puesto</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Rol</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Teléfono</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredUsers.map(user => (
                    <tr key={user._id || user.id} className={`transition ${isDeleteMode && selectedToDelete.includes(user._id || user.id) ? 'bg-red-100 dark:bg-red-900/50' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`}>
                      {/* Celda con el checkbox, solo visible en modo eliminación */}
                      {isDeleteMode && (
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            checked={selectedToDelete.includes(user._id || user.id)}
                            onChange={() => handleSelectToDelete(user._id || user.id)}
                          />
                        </td>
                      )}
                      <td className="px-4 py-2 font-semibold text-blue-700 dark:text-blue-300">{user.nombre}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        <a href={`mailto:${user.correo}`} className="hover:text-blue-500">
                          {user.correo}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{user.puesto}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.rol ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.rol ? "Administrador" : "Usuario"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        <a href={`tel:${user.telefono}`} className="hover:text-blue-500">
                          {user.telefono}
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                          onClick={() => handleVerMas(user._id || user.id)}
                          title="Ver más detalles"
                          disabled={isDeleteMode}
                        >
                          <FaEye />
                          <span className="text-xs">Ver más</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mensaje cuando no hay usuarios */}
              {filteredUsers.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {users.length === 0 
                    ? "No hay usuarios registrados." 
                    : "No se encontraron usuarios con los filtros aplicados."
                  }
                </div>
              )}
            </div>
          </main>
        </section>
      </div>
    </>
  );
}

export default Usuarios;