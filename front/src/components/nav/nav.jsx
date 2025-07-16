// import './nav.css';
import { Link } from "react-router-dom"; // Asegúrate de usar 'react-router-dom' en lugar de 'react-router'
import Logo from "../../assets/SETUED.svg"; // Asegúrate de que la ruta al logo sea correcta

function Nav() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo o marca */}
          <div className="flex-shrink-0 text-xl font-bold text-gray-800 dark:text-white">
            <img className="w-50" src={Logo} alt="Logo" />
          </div>

          {/* Menú de navegación */}
          <div className="hidden md:flex space-x-4">
            <Link className="font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700" to="/inicio">Home</Link>
            <Link className="font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700" to="/features">Mi cuenta</Link>
            <Link className="font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700" to="/pricing">Documentos</Link>
          </div>

          {/* Botón de menú hamburguesa para móviles */}
          <div className="md:hidden">
            <button
              className="text-gray-800 dark:text-white focus:outline-none"
              onClick={() => {
                const menu = document.getElementById("mobile-menu");
                menu.classList.toggle("hidden");
              }}
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
      <div className="md:hidden hidden px-4 pt-2 pb-4 space-y-1 grid grid-rows-3 " id="mobile-menu">
        <Link className=" p-1 font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700 text-center" to="/">Home</Link>
        <Link className=" p-1 font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700 text-center" to="/features">Mi cuenta</Link>
        <Link className=" p-1 font-bold text-blue-500 hover:scale-110 transition-transform duration-200 hover:text-blue-700 text-center" to="/pricing">Documentos</Link>
      </div>
    </nav>
  );
}

export default Nav;
