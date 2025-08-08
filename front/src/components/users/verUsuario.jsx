import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaShieldAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"; // Asegúrate que aquí esté la función getUserById

function VerUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById } = useAuth(); // Función para obtener un usuario por ID
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsuario = useCallback(async () => {
    try {
      const data = await getUserById(id);
      setUsuario(data);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, [id, getUserById]);

  useEffect(() => {
    loadUsuario();
  }, [loadUsuario]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-blue-600 dark:text-white text-xl font-bold">Cargando usuario...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Usuario no encontrado</h2>
          <button
            onClick={() => navigate("/usuarios")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            <FaArrowLeft className="inline mr-2" /> Regresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-3xl">
        <button
          onClick={() => navigate("/usuarios")}
          className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FaArrowLeft />
          Regresar a Usuarios
        </button>

        <div className="flex items-center gap-4 mb-6">
          <FaUser className="text-4xl text-blue-700 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{usuario.nombre}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info icon={<FaEnvelope />} label="Correo" value={usuario.correo} />
          <Info icon={<FaPhone />} label="Teléfono" value={usuario.telefono} />
          <Info icon={<FaBriefcase />} label="Puesto" value={usuario.puesto} />
          <Info
            icon={<FaShieldAlt />}
            label="Rol"
            value={usuario.rol ? "Administrador" : "Usuario"}
          />
          <Info
            icon={usuario.status ? <FaCheckCircle /> : <FaTimesCircle />}
            label="Estado"
            value={usuario.status ? "Activo" : "Inactivo"}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-blue-500 dark:text-blue-300 mt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</span>
        <span className="text-base text-gray-800 dark:text-gray-100">
          {value || <span className="italic text-gray-400 dark:text-gray-500">Sin información</span>}
        </span>
      </div>
    </div>
  );
}

export default VerUsuario;
