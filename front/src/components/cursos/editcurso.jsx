export default function Editcurso() {

    return    (
    <>
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Buscar cursos</h1>
                <form className="w-full max-w-auto mt-10" >
                    <div className="md:flex md:items-center mb-6 grid grid-cols-2 gap-4">
                        <div className="md:w-1/3 ">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Fecha inicio
                            </label>
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="date"

                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Fecha inicio"
                            />

                        </div>
                        <div className="md:w-1/3 align-items-center">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Fecha fin
                            </label>

                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="date"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Fecha fin"
                            />
                        </div>
                        <div className="md:w-1/3 md:items-center">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Horario
                            </label>
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Horario"
                            />
                        </div>
                    </div>

                    <div className="md:flex md:items-center mb-6 grid grid-cols-2 gap-4">
                        <div className="md:w-1/2">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Duracion (hrs)
                            </label>
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="number"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="hrs"
                            />
                        </div>

                        <div className="md:w-1/2">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Modalidad
                            </label>
                            <select
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                onChange={(e) => setCursoname(e.target.value)}
                            >
                                <option value="">Seleccione</option>
                                <option value="presencial">Presencial</option>
                                <option value="online">Online</option>
                                <option value="hibrido">Híbrido</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                htmlFor="inline-full-name"
                            >
                                Instructor
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Instructor"
                            />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                htmlFor="inline-full-name"
                            >
                                Perfil del Instructor
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Perfil del Instructor"
                            />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                htmlFor="inline-full-name"
                            >
                                Objetivos
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Objetivos"
                            />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                htmlFor="inline-full-name"
                            >
                                Perfil del participante
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Perfil del participante"
                            />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6  grid grid-cols-2 gap-4">
                        <div className="md:w-1/2">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Cupo minimo
                            </label>
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="ej: 2"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Cupo maximo
                            </label>

                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="ej: 50"
                            />
                        </div>
                    </div>


                    <div className="md:flex md:items-center mb-6 grid grid-cols-2 gap-4">
                        <div className="md:w-1/2">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Costo
                            </label>
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Costo"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 justify-self-center"
                                htmlFor="inline-full-name"
                            >
                                Costo general
                            </label>
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Costo general"
                            />
                        </div>
                    </div>

                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                htmlFor="inline-full-name"
                            >
                                Temario general
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Temario general"
                            />
                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/3">
                            <label
                                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                htmlFor="inline-full-name"
                            >
                                Proceso de inscripcion
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name"
                                type="text"
                                onChange={(e) => setCursoname(e.target.value)}
                                placeholder="Proceso de inscripcion"
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
                                onChange={(e) => setIdcurso(e.target.value)}
                                placeholder="ejemplo@email.com"
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
                                className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                type="submit"
                            >
                                Añadir Usuario
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>

    )
}