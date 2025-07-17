import { Link } from "react-router";
import Nav from "../../components/nav/nav";



function Inicio() {
   return (
      <>
         <Nav />
         <h1 className="text-2xl font-bold ">Inicio Page</h1>
         <p>Welcome to the inicio page!</p>
         <div className="grid grid-cols-3 gap-4 h-screen mt-10 pr-10 pl-10">
            <Link to={"/estudiantes"} className="bg-gray-200 p-4 rounded h-3/4 hover:text-black-600 hover:bg-gray-300 hover:animate-[] cursor-pointer">
               <h2 className="text-lg font-semibold">Estudiantes Distintivos</h2>
               <p className="text-sm text-gray-600">Registra a los estudiantes extraordinarios</p>

            </Link>

            <Link to={"/usuarios"} className="bg-gray-200 p-4 rounded h-3/4 hover:text-black-600 hover:bg-gray-300 cursor-pointer">
               <h2 className="text-lg font-semibold">Usuarios</h2>
               <p className="text-sm text-gray-600">Gestiona a los usuarios aquí.</p>
            </Link>
            <Link to={"/cursos"} className="bg-gray-200 p-4 rounded h-3/4 hover:text-black-600 hover:bg-gray-300 cursor-pointer">
               <h2 className="text-lg font-semibold">Cursos</h2>
               <p className="text-sm text-gray-600">Explora y gestiona cursos.</p>
            </Link>
         </div>
         <footer className="text-center text-sm text-gray-500 mt-4">2022 KeepCoding</footer>
         <div className="text-center mt-4">
            <p>Powered by React Router</p>
         </div>
      </>
   );
}
export default Inicio;


// This component can be used as a landing page or dashboard for your application.  You can add widgets, charts, or other components to provide an overview of the application's status.
