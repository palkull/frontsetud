import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEmpresas } from "../../context/EmpresasContext";

// Listas de opciones para los select (tomadas de tu modelo)
const TIPOS_EMPRESA = [
  "Hoteles con otros servicios integrados",
  "Hoteles sin otros servicios integrados",
  "Moteles",
  "Cabañas, villas y similares",
  "Campamentos y albergues recreativos",
  "Pensiones y casas de huéspedes",
  "Departamentos y casas amueblados con servicios de hotelería",
  "Agencias de viajes",
  "Organización de excursiones y paquetes turísticos para agencias de viajes",
  "Otros servicios de reservaciones",
  "Parques acuáticos y balnearios",
  "Alquiler de automóviles sin chofer",
  "Campos de golf",
  "Marinas turísticas",
  "Administración de puertos y muelles",
  "Transporte turístico por tierra",
  "Transporte turístico por agua",
  "Otro transporte turístico",
  "Comercio al por menor en tiendas de artesanías",
  "Otros servicios recreativos prestados por el sector privado",
  "Centros nocturnos, discotecas y similares",
  "Escuelas del sector privado que combinan diversos niveles de educación",
  "Escuelas del sector público que combinan diversos niveles de educación",
  "Bares, cantinas y similares",
  "Restaurantes con servicio de preparación de alimentos a la carta o de comida corrida",
  "Restaurantes con servicio de preparación de pescados y mariscos",
  "Restaurantes con servicio de preparación de antojitos",
  "Restaurantes con servicio de preparación de tacos y tortas",
  "Restaurantes de autoservicio",
  "Restaurantes con servicio de preparación de pizzas, hamburguesas, hot dogs y pollos rostizados para llevar",
  "Guía de Turistas",
  "Módulos de auxilio turístico",
  "Restaurantes que preparan otro tipo de alimentos para llevar",
  "Cafeterías, fuentes de sodas, neverías, refresquerías y similares",
  "Servicios de preparación de otros alimentos para consumo inmediato"
];

const MUNICIPIOS = [
  "Canatlán", "Canelas", "Coneto de Comonfort", "Cuencamé", "Durango",
  "General Simón Bolívar", "Gómez Palacio", "Guadalupe Victoria", "Guanaceví",
  "Hidalgo", "Indé", "Lerdo", "Mapimí", "Mezquital", "Nazas", "Nombre de Dios",
  "Ocampo", "El Oro", "Otáez", "Pánuco de Coronado", "Peñón Blanco", "Poanas",
  "Pueblo Nuevo", "Rodeo", "San Bernardo", "San Dimas", "San Juan de Guadalupe",
  "San Juan del Río", "San Luis del Cordero", "San Pedro del Gallo", "Santa Clara",
  "Santiago Papasquiaro", "Súchil", "Tamazula", "Tepehuanes", "Tlahualilo", "Top",
  "Vicente Guerrero", "Nuevo Ideal"
];

function AddEmpresas() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { createEmpresa, error } = useEmpresas();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Preparar los datos de contacto
      const contactoData = {
        nombre: data.contacto_nombre || null,
        puesto: data.contacto_puesto || null,
        telefono: data.contacto_telefono || null,
        correo: data.contacto_correo || null
      };

      // Estructurar los datos según el modelo
      const empresaData = {
        nombre: data.nombre,
        tipo: data.tipo,
        rfc: data.rfc.toUpperCase(), // Convertir a mayúsculas
        telefono: data.telefono || null,
        correo: data.correo || null,
        direccion: data.direccion,
        municipio: data.municipio,
        contacto: contactoData,
        estado: 'activa' // Valor por defecto
      };

      await createEmpresa(empresaData);
      toast.success("¡Empresa registrada correctamente!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset();
      setTimeout(() => navigate("/empresas"), 2100);
    } catch (err) {
      console.error("Error al registrar empresa:", err);
      toast.error("Error al registrar empresa", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
      <button
        type="button"
        onClick={() => navigate("/empresas")}
        className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm">Regresar</span>
      </button>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center">Registrar Nueva Empresa</h1>
        {error && error.length > 0 && (
          <div className="bg-red-500/90 text-white p-2 mb-4 rounded shadow">
            {error.map((err, i) => <div key={i}>{typeof err === "object" ? err.message : err}</div>)}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre de la empresa */}
            <div>
              <input
                type="text"
                placeholder="Nombre de la empresa *"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
            </div>
            
            {/* Tipo de empresa */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("tipo", { required: "El tipo es obligatorio" })}
              >
                <option value="">Selecciona un tipo *</option>
                {TIPOS_EMPRESA.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipo && <span className="text-red-500 text-xs">{errors.tipo.message}</span>}
            </div>
            
            {/* RFC */}
            <div>
              <input
                type="text"
                placeholder="RFC *"
                maxLength="13"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 uppercase"
                {...register("rfc", { 
                  required: "El RFC es obligatorio",
                  pattern: {
                    value: /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/,
                    message: "Formato de RFC inválido"
                  }
                })}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              {errors.rfc && <span className="text-red-500 text-xs">{errors.rfc.message}</span>}
            </div>
            
            {/* Teléfono */}
            <div>
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("telefono", { 
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "El teléfono debe tener 10 dígitos"
                  }
                })}
              />
              {errors.telefono && <span className="text-red-500 text-xs">{errors.telefono.message}</span>}
            </div>
            
            {/* Correo */}
            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("correo", { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Formato de correo inválido"
                  }
                })}
              />
              {errors.correo && <span className="text-red-500 text-xs">{errors.correo.message}</span>}
            </div>
            
            {/* Dirección */}
            <div>
              <input
                type="text"
                placeholder="Dirección *"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("direccion", { required: "La dirección es obligatoria" })}
              />
              {errors.direccion && <span className="text-red-500 text-xs">{errors.direccion.message}</span>}
            </div>
            
            {/* Municipio */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                {...register("municipio", { required: "El municipio es obligatorio" })}
              >
                <option value="">Selecciona un municipio *</option>
                {MUNICIPIOS.map((municipio) => (
                  <option key={municipio} value={municipio}>{municipio}</option>
                ))}
              </select>
              {errors.municipio && <span className="text-red-500 text-xs">{errors.municipio.message}</span>}
            </div>
          </div>
          
          {/* Sección de contacto */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">Datos de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  placeholder="Nombre del contacto"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  {...register("contacto_nombre")}
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Puesto del contacto"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  {...register("contacto_puesto")}
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  placeholder="Teléfono del contacto"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  {...register("contacto_telefono", { 
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "El teléfono debe tener 10 dígitos"
                    }
                  })}
                />
                {errors.contacto_telefono && <span className="text-red-500 text-xs">{errors.contacto_telefono.message}</span>}
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Correo del contacto"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  {...register("contacto_correo", { 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de correo inválido"
                    }
                  })}
                />
                {errors.contacto_correo && <span className="text-red-500 text-xs">{errors.contacto_correo.message}</span>}
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow transition duration-300 focus:outline-none mt-4"
            >
              Registrar Empresa
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AddEmpresas;