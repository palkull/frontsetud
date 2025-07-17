import { Link } from "react-router";

export default function ListaEstudiantes() {
  return (
    <>
      <div>
        <Link
          to={"/estudiantes/buscar"}
          className="text-blue-800 hover:text-blue-400 block p-4 bg-white dark:bg-gray-800 rounded shadow mb-1 hover:scale-105 transition-transform duration-200"
        >
          Gael Emmanuel Valles Ñañes
          {/* Aquí puedes mostrar la lista de estudiantes */}
        </Link>
        <Link
          to={"/estudiantes/buscar"}
          className="text-blue-800 hover:text-blue-400 block p-4 bg-white dark:bg-gray-800 rounded shadow mb-1 hover:scale-105 transition-transform duration-200"
        >
          Angel Alexis Gallegos Bañales
          {/* Aquí puedes mostrar la lista de estudiantes */}
        </Link>
        <Link
          to={"/estudiantes/buscar"}
          className="text-blue-800 block p-4 bg-white dark:bg-gray-800 rounded shadow mb-1 hover:text-blue-400 hover:scale-105 transition-transform duration-200"
        >
          Lista de Estudiantes
          {/* Aquí puedes mostrar la lista de estudiantes */}
        </Link>
      </div>
    </>
  );
}
