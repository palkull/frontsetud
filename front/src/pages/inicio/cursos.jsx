import { Link, Outlet } from "react-router";
import Nav from "../../components/nav/nav";


export default function Cursos() {
  return (
    <>
      <Nav />

      {/* Contenedor principal con grid: 1 columna en móvil, 4 columnas en md+ */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">

        {/* Sidebar: ocupa 1 de 4 columnas */}
        <aside className="md:col-span-1">
          <ul className="text-left font-medium text-lg leading-none divide-y divide-blue-200 border-blue-200">
            <li>
              <Link to="/cursos" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                Añadir Curso
              </Link>
            </li>
            <li>
              <Link to="delete" className="py-3.5 w-full flex items-start text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                <div>
                  Eliminar curso
                  <span className="font-normal text-gray-500 text-sm block"> (con confirmación)</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="consultar" className="py-3.5 w-full flex items-start text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                <div>
                  Consultar curso <span className="font-normal text-gray-500 text-sm block">(Java)</span>
                </div>
              </Link>
            </li>

          </ul>
        </aside>

        {/* Contenido principal: ocupa 3 de 4 columnas */}
        <section className="md:col-span-3">
          <main className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <Outlet />
          </main>
        </section>

      </div>
      <footer className="text-center text-sm text-gray-500 mt-4">2022 KeepCoding</footer>

    </>
  );
}