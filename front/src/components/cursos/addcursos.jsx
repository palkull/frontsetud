import { useForm } from "react-hook-form";
import { useCurso } from "../../context/CursoContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function AddCursos() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { addCurso } = useCurso();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await addCurso(data);
            toast.success("¡Curso registrado correctamente!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            reset();
            setTimeout(() => navigate("/cursos"), 2100);
        } catch (error) {
            toast.error("Hubo un error al registrar el curso.", error);
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
            <button
                type="button"
                onClick={() => navigate("/cursos")}
                className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
            >
                <FaArrowLeft className="text-lg" />
                <span className="font-medium text-sm">Regresar</span>
            </button>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
                <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center">Registrar Curso</h1>
                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Datos generales */}
                    <div>
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Datos generales</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nombre del curso"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("nombre", { required: "El nombre del curso es obligatorio" })}
                                />
                                {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
                            </div>
                            <div>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("tipo", { required: "El tipo del curso es obligatorio" })}
                                >
                                    <option value="">Tipo de curso</option>
                                    <option value="curso">Curso</option>
                                    <option value="evaluacion">Evaluación</option>
                                    <option value="certificacion">Certificación</option>
                                    <option value="diplomado">Diplomado</option>
                                    <option value="distintivo">Distintivo</option>
                                    <option value="seminario">Seminario</option>
                                </select>
                                {errors.tipo && <span className="text-red-500 text-xs">{errors.tipo.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="date"
                                    placeholder="Fecha de inicio"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("fechaInicio", { required: "La fecha de inicio es obligatoria" })}
                                />
                                {errors.fechaInicio && <span className="text-red-500 text-xs">{errors.fechaInicio.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="date"
                                    placeholder="Fecha de fin"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("fechaFin", { required: "La fecha de fin es obligatoria" })}
                                />
                                {errors.fechaFin && <span className="text-red-500 text-xs">{errors.fechaFin.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Horario"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("horario", { required: "El horario es obligatorio" })}
                                />
                                {errors.horario && <span className="text-red-500 text-xs">{errors.horario.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Duración (horas)"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("duracion", { required: "La duración es obligatoria" })}
                                />
                                {errors.duracion && <span className="text-red-500 text-xs">{errors.duracion.message}</span>}
                            </div>
                            <div>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("modalidad", { required: "La modalidad es obligatoria" })}
                                >
                                    <option value="">Modalidad</option>
                                    <option value="presencial">Presencial</option>
                                    <option value="online">Online</option>
                                    <option value="hibrido">Híbrido</option>
                                </select>
                                {errors.modalidad && <span className="text-red-500 text-xs">{errors.modalidad.message}</span>}
                            </div>
                        </div>
                    </div>
                    {/* Instructor y objetivos */}
                    <div>
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Instructor y objetivos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Instructor"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("instructor", { required: "El instructor es obligatorio" })}
                                />
                                {errors.instructor && <span className="text-red-500 text-xs">{errors.instructor.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Perfil del instructor"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("perfilInstructor", { required: "El perfil del instructor es obligatorio" })}
                                />
                                {errors.perfilInstructor && <span className="text-red-500 text-xs">{errors.perfilInstructor.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Objetivos"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("objetivos", { required: "Los objetivos son obligatorios" })}
                                />
                                {errors.objetivos && <span className="text-red-500 text-xs">{errors.objetivos.message}</span>}
                            </div>
                        </div>
                    </div>
                    {/* Participantes y cupos */}
                    <div>
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Participantes y cupos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Perfil del participante"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("perfilParticipante", { required: "El perfil del participante es obligatorio" })}
                                />
                                {errors.perfilParticipante && <span className="text-red-500 text-xs">{errors.perfilParticipante.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Cupo mínimo"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("cupoMinimo", { required: "El cupo mínimo es obligatorio" })}
                                />
                                {errors.cupoMinimo && <span className="text-red-500 text-xs">{errors.cupoMinimo.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Cupo máximo"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("cupoMaximo", { required: "El cupo máximo es obligatorio" })}
                                />
                                {errors.cupoMaximo && <span className="text-red-500 text-xs">{errors.cupoMaximo.message}</span>}
                            </div>
                        </div>
                    </div>
                    {/* Costos y temario */}
                    <div>
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Costos y temario</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="number"
                                    placeholder="Costo"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("costo", { required: "El costo es obligatorio" })}
                                />
                                {errors.costo && <span className="text-red-500 text-xs">{errors.costo.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Costo general"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("costoGeneral", { required: "El costo general es obligatorio" })}
                                />
                                {errors.costoGeneral && <span className="text-red-500 text-xs">{errors.costoGeneral.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Temario general"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("temario", { required: "El temario es obligatorio" })}
                                />
                                {errors.temario && <span className="text-red-500 text-xs">{errors.temario.message}</span>}
                            </div>
                        </div>
                    </div>
                    {/* Proceso y contacto */}
                    <div>
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Proceso y contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Proceso de inscripción"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("procesoInscripcion", { required: "El proceso de inscripción es obligatorio" })}
                                />
                                {errors.procesoInscripcion && <span className="text-red-500 text-xs">{errors.procesoInscripcion.message}</span>}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Correo"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    {...register("correo", { required: "El correo es obligatorio" })}
                                />
                                {errors.correo && <span className="text-red-500 text-xs">{errors.correo.message}</span>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow transition duration-300 focus:outline-none mt-4"
                        >
                            Registrar
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default AddCursos;