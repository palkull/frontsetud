import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function AddUsers() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { register: createUser, error } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createUser(data);
      toast.success("¡Usuario registrado correctamente!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset();
      setTimeout(() => navigate("/usuarios"), 2100);
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      toast.error("Error al registrar usuario", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
      <button
        type="button"
        onClick={() => navigate("/usuarios")}
        className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm">Regresar</span>
      </button>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center">Registrar Usuario</h1>
        {error && error.length > 0 && (
          <div className="bg-red-500/90 text-white p-2 mb-4 rounded shadow">
            {error.map((err, i) => <div key={i}>{typeof err === "object" ? err.message : err}</div>)}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("correo", { required: "El correo es obligatorio" })}
              />
              {errors.correo && <span className="text-red-500 text-xs">{errors.correo.message}</span>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Puesto"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("puesto", { required: "El puesto es obligatorio" })}
              />
              {errors.puesto && <span className="text-red-500 text-xs">{errors.puesto.message}</span>}
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("rol", { required: "El rol es obligatorio" })}
              >
                <option value="">Selecciona el rol</option>
                <option value={true}>Administrador</option>
                <option value={false}>Usuario</option>
              </select>
              {errors.rol && <span className="text-red-500 text-xs">{errors.rol.message}</span>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Teléfono"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("telefono", { required: "El teléfono es obligatorio" })}
              />
              {errors.telefono && <span className="text-red-500 text-xs">{errors.telefono.message}</span>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("password", { required: "La contraseña es obligatoria" })}
              />
              {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
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

export default AddUsers;