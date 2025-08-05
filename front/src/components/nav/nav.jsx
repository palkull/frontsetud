// import './nav.css';
import { Link } from "react-router-dom";
import Logo from "../../assets/SETUED.svg";
import { FaCog } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function Nav() {
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { logout } = useAuth();
  const configMenuRef = useRef();

  // Cierra solo el menú de configuración si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (configMenuRef.current && !configMenuRef.current.contains(event.target)) {
        setShowConfigMenu(false);
      }
    }
    if (showConfigMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfigMenu]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo o marca */}
          <div className="flex-shrink-0 text-xl font-bold text-gray-800 dark:text-white">
            <Link to="/inicio"><img className="w-50" src={Logo} alt="Logo" /></Link>
          </div>

          {/* Menú de navegación */}
          <div className="hidden md:flex space-x-4 items-center relative">
            <Link className="font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700" to="/inicio">Inicio</Link>
            <Link className="font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700" to="/cursos">Cursos</Link>
            <Link className="font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700" to="/usuarios">Usuarios</Link>
            <Link className="font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700" to="/participantes">Participantes</Link>

            <button
              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              onClick={() => setShowConfigMenu((v) => !v)}
              title="Configuración"
            >
              <FaCog className="text-xl" />
            </button>
            {showConfigMenu && (
              <div
                ref={configMenuRef}
                className="absolute right-0 top-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 w-40 z-50"
              >
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 font-semibold"
                  onClick={() => {
                    logout();
                    setShowConfigMenu(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Botón de menú hamburguesa para móviles */}
          <div className="md:hidden">
            <button
              className="text-gray-800 dark:text-white focus:outline-none"
              onClick={() => setShowMobileMenu((v) => !v)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable en dispositivos móviles */}
      {showMobileMenu && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 grid grid-rows-3 relative" id="mobile-menu">
          <Link className="p-1 font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700 text-center" to="/">Home</Link>
          <Link className="p-1 font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700 text-center" to="/features">Mi cuenta</Link>
          <Link className="p-1 font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700 text-center" to="/pricing">Documentos</Link>
          <button
            className="p-1 font-bold text-blue-500 hover:text-blue-700 text-center flex justify-center items-center"
            onClick={() => setShowConfigMenu((v) => !v)}
          >
            <FaCog className="text-xl" />
          </button>
          {showConfigMenu && (
            <div
              ref={configMenuRef}
              className="absolute right-4 top-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 w-40 z-50"
            >
              <button
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 font-semibold"
                onClick={() => {
                  logout();
                  setShowConfigMenu(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Nav;
