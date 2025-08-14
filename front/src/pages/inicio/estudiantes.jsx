import { useParticipantes } from "../../context/ParticipantesContext";
import Nav from "../../components/nav/nav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// --- (CAMBIO) Se importa el ícono de basura ---
import { FaFilter, FaSearch, FaEye, FaFileExcel, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function Estudiantes() {
  // --- (CAMBIO) Se desestructura 'deleteParticipante' del contexto ---
  const { participantes, getParticipantes, createParticipante, deleteParticipante } = useParticipantes();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [puestoFilter, setPuestoFilter] = useState("");
  const navigate = useNavigate();

  // --- (CAMBIO) Nuevos estados para el modo de eliminación ---
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);

  // Cargar participantes al montar
  useEffect(() => {
    getParticipantes();
  }, []);

  // Filtrado
  const filteredParticipantes = participantes.filter(participante => {
    const nombre = participante.nombre ? participante.nombre.toLowerCase() : "";
    const empresa = participante.empresaProdecendia ? participante.empresaProdecendia.toLowerCase() : "";
    const puesto = participante.puesto ? participante.puesto.toLowerCase() : "";
    
    const matchesSearch = nombre.includes(search.toLowerCase()) || 
                          empresa.includes(search.toLowerCase()) ||
                          participante.correo?.toLowerCase().includes(search.toLowerCase());
    const matchesEmpresa = empresaFilter ? empresa.includes(empresaFilter.toLowerCase()) : true;
    const matchesPuesto = puestoFilter ? puesto.includes(puestoFilter.toLowerCase()) : true;
    
    return matchesSearch && matchesEmpresa && matchesPuesto;
  });

  // Redirecciona a la página de ver participante con el id
  const handleVerMas = (id) => {
    navigate(`/verParticipante/${id}`);
  };

  // Importar participantes desde Excel
  const handleImportExcel = async (e) => {
    // ... (El código de importación no ha cambiado)
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

      for (const row of rows) {
        try {
          const participanteData = {
            nombre: row.nombre || row.Nombre || row.NOMBRE,
            empresaProdecendia: row.empresaProdecendia || row.empresa || row.Empresa || row.EMPRESA,
            puesto: row.puesto || row.Puesto || row.PUESTO,
            edad: parseInt(row.edad || row.Edad || row.EDAD),
            correo: row.correo || row.email || row.Email || row.EMAIL,
            telefono: row.telefono || row.Telefono || row.TELEFONO,
            curp: row.curp || row.CURP || row.Curp
          };

          await createParticipante(participanteData);
          importedCount++;
        } catch (error) {
          console.error("Error al importar participante:", error);
          errorCount++;
        }
      }
      
      getParticipantes();
      
      if (importedCount > 0) {
        toast.success(`${importedCount} participantes importados correctamente`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} participantes no pudieron ser importados`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  // Exportar participantes a Excel
  const handleExportExcel = () => {
    // ... (El código de exportación no ha cambiado)
    if (filteredParticipantes.length === 0) {
      toast.warn("No hay estudiantes para exportar con los filtros actuales.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const dataToExport = filteredParticipantes.map(p => ({
      'Nombre': p.nombre,
      'Empresa': p.empresaProdecendia,
      'Puesto': p.puesto,
      'Edad': p.edad,
      'Correo': p.correo,
      'Teléfono': p.telefono,
      'CURP': p.curp,
      'Cursos Inscritos': p.cursos_inscritos?.length || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
    XLSX.writeFile(workbook, "ReporteEstudiantes.xlsx");
  };

  // --- (CAMBIO) Nueva función para manejar la selección de participantes a eliminar ---
  const handleSelectToDelete = (id) => {
    setSelectedToDelete(prevSelected => {
      // Si el ID ya está en la lista, lo quitamos (desmarcar checkbox)
      if (prevSelected.includes(id)) {
        return prevSelected.filter(item => item !== id);
      }
      // Si no está, lo añadimos (marcar checkbox)
      else {
        return [...prevSelected, id];
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (selectedToDelete.length === 0) {
        toast.warn("Selecciona al menos un participante para eliminar.", {
            position: "top-center",
            autoClose: 3000,
        });
        return;
    }

    // Mostrar confirmación antes de proceder
    const confirmacion = window.confirm(
        `¿Estás seguro de que deseas eliminar ${selectedToDelete.length} participante(s)? Esta acción cambiará su estado a inactivo.`
    );

    if (!confirmacion) return;

    try {
        // Mostrar loading
        toast.info("Eliminando participantes...", {
            position: "top-center",
            autoClose: 1000,
        });

        // Eliminar cada participante seleccionado
        await Promise.all(
            selectedToDelete.map(async (id) => {
                try {
                    await deleteParticipante(id);
                } catch (error) {
                    console.error(`Error al eliminar participante ${id}:`, error);
                    throw error;
                }
            })
        );

        // Éxito
        toast.success(`${selectedToDelete.length} participante(s) eliminado(s) correctamente`, {
            position: "top-center",
            autoClose: 3000,
        });

        // Limpiar el estado y salir del modo eliminación
        setSelectedToDelete([]);
        setIsDeleteMode(false);
        
        // Recargar la lista de participantes
        await getParticipantes();
        
    } catch (error) {
        console.error("Error al eliminar participantes:", error);
        toast.error("Error al eliminar algunos participantes. Intenta nuevamente.", {
            position: "top-center",
            autoClose: 5000,
        });
    }
};


  const empresasUnicas = [...new Set(participantes.map(p => p.empresaProdecendia).filter(Boolean))];
  const puestosUnicos = [...new Set(participantes.map(p => p.puesto).filter(Boolean))];

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 mt-4">
        {/* Topbar elegante */}
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/add-participantes"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all font-medium"
            >
              <span className="text-sm">➕</span>
              Añadir Estudiante
            </Link>

            <Link
              to="/historial-participantes"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all font-medium"
            >
              <span className="text-sm">📜</span>
              Historial Estudiantes
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
            
            {/* --- (CAMBIO) Botón para activar el modo de eliminación --- */}
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
                Estudiantes Registrados ({filteredParticipantes.length})
              </h2>
            </div>

            {/* --- (CAMBIO) Barra de acciones cambia en modo eliminación --- */}
            {isDeleteMode ? (
              <div className="flex items-center justify-between mb-4 p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
                <span className="font-medium text-red-800 dark:text-red-200">
                  {selectedToDelete.length} participante(s) seleccionado(s)
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
                    placeholder="Buscar por nombre, empresa o correo..."
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
    <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Empresa</label>
    <select
      value={empresaFilter}
      onChange={e => setEmpresaFilter(e.target.value)}
      className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
    >
      <option value="">Todas las empresas</option>
      {empresasUnicas.map(empresa => (
        <option key={empresa} value={empresa}>{empresa}</option>
      ))}
    </select>
  </div>
  <div>
    <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Puesto</label>
    <select
      value={puestoFilter}
      onChange={e => setPuestoFilter(e.target.value)}
      className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
    >
      <option value="">Todos los puestos</option>
      {puestosUnicos.map(puesto => (
        <option key={puesto} value={puesto}>{puesto}</option>
      ))}
    </select>
  </div>
  <div className="flex items-end">
    <button
      onClick={() => {
        setEmpresaFilter("");
        setPuestoFilter("");
        setSearch("");
      }}
      className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
    >
      Limpiar filtros
    </button>
  </div>
</div>
            )}

            {/* Tabla de participantes */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-900">
                    {/* --- (CAMBIO) Cabecera para el checkbox, solo visible en modo eliminación --- */}
                    {isDeleteMode && (
                        <th className="px-4 py-2 text-left text-xs font-bold text-red-700 dark:text-red-300 uppercase">Sel.</th>
                    )}
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Nombre</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Empresa</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Puesto</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Edad</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Correo</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Teléfono</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Cursos</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredParticipantes.map(participante => (
                    <tr key={participante._id || participante.id} className={`transition ${isDeleteMode && selectedToDelete.includes(participante._id || participante.id) ? 'bg-red-100 dark:bg-red-900/50' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`}>
                      {/* --- (CAMBIO) Celda con el checkbox, solo visible en modo eliminación --- */}
                      {isDeleteMode && (
                        <td className="px-4 py-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                checked={selectedToDelete.includes(participante._id || participante.id)}
                                onChange={() => handleSelectToDelete(participante._id || participante.id)}
                            />
                        </td>
                      )}
                      <td className="px-4 py-2 font-semibold text-blue-700 dark:text-blue-300">
                        {participante.nombre}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {participante.empresaProdecendia}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {participante.puesto}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {participante.edad} años
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        <a href={`mailto:${participante.correo}`} className="hover:text-blue-500">
                          {participante.correo}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        <a href={`tel:${participante.telefono}`} className="hover:text-blue-500">
                          {participante.telefono}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {participante.cursos_inscritos?.length || 0} cursos
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                          onClick={() => handleVerMas(participante._id || participante.id)}
                          title="Ver más detalles"
                          disabled={isDeleteMode} // Se deshabilita el botón en modo eliminación
                        >
                          <FaEye />
                          <span className="text-xs">Ver más</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mensaje cuando no hay participantes */}
              {filteredParticipantes.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {participantes.length === 0 
                    ? "No hay estudiantes registrados." 
                    : "No se encontraron estudiantes con los filtros aplicados."
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

export default Estudiantes;