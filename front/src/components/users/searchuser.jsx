import { useState } from 'react';

function Search() {
   const [firstName, setFirstName] = useState('');
   const [showError, setShowError] = useState(false);
     const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

   const handleSubmit = (e) => {
      e.preventDefault();


      if (firstName.trim() === '') {
         setShowError(true);
      } else {
         setShowError(false);
         // Aquí puedes enviar los datos si todo está bien

         const confirmDelete = window.confirm(
      `¿Estás seguro de que los datos del usuario \n\nNombre: ${fullName}\nCorreo: ${email} son correctos`
    );

    if (confirmDelete) {
      alert('Usuario actualizado correctamente');
      console.log('Usuario actualizado:', fullName, email);
      // Aquí podrías hacer una llamada a la API para eliminarlo realmente
    }
         console.log('Formulario válido');
      }

      
   };

   return (
      <>
         <h1 className='text-2xl font-bold'>Datos del Usuario</h1>
         <p className='text-gray-600'>Por favor, asegurese que los datos son los correctos.</p>
         <form className="w-full max-w-lg" onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-3 mb-6">
               <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     htmlFor="grid-first-name"
                  >
                     First Name
                  </label>
                  <input
                     className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${showError ? 'border-red-500' : 'border-gray-200'
                        } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                     id="grid-first-name"
                     type="text"
                     placeholder="Jane"
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                  />
                  {showError && (
                     <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                  )}
               </div>

               <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     htmlFor="grid-last-name-paterno"
                  >
                     Apellido Paterno
                  </label>
                  <input
                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                     id="grid-last-name-paterno"
                     type="text"
                     placeholder="García"
                  />
               </div>

               <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     htmlFor="grid-last-name-materno"
                  >
                     Apellido Materno
                  </label>
                  <input
                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                     id="grid-last-name-materno"
                     type="text"
                     placeholder="López"
                  />
               </div>

               <div className="w-full px-3 mb-6">
                  <label
                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     htmlFor="grid-email"
                  >
                     Correo Electrónico
                  </label>
                  <input
                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                     id="grid-email"
                     type="email"
                     placeholder="correo@ejemplo.com"
                  />
               </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
               <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                     Password
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" />
                  <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
               </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-2">
               <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                     City
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque" />
               </div>
               <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                     State
                  </label>
                  <div className="relative">
                     <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                        <option>New Mexico</option>
                        <option>Missouri</option>
                        <option>Texas</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                     </div>
                  </div>
               </div>
               <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                     Zip
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210" />
               </div>
            </div>

            <div className="mt-4 px-3">
               <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
               >
                  Submit
               </button>
            </div>
         </form>
      </>
   );
}

export default Search;
