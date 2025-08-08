import { useEmpresas } from "../../context/EmpresasContext";
import Nav from "../../components/nav/nav";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaEye, FaFileExcel, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function Empresas() {
  const { empresas, getEmpresas, createEmpresa } = useEmpresas();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tipoFilter, setTipoFilter] = useState("");
  const [municipioFilter, setMunicipioFilter] = useState("");
  const [deleteMode, setDeleteMode] = useState(false); // Nuevo estado para modo eliminación
  const [selectedIds, setSelectedIds] = useState([]); // Nuevo estado para IDs seleccionados
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
    
    const matchesSearch = nombre.includes(search.toLowerCase()) || 
                         rfc.includes(search.toLowerCase()) ||
                         empresa.correo?.toLowerCase().includes(search.toLowerCase());
    const matchesTipo = tipoFilter ? tipo.includes(tipoFilter.toLowerCase()) : true;
    const matchesMunicipio = municipioFilter ? municipio.includes(municipioFilter.toLowerCase()) : true;
    
    return matchesSearch && matchesTipo && matchesMunicipio;
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

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 mt-4">
        {/* Topbar elegante */}
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm  dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/add-empresas"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all font-medium"
            >
              <span className="text-sm">➕</span>
              Añadir Empresa
            </Link>

            <Link
              to="/historial-empresas"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all font-medium"
            >
              <span className="text-sm">📜</span>
              Historial Empresas
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
            
            {/* Botón para activar modo eliminación */}
            <button
              type="button"
              onClick={handleDeleteMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                deleteMode
                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              }`}
            >
              <FaTrash className="text-lg" />
              <span>Eliminar Empresas</span>
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
                Empresas Registradas ({filteredEmpresas.length})
              </h2>
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
              <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Tipo</label>
                  <select
                    value={tipoFilter}
                    onChange={e => setTipoFilter(e.target.value)}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposUnicos.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-blue-700 dark:text-blue-300 mb-1">Municipio</label>
                  <select
                    value={municipioFilter}
                    onChange={e => setMunicipioFilter(e.target.value)}
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Todos los municipios</option>
                    {municipiosUnicos.map(municipio => (
                      <option key={municipio} value={municipio}>{municipio}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setTipoFilter("");
                      setMunicipioFilter("");
                      setSearch("");
                    }}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  >
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
          </main>
        </section>
      </div>
    </>
  );
}

export default Empresas;