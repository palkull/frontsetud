import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/nav/nav";
import { useAuth } from "../../context/AuthContext";
import { useEmpresas } from "../../context/EmpresasContext";
import { useCurso } from "../../context/CursoContext";
import { useParticipantes } from "../../context/ParticipantesContext";
import {
  FaUserGraduate,
  FaUsers,
  FaBookOpen,
  FaBuilding,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const Inicio = () => {
  const { admin, isAdmin } = useAuth();
  const { empresas, getEmpresas } = useEmpresas();
  const { cursos, getCursos } = useCurso();
  const { participantes, getParticipantes } = useParticipantes();

  // States for search and filters
  const [search, setSearch] = useState("");
  const [mesFilter, setMesFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Load all data on mount
  useEffect(() => {
    getEmpresas();
    getCursos();
    getParticipantes();
  }, []);

  // Helper functions for date filtering
  const getCurrentYear = () => new Date().getFullYear();
  
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

  // Filter functions
  const filterByDate = (item) => {
    const date = new Date(item.fechaRegistro || item.createdAt);
    const matchesMes = mesFilter ? date.getMonth() === parseInt(mesFilter) - 1 : true;
    const matchesYear = yearFilter ? date.getFullYear() === parseInt(yearFilter) : true;
    return matchesMes && matchesYear;
  };

  const filterBySearch = (item) => {
    const searchLower = search.toLowerCase();
    return item.nombre?.toLowerCase().includes(searchLower) ||
           item.empresaProdecendia?.toLowerCase().includes(searchLower) ||
           item.tipo?.toLowerCase().includes(searchLower);
  };

  // Filtered data
  const filteredEmpresas = empresas.filter(empresa => 
    filterByDate(empresa) && filterBySearch(empresa)
  ).slice(0, 5);

  const filteredCursos = cursos.filter(curso => 
    filterByDate(curso) && filterBySearch(curso)
  ).slice(0, 5);

  const filteredParticipantes = participantes.filter(participante => 
    filterByDate(participante) && filterBySearch(participante)
  ).slice(0, 5);

  // Add these variables to track total filtered items
  const totalEmpresas = empresas.filter(empresa => 
    filterByDate(empresa) && filterBySearch(empresa)
  ).length;

  const totalCursos = cursos.filter(curso => 
    filterByDate(curso) && filterBySearch(curso)
  ).length;

  const totalParticipantes = participantes.filter(participante => 
    filterByDate(participante) && filterBySearch(participante)
  ).length;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/empresas"
              className="group bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col items-center justify-center">
                <FaBuilding className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">
                  Empresas
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 text-center">
                  Empresas registradas.
                </p>
              </div>
            </Link>

            <Link
              to="/participantes"
              className="group bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col items-center justify-center">
                <FaUserGraduate className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">
                  Participantes
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 text-center">
                  Gestiona los participantes aquí.
                </p>
              </div>
            </Link>

            {isAdmin() && (
              <Link
                to="/usuarios"
                className="group bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col items-center justify-center">
                  <FaUsers className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">
                    Usuarios
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 text-center">
                    Gestiona a los usuarios aquí.
                  </p>
                </div>
              </Link>
            )}

            <Link
              to="/cursos"
              className="group bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col items-center justify-center">
                <FaBookOpen className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">
                  Cursos
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 text-center">
                  Explora y gestiona cursos.
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Search Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg">
            {/* Search Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <FaFilter />
                  <span>Filtros</span>
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <select
                    value={mesFilter}
                    onChange={(e) => setMesFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los meses</option>
                    {meses.map(mes => (
                      <option key={mes.value} value={mes.value}>{mes.label}</option>
                    ))}
                  </select>

                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los años</option>
                    {Array.from({ length: 5 }, (_, i) => getCurrentYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Empresas Table */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                    Empresas Encontradas
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando 5 de {totalEmpresas}
                  </span>
                </div>
                
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredEmpresas.map((empresa) => (
                        <tr key={empresa._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{empresa.nombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{empresa.tipo}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(empresa.fechaRegistro || empresa.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalEmpresas > 5 && (
                  <div className="mt-4 text-center">
                    <Link 
                      to="/empresas"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Ver más empresas
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* Cursos Table - Similar structure */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                    Cursos Encontrados
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando 5 de {totalCursos}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Modalidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredCursos.map((curso) => (
                        <tr key={curso._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{curso.nombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{curso.modalidad}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(curso.fechaRegistro || curso.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalCursos > 5 && (
                  <div className="mt-4 text-center">
                    <Link 
                      to="/cursos" 
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver más cursos
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* Participantes Table - Similar structure */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                    Participantes Encontrados
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando 5 de {totalParticipantes}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Empresa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredParticipantes.map((participante) => (
                        <tr key={participante._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{participante.nombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{participante.empresaProdecendia}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(participante.fechaRegistro || participante.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalParticipantes > 5 && (
                  <div className="mt-4 text-center">
                    <Link 
                      to="/participantes" 
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver más participantes
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full mt-12 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700 pt-6">
        <p>
          Desarrollado por{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            SETUED
          </span>{" "}
          | © 2025 Todos los derechos reservados
        </p>
      </footer>
    </>
  );
};

export default Inicio;
