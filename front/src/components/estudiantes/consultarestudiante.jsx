import { useState } from "react";



export default function ConsultarUsuario() {
    // const [firstName, setFirstName] = useState('');
    //        const [showError, setShowError] = useState(false);
        
    //        const handleSubmit = (e) => {
    //           e.preventDefault();
        
    //           if (firstName.trim() === '') {
    //              setShowError(true);
    //           } else {
    //              setShowError(false);
    //              // Aquí puedes enviar los datos si todo está bien
    //              console.log('Formulario válido');
    //           }
    //        };
        return (
            <>
             <h1 className='text-2xl font-bold'>Usuario "Nombre"</h1>
             <p className='text-gray-600'>Edite los datos del usuario</p>
             <form className="w-full max-w-lg" onSubmit={"handleSubmit"}>
                <div className="flex flex-wrap -mx-3 mb-6">
                   <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                         className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                         htmlFor="grid-first-name"
                      >
                         Nombre
                      </label>
                      <input
                         className={`appearance-none block w-full bg-gray-200 text-gray-700 border 
                            } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                         id="grid-first-name"
                         type="text"
                         placeholder="Jane"
                         value="Gael Emmanuel"
                        //  onChange={(e) => setFirstName(e.target.value)}
                      />
                      {/* {showError && (
                         <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                      )} */}
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
                         value="Valles"
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
                         value="Ñañes"
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
                         value="gaelproxxx@gmail.com"
                      />
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