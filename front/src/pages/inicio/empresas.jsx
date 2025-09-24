import { useAuth } from '../../context/AuthContext';
import { useEmpresas } from "../../context/EmpresasContext";
import Nav from "../../components/nav/nav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaEye, FaFileExcel, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function Empresas() {
  const { isAdmin } = useAuth();
  const { empresas, getEmpresas, createEmpresa } = useEmpresas();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tipoFilter, setTipoFilter] = useState("");
  const [municipioFilter, setMunicipioFilter] = useState("");
  const [deleteMode, setDeleteMode] = useState(false); // Nuevo estado para modo eliminación
  const [selectedIds, setSelectedIds] = useState([]); // Nuevo estado para IDs seleccionados
  const [mesFilter, setMesFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const navigate = useNavigate();

  // Cargar empresas al montar
  useEffect(() => {
    getEmpresas();
  }, []);

  // Filtrado
  const filteredEmpresas = empresas.filter(empresa => {
    const nombre = empresa.nombre ? empresa.nombre.toLowerCase() : "";
    const rfc = empresa.rfc ? empresa.rfc.toLowerCase() : "";
    const municipio = empresa.municipio ? empresa.municipio.toLowerCase() : "";
    const tipo = empresa.tipo ? empresa.tipo.toLowerCase() : "";
    
    // Get empresa creation date (assuming there's a createdAt field)
    const empresaDate = empresa.createdAt ? new Date(empresa.createdAt) : null;
    
    const matchesSearch = nombre.includes(search.toLowerCase()) || 
                         rfc.includes(search.toLowerCase()) ||
                         empresa.correo?.toLowerCase().includes(search.toLowerCase());
    const matchesTipo = tipoFilter ? tipo.includes(tipoFilter.toLowerCase()) : true;
    const matchesMunicipio = municipioFilter ? municipio.includes(municipioFilter.toLowerCase()) : true;
    
    // Add date filtering
    const matchesMes = mesFilter 
        ? empresaDate && empresaDate.getMonth() === parseInt(mesFilter) - 1 
        : true;
    const matchesYear = yearFilter 
        ? empresaDate && empresaDate.getFullYear() === parseInt(yearFilter) 
        : true;
    
    return matchesSearch && matchesTipo && matchesMunicipio && matchesMes && matchesYear;
  });

  // Redirecciona a la página de ver empresa con el id
  const handleVerMas = (id) => {
    navigate(`/verEmpresa/${id}`);
  };

  // Importar empresas desde Excel
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

      // Procesa cada empresa
      for (const row of rows) {
        try {
          // Mapear los nombres de las columnas del Excel a los campos esperados
          const empresaData = {
            nombre: row.nombre || row.Nombre || row.NOMBRE,
            tipo: row.tipo || row.Tipo || row.TIPO,
            rfc: (row.rfc || row.RFC || row.Rfc).toUpperCase(),
            telefono: row.telefono || row.Telefono || row.TELEFONO,
            correo: row.correo || row.email || row.Email || row.EMAIL,
            direccion: row.direccion || row.Direccion || row.DIRECCION,
            municipio: row.municipio || row.Municipio || row.MUNICIPIO,
            contacto: {
              nombre: row.contacto_nombre || row['Contacto Nombre'],
              puesto: row.contacto_puesto || row['Contacto Puesto'],
              telefono: row.contacto_telefono || row['Contacto Telefono'],
              correo: row.contacto_correo || row['Contacto Correo']
            },
            estado: row.estado || 'activa'
          };

          await createEmpresa(empresaData);
          importedCount++;
        } catch (error) {
          console.error("Error al importar empresa:", error);
          errorCount++;
        }
      }
      
      // Actualiza la lista después de importar
      getEmpresas();
      
      // Mostrar resultados de la importación
      if (importedCount > 0) {
        toast.success(`${importedCount} empresas importadas correctamente`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} empresas no pudieron ser importadas`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  // Exportar empresas a Excel
  const handleExportExcel = () => {
    if (filteredEmpresas.length === 0) {
      toast.warn("No hay empresas para exportar con los filtros actuales.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const dataToExport = filteredEmpresas.map(empresa => ({
      'Nombre': empresa.nombre,
      'Tipo': empresa.tipo,
      'RFC': empresa.rfc,
      'Teléfono': empresa.telefono,
      'Correo': empresa.correo,
      'Dirección': empresa.direccion,
      'Municipio': empresa.municipio,
      'Estado': empresa.estado,
      'Contacto Nombre': empresa.contacto?.nombre || 'N/A',
      'Contacto Puesto': empresa.contacto?.puesto || 'N/A',
      'Contacto Teléfono': empresa.contacto?.telefono || 'N/A',
      'Contacto Correo': empresa.contacto?.correo || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Empresas");
    XLSX.writeFile(workbook, "ReporteEmpresas.xlsx");
  };

  // Obtener valores únicos para filtros
  const tiposUnicos = [...new Set(empresas.map(e => e.tipo).filter(Boolean))];
  const municipiosUnicos = [...new Set(empresas.map(e => e.municipio).filter(Boolean))];

  // Función para manejar selección/deselección de empresas
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) 
        ? prev.filter((empresaId) => empresaId !== id) 
        : [...prev, id]
    );
  };

  // Alternar modo de eliminación
  const handleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
    setSelectedIds([]); // Limpiar selección al cambiar modo
  };

  // Función para eliminar empresas seleccionadas (por ahora solo es un placeholder)
  const handleDeleteSelected = () => {
    toast.info("Función de eliminación aún no implementada", {
      position: "top-center",
      autoClose: 2000,
    });
    console.log("Empresas seleccionadas para eliminar:", selectedIds);
  };

  // Obtener el año actual
  const getCurrentYear = () => new Date().getFullYear();

  // Obtener el año más antiguo de las empresas
  const getEarliestYear = () => {
    const years = empresas
        .map(empresa => empresa.createdAt ? new Date(empresa.createdAt).getFullYear() : null)
        .filter(year => year !== null);
    return years.length > 0 ? Math.min(...years) : 2000;
  };

  // Array de meses
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

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-8">
        {/* Barra de acciones superior */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Botones visibles para todos los usuarios */}
            <button
              onClick={() => navigate('/add-empresas')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Empresa
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
                  {deleteMode ? 'Cancelar' : 'Eliminar'}
                </button>
              </>
            )}
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <FaSearch className="text-blue-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, RFC o correo..."
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

          {/* Panel de filtros */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-inner">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                  Tipo
                </label>
                <select
                  value={tipoFilter}
                  onChange={e => setTipoFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white text-sm"
                >
                  <option value="">Todos los tipos</option>
                  {tiposUnicos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                  Municipio
                </label>
                <select
                  value={municipioFilter}
                  onChange={e => setMunicipioFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white text-sm"
                >
                  <option value="">Todos los municipios</option>
                  {municipiosUnicos.map(municipio => (
                    <option key={municipio} value={municipio}>{municipio}</option>
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
                    setTipoFilter("");
                    setMunicipioFilter("");
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

          {/* Contador de seleccionados y botón de eliminar */}
          {deleteMode && selectedIds.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg flex justify-between items-center">
              <span className="text-red-700 dark:text-red-200 font-medium">
                {selectedIds.length} empresa{selectedIds.length > 1 ? 's' : ''} seleccionada{selectedIds.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
              >
                <FaTrash />
                Eliminar seleccionadas
              </button>
            </div>
          )}

          {/* Tabla de empresas */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead>
                <tr className="bg-blue-50 dark:bg-gray-900">
                  {/* Columna para selección en modo eliminación */}
                  {deleteMode && (
                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">
                      Seleccionar
                    </th>
                  )}
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">RFC</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Municipio</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Contacto</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Participantes</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Estado</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredEmpresas.map(empresa => (
                  <tr 
                    key={empresa._id || empresa.id} 
                    className={`hover:bg-blue-50 dark:hover:bg-gray-700 transition ${
                      selectedIds.includes(empresa._id || empresa.id) 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : ""
                    }`}
                  >
                    {/* Checkbox para selección en modo eliminación */}
                    {deleteMode && (
                      <td className="px-4 py-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(empresa._id || empresa.id)}
                            onChange={() => handleCheckboxChange(empresa._id || empresa.id)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                            style={{ accentColor: "#2563eb" }}
                          />
                        </label>
                      </td>
                    )}
                    <td className="px-4 py-2 font-semibold text-blue-700 dark:text-blue-300">
                      {empresa.nombre}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {empresa.tipo}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400 font-mono">
                      {empresa.rfc}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {empresa.municipio}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {empresa.contacto?.nombre || 'N/A'}
                      {empresa.contacto?.puesto && (
                        <span className="block text-xs text-gray-500">{empresa.contacto.puesto}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {empresa.participantes?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        empresa.estado === 'activa' 
                          ? 'bg-green-100 text-green-800' 
                          : empresa.estado === 'inactiva' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {empresa.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
                        onClick={() => handleVerMas(empresa._id || empresa.id)}
                        title="Ver más detalles"
                        disabled={deleteMode} // Deshabilitar en modo eliminación
                      >
                        <FaEye />
                        <span className="text-xs">Ver más</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Mensaje cuando no hay empresas */}
            {filteredEmpresas.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                {empresas.length === 0 
                  ? "No hay empresas registradas." 
                  : "No se encontraron empresas con los filtros aplicados."
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Empresas;