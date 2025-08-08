import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useParticipantes } from "../../context/ParticipantesContext";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaIdCard, FaBookOpen, FaCalendarCheck, FaFilePdf, FaUpload, FaDownload, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

// Componente principal para ver el detalle de un participante
function VerParticipante() {
  const { id } = useParams();
  const { getParticipante, subirCertificado } = useParticipantes();
  const [participante, setParticipante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  console.log("ID recibido:", id);

  // Función para cargar los datos del participante
  const loadParticipanteData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const participanteData = await getParticipante(id);
      setParticipante(participanteData);
    } catch (error) {
      console.error("Error cargando el participante:", error);
      setParticipante(null);
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

    try {
      setUploadingCertificate(true);
      const result = await subirCertificado(id, selectedFile);
      
      // Actualizar el estado local del participante
      setParticipante(prev => ({
        ...prev,
        certificado: result.certificado
      }));
      
      // Limpiar el archivo seleccionado
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      alert('Certificado subido correctamente');
    } catch (error) {
      console.error('Error subiendo certificado:', error);
      alert(error.message || 'Error al subir el certificado');
    } finally {
      setUploadingCertificate(false);
    }
  };

  // Función para descargar el certificado
  const handleDownloadCertificate = () => {
    if (participante?.certificado?.url) {
      window.open(participante.certificado.url, '_blank');
    }
  };

  // Función para cancelar la selección de archivo
  const handleCancelFileSelection = () => {
    setSelectedFile(null);
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

  const cursosInscritos = participante.cursos_inscritos || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800 relative">
      <button
        type="button"
        onClick={() => navigate("/estudiantes")}
        className="absolute top-8 left-8 flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium text-sm">Regresar</span>
      </button>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <FaUser className="text-3xl text-blue-700 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">{participante.nombre}</h1>
        </div>
        
        <div className="space-y-8">
          {/* Datos Personales y de Contacto */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Datos Personales y de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info icon={<FaEnvelope />} label="Correo Electrónico" value={participante.correo} />
              <Info icon={<FaPhone />} label="Teléfono" value={participante.telefono} />
              <Info icon={<FaUser />} label="Edad" value={`${participante.edad} años`} />
              <Info icon={<FaIdCard />} label="CURP" value={participante.curp} />
            </div>
          </section>

          {/* Información Profesional */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Información Profesional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info icon={<FaBuilding />} label="Empresa de Procedencia" value={participante.empresaProdecendia} />
              <Info icon={<FaBriefcase />} label="Puesto" value={participante.puesto} />
            </div>
          </section>

          {/* Sección de Certificado */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Certificado</h2>
            
            {/* Si ya tiene certificado */}
            {participante.certificado ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaFilePdf className="text-2xl text-red-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        {participante.certificado.nombre_archivo || 'Certificado.pdf'}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Subido el: {new Date(participante.certificado.fecha_subida).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadCertificate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <FaDownload />
                    Ver/Descargar
                  </button>
                </div>
              </div>
            ) : (
              /* Si no tiene certificado */
              <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <FaFilePdf className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Este participante no tiene certificado subido
                  </p>
                </div>
              </div>
            )}

            {/* Área de subida de certificado */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCertificate}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition"
                >
                  <FaFilePdf />
                  {participante.certificado ? 'Cambiar Certificado' : 'Seleccionar Certificado PDF'}
                </button>
              </div>

              {/* Archivo seleccionado */}
              {selectedFile && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFilePdf className="text-red-600" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">{selectedFile.name}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUploadCertificate}
                        disabled={uploadingCertificate}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg transition text-sm"
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
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition text-sm"
                      >
                        <FaTrash />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Historial de Cursos */}
          {cursosInscritos.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
                Historial de Cursos ({cursosInscritos.length})
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-72 overflow-y-auto">
                {cursosInscritos.map((inscripcion, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div>
                      <Link to={`/cursos/${inscripcion.curso_id?._id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-2">
                        <FaBookOpen />
                        {inscripcion.curso_id?.nombre || 'Curso no disponible'}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <FaCalendarCheck />
                        <span>Inscrito el: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs capitalize px-2 py-1 rounded-full ${
                        inscripcion.estado === 'inscrito' ? 'bg-blue-100 text-blue-800' :
                        inscripcion.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {inscripcion.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

           {/* Mensaje si no hay cursos */}
           {cursosInscritos.length === 0 && (
                <section>
                    <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FaBookOpen className="mx-auto text-4xl mb-2" />
                        <p>Este participante aún no se ha inscrito a ningún curso.</p>
                    </div>
                </section>
            )}
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