import { useCurso } from "../../context/CursoContext";
import Nav from "../../components/nav/nav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

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

      let importedCount = 0;
      let errorCount = 0;

      // Procesa cada curso
      for (const row of rows) {
        try {
          // Mapeo flexible de columnas
          const cursoData = {
            nombre: row.nombre || row.Nombre,
            tipo: row.tipo || row.Tipo,
            modalidad: row.modalidad || row.Modalidad,
            fechaInicio: row.fechaInicio || row['Fecha Inicio'],
            fechaFin: row.fechaFin || row['Fecha Fin'],
            descripcion: row.descripcion || row.Descripción,
            costo: row.costo || row.Costo,
          };
          await addCurso(cursoData);
          importedCount++;
        } catch (error) {
          console.error("Error al importar curso:", error);
          errorCount++;
        }
      }
      
      getCursos(); // Actualiza la lista después de importar

      if (importedCount > 0) {
        toast.success(`${importedCount} cursos importados correctamente.`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} cursos no pudieron ser importados.`);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Exportar cursos a Excel
  const handleExportExcel = () => {
    if (filteredCursos.length === 0) {
      toast.warn("No hay cursos para exportar con los filtros actuales.", {
        position: "top-center",
      });
      return;
    }

    const dataToExport = filteredCursos.map(curso => ({
      'Nombre': curso.nombre,
      'Tipo': curso.tipo,
      'Modalidad': curso.modalidad,
      'Fecha Inicio': curso.fechaInicio ? new Date(curso.fechaInicio).toLocaleDateString('es-MX') : 'N/A',
      'Fecha Fin': curso.fechaFin ? new Date(curso.fechaFin).toLocaleDateString('es-MX') : 'N/A',
      'Descripción': curso.descripcion || 'N/A',
      'Costo': curso.costo || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cursos");
    XLSX.writeFile(workbook, "ReporteCursos.xlsx");
    toast.success("Reporte de cursos exportado exitosamente.");
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 mt-4">
        {/* Topbar de acciones */}
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm dark:border-gray-700 mb-4">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/add-cursos"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all font-medium"
            >
              <span className="text-sm">➕</span>
              Añadir Curso
            </Link>

            <Link
              to="delete"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-all font-medium"
            >
              <FaTrash className="text-lg" />
              Eliminar Curso
            </Link>

            <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-900 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-all font-medium cursor-pointer">
              <FaFileExcel className="text-lg" />
              Importar Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-900 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-all font-medium"
            >
              <FaFileExcel className="text-lg" />
              Exportar Excel
            </button>
          </div>
        </nav>

        {/* Contenido principal */}
        <section>
          <main className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <Outlet />
            
            {/* Título */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                Cursos Registrados ({filteredCursos.length})
              </h2>
            </div>

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
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setTipo("");
                      setModalidad("");
                      setSearch("");
                    }}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  >
                    Limpiar filtros
                  </button>
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
                        {curso.fechaInicio ? new Date(curso.fechaInicio).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {curso.fechaFin ? new Date(curso.fechaFin).toLocaleDateString() : "N/A"}
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
                <div className="text-center text-gray-500 py-8">
                  {cursos.length === 0 
                    ? "No hay cursos registrados." 
                    : "No se encontraron cursos con los filtros aplicados."
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

export default Cursos;