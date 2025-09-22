import { useParticipantes } from "../../context/ParticipantesContext";
import Nav from "../../components/nav/nav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// --- (CAMBIO) Se importa el ícono de basura ---
import { FaFilter, FaSearch, FaEye, FaFileExcel, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
// Importar useAuth
import { useAuth } from '../../context/AuthContext';

function Participantes() {
  // Agregar el hook useAuth
  const { isAdmin } = useAuth();
  
  // --- (CAMBIO) Se desestructura 'deleteParticipante' del contexto ---
  const { participantes, getParticipantes, createParticipante, deleteParticipante } = useParticipantes();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [puestoFilter, setPuestoFilter] = useState("");
  const navigate = useNavigate();

  // Asegúrate de que estos estados estén definidos al inicio del componente
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);

  // Add these new state variables after your existing useState declarations
  const [mesFilter, setMesFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

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
    
    // Get participante creation date
    const participanteDate = participante.createdAt ? new Date(participante.createdAt) : null;
    
    // Add date filtering
    const matchesMes = mesFilter 
      ? participanteDate && participanteDate.getMonth() === parseInt(mesFilter) - 1 
      : true;
    const matchesYear = yearFilter 
      ? participanteDate && participanteDate.getFullYear() === parseInt(yearFilter) 
      : true;
    
    return matchesSearch && matchesEmpresa && matchesPuesto && matchesMes && matchesYear;
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
    if (!id) {
        console.error('ID inválido para selección');
        return;
    }
    
    setSelectedToDelete(prevSelected => {
        if (prevSelected.includes(id)) {
            return prevSelected.filter(item => item !== id);
        }
        return [...prevSelected, id];
    });
  };

  // Modifica handleConfirmDelete para mejor manejo de errores
  const handleConfirmDelete = async () => {
    if (!selectedToDelete.length) {
        toast.warn("Selecciona al menos un estudiante para eliminar.", {
            position: "top-center",
            autoClose: 3000,
        });
        return;
    }

    try {
        const confirmacion = window.confirm(
            `¿Estás seguro de que deseas eliminar ${selectedToDelete.length} estudiante(s)?`
        );

        if (!confirmacion) return;

        toast.info("Eliminando estudiantes...", {
            position: "top-center",
            autoClose: 1000,
        });

        // Usar Promise.allSettled en lugar de Promise.all para manejar mejor los errores
        const results = await Promise.allSettled(
            selectedToDelete.map(id => deleteParticipante(id))
        );

        // Contar éxitos y errores
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failCount = results.filter(r => r.status === 'rejected').length;

        if (successCount > 0) {
            toast.success(`${successCount} estudiante(s) eliminado(s) correctamente`, {
                position: "top-center",
                autoClose: 3000,
            });
        }

        if (failCount > 0) {
            toast.error(`${failCount} estudiante(s) no pudieron ser eliminados`, {
                position: "top-center",
                autoClose: 5000,
            });
        }

        // Limpiar estado
        setSelectedToDelete([]);
        setIsDeleteMode(false);
        await getParticipantes();

    } catch (error) {
        console.error("Error en la eliminación:", error);
        toast.error("Ocurrió un error durante la eliminación", {
            position: "top-center",
            autoClose: 5000,
        });
    }
};


  const empresasUnicas = [...new Set(participantes.map(p => p.empresaProdecendia).filter(Boolean))];
  const puestosUnicos = [...new Set(participantes.map(p => p.puesto).filter(Boolean))];

  // Add this array before using it in your JSX
  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" }
  ];

  // Add these helper functions after your state declarations and before the return
const getCurrentYear = () => new Date().getFullYear();

const getEarliestYear = () => {
    const years = participantes
        .map(participante => participante.fechaRegistro ? new Date(participante.fechaRegistro).getFullYear() : null)
        .filter(year => year !== null);
    return years.length > 0 ? Math.min(...years) : 2000;
};

// Agregar esta función después de las otras funciones handle y antes del return
const handleDeleteMode = () => {
    setIsDeleteMode(prevMode => !prevMode);
    // Si estamos saliendo del modo eliminación, limpiamos la selección
    if (isDeleteMode) {
        setSelectedToDelete([]);
    }
};

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-8">
        {/* Barra de acciones superior */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Botones visibles para todos los usuarios */}
            <button
              onClick={() => navigate('/add-participantes')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Estudiante
            </button>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Importar Excel
            </label>

            {/* Botones solo visibles para admin */}
            {isAdmin() && (
              <>
                <button
                  onClick={handleExportExcel}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Exportar Excel
                </button>

                <button
                  onClick={handleDeleteMode}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {isDeleteMode ? 'Cancelar' : 'Eliminar'}
                </button>
              </>
            )}
          </div>

          {/* --- (CAMBIO) Barra de búsqueda y filtros (original) */}
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
        </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-inner">
  <div className="space-y-1">
    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">
      Empresa
    </label>
    <select
      value={empresaFilter}
      onChange={e => setEmpresaFilter(e.target.value)}
      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white text-sm"
    >
      <option value="">Todas las empresas</option>
      {empresasUnicas.map(empresa => (
        <option key={empresa} value={empresa}>{empresa}</option>
      ))}
    </select>
  </div>
  <div className="space-y-1">
    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">
      Puesto
    </label>
    <select
      value={puestoFilter}
      onChange={e => setPuestoFilter(e.target.value)}
      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white text-sm"
    >
      <option value="">Todos los puestos</option>
      {puestosUnicos.map(puesto => (
        <option key={puesto} value={puesto}>{puesto}</option>
      ))}
    </select>
  </div>

  <div className="space-y-1">
    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">
      Mes
    </label>
    <select
      value={mesFilter}
      onChange={e => setMesFilter(e.target.value)}
      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white text-sm"
    >
      <option value="">Todos los meses</option>
      {meses.map(mes => (
        <option key={mes.value} value={mes.value}>{mes.label}</option>
      ))}
    </select>
  </div>

  <div className="space-y-1">
    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">
      Año
    </label>
    <select
      value={yearFilter}
      onChange={e => setYearFilter(e.target.value)}
      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white text-sm"
    >
      <option value="">Todos los años</option>
      {Array.from(
        { length: getCurrentYear() - getEarliestYear() + 1 },
        (_, i) => getCurrentYear() - i
      ).map(year => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  </div>

  <div className="flex items-end">
    <button
      onClick={() => {
        setEmpresaFilter("");
        setPuestoFilter("");
        setMesFilter("");
        setYearFilter("");
        setSearch("");
      }}
      className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
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

export default Participantes;