import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useParticipantes } from "../../context/ParticipantesContext";
import { useEffect, useState } from "react";
import { useEmpresas } from "../../context/EmpresasContext";

function AddToParticipantes() {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Cambiado: Obtenemos el parámetro como 'id'
  const empresaId = id; // Asignamos a empresaId
  const { createParticipante, error } = useParticipantes();
  const { getEmpresa } = useEmpresas();
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);

  console.log("ID de la empresa:", id);
  // Buscar la empresa por ID y obtener su nombre
  useEffect(() => {
    const fetchEmpresa = async () => {
      if (empresaId) {
        try {
          setLoadingEmpresa(true);
          const empresa = await getEmpresa(empresaId);
          setEmpresaNombre(empresa.nombre);
          console.log("llegó la empresa:", empresa.nombre);
          // Autocompletar el campo en el formulario
          setValue("empresaProdecendia", empresa.nombre);
        } catch (error) {
          console.error("Error al obtener la empresa:", error);
          toast.error("Error al obtener datos de la empresa", {
            position: "top-center",
            autoClose: 3000,
          });
        } finally {
          setLoadingEmpresa(false);
        }
      }
    };

    fetchEmpresa();
  }, [empresaId, getEmpresa, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Convertir edad a número y agregar empresaId
      const Data = {
        ...data,
        edad: parseInt(data.edad, 10),
        ...(empresaId && { empresa_id: empresaId })
      };
      
      await createParticipante(Data);
      toast.success("¡Participante registrado correctamente!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset();
      
      // Redirigir a la página de la empresa
      setTimeout(() => {
        navigate(`/empresas`);
      }, 2100);
    } catch (err) {
      console.error("Error al registrar participante:", err);
      toast.error("Error al registrar participante", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
      <button
        type="button"
        onClick={() => navigate(`/empresas`)}
        className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm">Regresar</span>
      </button>
      
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center">Registrar Participante</h1>
        
        {/* Mensaje de asociación a empresa */}
        {empresaId && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-center">
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              Este participante se asociará automáticamente a la empresa: 
              {loadingEmpresa ? (
                <span className="ml-2 animate-pulse">Cargando...</span>
              ) : (
                <strong className="ml-2">{empresaNombre}</strong>
              )}
            </p>
          </div>
        )}
        
        {error && error.length > 0 && (
          <div className="bg-red-500/90 text-white p-2 mb-4 rounded shadow">
            {error.map((err, i) => <div key={i}>{typeof err === "object" ? err.message : err}</div>)}
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                type="text"
                placeholder="Empresa de procedencia"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("empresaProdecendia", { 
                  required: "La empresa de procedencia es obligatoria",
                  disabled: loadingEmpresa
                })}
              />
              {errors.empresaProdecendia && <span className="text-red-500 text-xs">{errors.empresaProdecendia.message}</span>}
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
              <input
                type="number"
                placeholder="Edad"
                min="16"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("edad", { 
                  required: "La edad es obligatoria",
                  min: { value: 16, message: "La edad mínima es 16 años" },
                  max: { value: 100, message: "La edad máxima es 100 años" }
                })}
              />
              {errors.edad && <span className="text-red-500 text-xs">{errors.edad.message}</span>}
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("correo", { 
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Formato de correo inválido"
                  }
                })}
              />
              {errors.correo && <span className="text-red-500 text-xs">{errors.correo.message}</span>}
            </div>
            
            <div>
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("telefono", { 
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "El teléfono debe tener 10 dígitos"
                  }
                })}
              />
              {errors.telefono && <span className="text-red-500 text-xs">{errors.telefono.message}</span>}
            </div>
          </div>
          
          <div className="w-full">
            <input
              type="text"
              placeholder="CURP (18 caracteres)"
              maxLength="18"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 uppercase"
              {...register("curp", { 
                required: "La CURP es obligatoria",
                minLength: { value: 18, message: "La CURP debe tener 18 caracteres" },
                maxLength: { value: 18, message: "La CURP debe tener 18 caracteres" },
              })}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
            {errors.curp && <span className="text-red-500 text-xs">{errors.curp.message}</span>}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loadingEmpresa}
              className={`w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow transition duration-300 focus:outline-none mt-4 ${
                loadingEmpresa ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loadingEmpresa ? 'Cargando...' : 'Registrar Participante'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AddToParticipantes;