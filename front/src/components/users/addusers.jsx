import { useState } from 'react';

function Addusers() {
   const [firstName, setFirstName] = useState('');
   const [showError, setShowError] = useState(false);

   const handleSubmit = (e) => {
      e.preventDefault();

      if (firstName.trim() === '') {
         setShowError(true);
      } else {
         setShowError(false);
         // Aquí puedes enviar los datos si todo está bien
         console.log('Formulario válido');
      }
   };

   return (
      <>
         <h1 className='text-2xl font-bold'>Añadir Usuario</h1>
         <p className='text-gray-600'>Por favor, complete los detalles para añadir un nuevo usuario.</p>
         <form className="bg-white dark:bg-gray-800 p-6 rounded shadow-md" onSubmit={handleSubmit}>
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

               <div className="w-full px-3 mb-2">
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

export default Addusers;
// 