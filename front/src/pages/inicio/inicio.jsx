import { Link } from "react-router-dom";
import Nav from "../../components/nav/nav";
import { useAuth } from "../../context/AuthContext";
import { FaUserGraduate, FaUsers, FaBookOpen } from "react-icons/fa";

function Inicio() {
  const { admin } = useAuth();
  console.log('Inicio:', { admin });

  return (
    <>
      <Nav />
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-300">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-5xl w-full p-10 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 text-center tracking-tight">Bienvenido de vuelta.</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <Link
              to="/estudiantes"
              className="group bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <FaUserGraduate className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Estudiantes Distintivos</h2>
              <p className="text-base text-gray-600 dark:text-gray-400 text-center">Registra a los estudiantes extraordinarios.</p>
            </Link>
            <Link
              to="/usuarios"
              className="group bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <FaUsers className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Usuarios</h2>
              <p className="text-base text-gray-600 dark:text-gray-400 text-center">Gestiona a los usuarios aquí.</p>
            </Link>
            <Link
              to="/cursos"
              className="group bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <FaBookOpen className="text-4xl text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Cursos</h2>
              <p className="text-base text-gray-600 dark:text-gray-400 text-center">Explora y gestiona cursos.</p>
            </Link>
          </div>
        </div>
        <footer className="text-center text-sm text-gray-500 mt-8">
         <span className="text-blue-500 dark:text-blue-400">SETUED 2025</span>
        </footer>
      </main>
    </>
  );
}

export default Inicio;


// This component can be used as a landing page or dashboard for your application.  You can add widgets, charts, or other components to provide an overview of the application's status.
