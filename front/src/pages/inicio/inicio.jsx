import { Link } from "react-router-dom";
import Nav from "../../components/nav/nav";
import { useAuth } from "../../context/AuthContext";
import {
  FaUserGraduate,
  FaUsers,
  FaBookOpen,
  FaBuilding,
} from "react-icons/fa";

const Inicio = () => {
  const { admin } = useAuth();
  console.log("Inicio:", { admin });

  return (
    <>
      <Nav />

      <main className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-10 bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 transition-all duration-300">
        <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-5xl w-full p-10 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center tracking-tight">
            Bienvenido de vuelta
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
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
                  Estudiantes Distintivos
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 text-center">
                  Registra a los estudiantes extraordinarios.
                </p>
              </div>
            </Link>

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
        </section>

        <footer className="w-full mt-12 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700 pt-6">
          <p>
            Desarrollado por{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              SETUED
            </span>{" "}
            | © 2025 Todos los derechos reservados
          </p>
        </footer>
      </main>
    </>
  );
};

export default Inicio;
