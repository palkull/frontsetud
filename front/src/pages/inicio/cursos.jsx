import { useCurso } from "../../context/CursoContext";
import Nav from "../../components/nav/nav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";

function Cursos() {
  const { cursos, getCursos, addCurso } = useCurso();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tipo, setTipo] = useState("");
  const [modalidad, setModalidad] = useState("");
  const navigate = useNavigate();

  // Cargar cursos al montar
  useEffect(() => {
    getCursos();
  }, []);

  // Filtrado
  const filteredCursos = cursos.filter(curso => {
    const nombre = curso.nombre ? curso.nombre.toLowerCase() : "";
    const matchesSearch = nombre.includes(search.toLowerCase());
    const matchesTipo = tipo ? curso.tipo === tipo : true;
    const matchesModalidad = modalidad ? curso.modalidad === modalidad : true;
    return matchesSearch && matchesTipo && matchesModalidad;
  });

  // Redirecciona a la página de verCurso con el id
  const handleVerMas = (id) => {
    navigate(`/verCurso/${id}`);
  };

  // Importar cursos desde Excel
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Procesa cada curso como en addCurso
      for (const row of rows) {
        try {
          await addCurso(row);
        } catch (error) {
          // Puedes mostrar un toast o manejar el error aquí
          console.error("Error al importar curso:", error);
        }
      }
      getCursos(); // Actualiza la lista después de importar
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <ul className="text-left font-medium text-lg leading-none divide-y divide-blue-200 border-blue-200">
            <li>
              <Link to="/add-cursos" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                Añadir Curso
              </Link>
            </li>
            <li>
              <Link to="delete" className="py-3.5 w-full flex items-start text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                <div>
                  Eliminar curso
                  <span className="font-normal text-gray-500 text-sm block"> (con confirmación)</span>
                </div>
              </Link>
            </li>
            <li>
              <label className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                Importar cursos desde Excel
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>
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
                  placeholder="Buscar curso por nombre..."
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
                  <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Tipo</label>
                  <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Todos</option>
                    <option value="curso">Curso</option>
                    <option value="evaluacion">Evaluación</option>
                    <option value="certificacion">Certificación</option>
                    <option value="diplomado">Diplomado</option>
                    <option value="distintivo">Distintivo</option>
                    <option value="seminario">Seminario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Modalidad</label>
                  <select
                    value={modalidad}
                    onChange={e => setModalidad(e.target.value)}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Todas</option>
                    <option value="presencial">Presencial</option>
                    <option value="online">Online</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-900">
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Nombre</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Modalidad</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Fecha Inicio</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Fecha Fin</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredCursos.map(curso => (
                    <tr key={curso._id || curso.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                      <td className="px-4 py-2 font-semibold text-blue-700 dark:text-blue-300">{curso.nombre}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{curso.tipo}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{curso.modalidad}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {curso.fechaInicio ? curso.fechaInicio.slice(0, 10) : ""}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {curso.fechaFin ? curso.fechaFin.slice(0, 10) : ""}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                          onClick={() => handleVerMas(curso._id || curso.id)}
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
              {filteredCursos.length === 0 && (
                <div className="text-center text-gray-500 py-8">No hay cursos registrados.</div>
              )}
            </div>
          </main>
        </section>
      </div>
    </>
  );
}

export default Cursos;