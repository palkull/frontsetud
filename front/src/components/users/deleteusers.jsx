import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaEye } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Nav from "../nav/nav";
import { Link, Outlet } from "react-router-dom";

function DeleteUsers() {
  const { getUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [puesto, setPuesto] = useState("");
  const [rol, setRol] = useState("");

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

  // Filtrado de usuarios con status en false
  const filteredUsers = (users || []).filter(user => {
    const nombre = user.nombre ? user.nombre.toLowerCase() : "";
    const correo = user.correo ? user.correo.toLowerCase() : "";
    const matchesSearch =
      nombre.includes(search.toLowerCase()) ||
      correo.includes(search.toLowerCase());
    const matchesPuesto = puesto ? user.puesto === puesto : true;
    const matchesRol = rol !== "" ? String(user.rol) === rol : true;
    const matchesStatus = user.status === false; // Solo usuarios inactivos
    return matchesSearch && matchesPuesto && matchesRol && matchesStatus;
  });

  // Redirecciona a la página de verUsuario con el id (puedes crearla después)
  const handleVerMas = (id) => {
    // navigate(`/verUsuario/${id}`);
    console.log("Ver usuario:", id);
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <ul className="text-left font-medium text-lg leading-none divide-y divide-blue-200 border-blue-200">
            <li>
              <Link to="/usuarios" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                Usuarios activos
              </Link>
            </li>
            <li>
              <Link to="/deleteusers" className="py-3.5 w-full flex items-center text-blue-500 bg-blue-100 dark:bg-gray-800 hover:text-blue-700 hover:bg-blue-50">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                Usuarios eliminados
              </Link>
            </li>
          </ul>
        </aside>

        {/* Contenido principal */}
        <section className="md:col-span-3">
          <main className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <Outlet />
            {/* Barra de búsqueda y filtros */}
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
            {showFilters && (
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div>
                  <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Puesto</label>
                  <input
                    type="text"
                    value={puesto}
                    onChange={e => setPuesto(e.target.value)}
                    placeholder="Filtrar por puesto"
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  />
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
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-900">
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
                    <tr key={user._id || user.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                      <td className="px-4 py-2 font-semibold text-blue-700 dark:text-blue-300">{user.nombre}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{user.correo}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{user.puesto}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {user.rol ? "Administrador" : "Usuario"}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{user.telefono}</td>
                      <td className="px-4 py-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                          onClick={() => handleVerMas(user._id || user.id)}
                          title="Ver más"
                        >
                          <FaEye />
                          <span className="text-xs">Ver más</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center text-gray-500 py-8">No hay usuarios eliminados.</div>
              )}
            </div>
          </main>
        </section>
      </div>
      <footer className="text-center text-sm text-gray-500 mt-4">2022 KeepCoding</footer>
    </>
  );
}

export default DeleteUsers;