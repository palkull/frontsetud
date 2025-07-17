import { useState } from 'react';

function DeleteCursos() {
  const [cursoname, setCursoname] = useState('');
  const [idcurso, setIdcurso] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al curso?\n\nNombre: ${cursoname}\nID: ${idcurso}`
    );

    if (confirmDelete) {
      alert('Curso eliminado correctamente');
      console.log('Curso eliminado:', cursoname, idcurso);
      // Aquí podrías hacer una llamada a la API para eliminarlo realmente
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Borrar Usuario</h1>
      <form className="bg-white dark:bg-gray-800 p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Nombre Completo
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-full-name"
              type="text"
              value={cursoname}
              onChange={(e) => setCursoname(e.target.value)}
              placeholder="Nombre completo"
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-email"
            >
              Correo
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-email"
              type="text"
              value={idcurso}
              onChange={(e) => setIdcurso(e.target.value)}
              placeholder="ID del curso"
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3"></div>
          <label className="md:w-2/3 block text-gray-500 font-bold">
            <input className="mr-2 leading-tight" type="checkbox" />
            <span className="text-sm">Send me your newsletter!</span>
          </label>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Borrar Usuario
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default DeleteCursos;
