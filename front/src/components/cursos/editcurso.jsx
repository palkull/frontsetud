import React from "react";

function EditCurso() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center">Actualizar Curso</h1>
        <form className="space-y-8">
          {/* Datos generales */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Datos generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Nombre del curso" className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Tipo de curso" className="w-full px-4 py-2 border rounded-lg" />
              <input type="date" placeholder="Fecha de inicio" className="w-full px-4 py-2 border rounded-lg" />
              <input type="date" placeholder="Fecha de fin" className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Horario" className="w-full px-4 py-2 border rounded-lg" />
              <input type="number" placeholder="Duración (horas)" className="w-full px-4 py-2 border rounded-lg" />
              <select className="w-full px-4 py-2 border rounded-lg">
                <option value="">Modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>
          {/* Instructor y objetivos */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Instructor y objetivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Instructor" className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Perfil del instructor" className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Objetivos" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          {/* Participantes y cupos */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Participantes y cupos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Perfil del participante" className="w-full px-4 py-2 border rounded-lg" />
              <input type="number" placeholder="Cupo mínimo" className="w-full px-4 py-2 border rounded-lg" />
              <input type="number" placeholder="Cupo máximo" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          {/* Costos y temario */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Costos y temario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="number" placeholder="Costo" className="w-full px-4 py-2 border rounded-lg" />
              <input type="number" placeholder="Costo general" className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Temario general" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          {/* Proceso y contacto */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Proceso y contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Proceso de inscripción" className="w-full px-4 py-2 border rounded-lg" />
              <input type="email" placeholder="Correo" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow transition duration-300 focus:outline-none mt-4"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCurso;