import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useParticipantes } from "../../context/ParticipantesContext";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaIdCard, FaBookOpen, FaCalendarCheck, FaFilePdf, FaUpload, FaDownload, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

// Componente principal para ver el detalle de un participante
function VerParticipante() {
  const { id } = useParams();
  const { getParticipante, subirCertificado } = useParticipantes();
  const [participante, setParticipante] = useState({
    certificados: [] // Initialize with empty array
  });
  const [loading, setLoading] = useState(true);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tipo, setTipo] = useState('otro');
  const [descripcion, setDescripcion] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  console.log("ID recibido:", id);

  // Función para cargar los datos del participante
  const loadParticipanteData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getParticipante(id);
      console.log("Datos del participante cargados:", data); // Para debug
      
      // Normalizar la estructura de certificados
      let certificados = [];
      if (data.certificados && Array.isArray(data.certificados)) {
        certificados = data.certificados;
      } else if (data.certificado) {
        // Si viene como objeto singular, lo convertimos a array
        certificados = [data.certificado];
      }
      
      setParticipante({
        ...data,
        certificados: certificados
      });
    } catch (error) {
      console.error("Error al cargar participante:", error);
    } finally {
      setLoading(false);
    }
  }, [id, getParticipante]);

  // useEffect para llamar la carga de datos cuando el componente se monta
  useEffect(() => {
    loadParticipanteData();
  }, [loadParticipanteData]);

  // Función para manejar la selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      // Validar tamaño (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo PDF no puede ser mayor a 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Función para subir el certificado
  const handleUploadCertificate = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo PDF');
      return;
    }

    if (!tipo) {
      alert('Por favor selecciona un tipo de certificado');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('El archivo no puede ser mayor a 10MB');
      return;
    }

    try {
      setUploadingCertificate(true);
      
      const formData = new FormData();
      formData.append('certificado', selectedFile);
      formData.append('tipo', tipo);
      formData.append('descripcion', descripcion);

      await subirCertificado(id, formData);
      
      // Limpiar el formulario
      setSelectedFile(null);
      setTipo('otro');
      setDescripcion('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Recargar los datos del participante
      await loadParticipanteData();

      alert('Certificado subido correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al subir el certificado');
    } finally {
      setUploadingCertificate(false);
    }
  };

  // Función para descargar certificado
  const handleDownloadCertificate = (certificado) => {
    if (certificado.url) {
      window.open(certificado.url, '_blank');
    } else {
      alert('URL del certificado no disponible');
    }
  };

  // Función para cancelar la selección de archivo
  const handleCancelFileSelection = () => {
    setSelectedFile(null);
    setTipo('otro');
    setDescripcion('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Renderiza un estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">Cargando participante...</h2>
        </div>
      </div>
    );
  }

  // Renderiza un mensaje de error si el participante no se encuentra
  if (!participante) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Participante no encontrado</h2>
          <button
            type="button"
            onClick={() => navigate("/participantes")}
            className="flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition mx-auto"
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium text-sm">Regresar a Estudiantes</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Botón Regresar */}
        <button
          onClick={() => navigate("/participantes")}
          className="mb-6 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FaArrowLeft />
          <span>Regresar a Participantes</span>
        </button>

        {/* Card Principal */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          {/* Header con nombre */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-900 dark:to-blue-800">
            <h1 className="text-2xl font-bold text-white">{participante.nombre}</h1>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-8">
            {/* Información Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info icon={<FaUser />} label="Sexo" value={participante.sexo} />
              <Info icon={<FaEnvelope />} label="Correo" value={participante.correo} />
              <Info icon={<FaPhone />} label="Teléfono" value={participante.telefono} />
              <Info icon={<FaIdCard />} label="CURP" value={participante.curp} />
              <Info icon={<FaUser />} label="Edad" value={`${participante.edad} años`} />
              <Info icon={<FaBuilding />} label="Empresa" value={participante.empresaProdecendia} />
              <Info icon={<FaBriefcase />} label="Puesto" value={participante.puesto} />
            </div>

            {/* Cursos Inscritos */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">
                Cursos Inscritos
              </h2>
              <div className="space-y-4">
                {participante?.cursos_inscritos?.length > 0 ? (
                  participante.cursos_inscritos.map((inscripcion, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                        {inscripcion.curso?.nombre || 'Nombre no disponible'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-600 dark:text-gray-400">
                            Estado: <span className="font-medium">{inscripcion.estado}</span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Fecha: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600 dark:text-gray-400">
                            Modalidad: <span className="font-medium">{inscripcion.curso?.modalidad}</span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Instructor: <span className="font-medium">{inscripcion.curso?.instructor}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No hay cursos inscritos</p>
                )}
              </div>
            </div>

            {/* Certificados */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">
                Certificados ({participante?.certificados?.length || 0})
              </h2>

              {/* Lista de certificados existentes */}
              {participante?.certificados?.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {participante.certificados.map((certificado, index) => (
                    <div 
                      key={index}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-2xl text-red-600" />
                        <div className="flex-grow">
                          <p className="font-medium text-green-800 dark:text-green-200">
                            {certificado.nombre_archivo}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                            <p className="text-green-600 dark:text-green-400">
                              Tipo: {certificado.tipo || 'No especificado'}
                            </p>
                            <p className="text-green-600 dark:text-green-400">
                              Subido el: {new Date(certificado.fecha_subida).toLocaleDateString()}
                            </p>
                            {certificado.descripcion && (
                              <p className="text-green-600 dark:text-green-400 w-full mt-1">
                                {certificado.descripcion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <FaFilePdf className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Este participante no tiene certificados subidos
                    </p>
                  </div>
                </div>
              )}

              {/* Botón para subir nuevo certificado */}
              <div className="mt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf"
                  className="hidden"
                />
                {!selectedFile && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <FaFilePdf />
                    Subir Nuevo Certificado
                  </button>
                )}
              </div>

              {/* Formulario de subida cuando hay archivo seleccionado */}
              {selectedFile && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaFilePdf className="text-red-600" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tipo de certificado *
                        </label>
                        <select
                          value={tipo}
                          onChange={(e) => setTipo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                          required
                        >
                          <option value="">Selecciona un tipo</option>
                          <option value="constancia">Constancia</option>
                          <option value="diploma">Diploma</option>
                          <option value="certificacion">Certificación</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Descripción (opcional)
                        </label>
                        <input
                          type="text"
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                          placeholder="Añade una descripción..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleUploadCertificate}
                        disabled={uploadingCertificate || !tipo}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition"
                      >
                        {uploadingCertificate ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <FaUpload />
                            Subir
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelFileSelection}
                        disabled={uploadingCertificate}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                      >
                        <FaTrash />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente reutilizable para mostrar información
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

export default VerParticipante;