import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurso } from "../../context/CursoContext";
import { useParticipantes } from "../../context/ParticipantesContext";
import { FaArrowLeft, FaUserPlus, FaFileExcel, FaUsers, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

function VerCurso() {
  const { id } = useParams();
  const { getCurso, inscribirParticipanteEnCurso } = useCurso();
  const { participantes, getParticipantes, createParticipante } = useParticipantes();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInscriptionModal, setShowInscriptionModal] = useState(false);
  const [selectedParticipantes, setSelectedParticipantes] = useState([]);
  const [searchParticipante, setSearchParticipante] = useState("");
  const navigate = useNavigate();

  const loadCursoData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const cursoData = await getCurso(id);
      setCurso(cursoData);
    } catch (error) {
      console.error("Error loading curso:", error);
      setCurso(null);
    } finally {
      setLoading(false);
    }
  }, [id, getCurso]);

  const loadParticipantes = useCallback(async () => {
    if (!participantes || participantes.length === 0) {
      try {
        await getParticipantes();
      } catch (error) {
        console.error("Error loading participantes:", error);
      }
    }
  }, [participantes, getParticipantes]);

  useEffect(() => {
    loadCursoData();
  }, [loadCursoData]);

  useEffect(() => {
    loadParticipantes();
  }, []);

  const handleInscripcionRapida = () => {
    navigate(`/add-participantes?cursoId=${id}`);
  };

  const handleInscribirExistentes = async () => {
    if (selectedParticipantes.length === 0) {
      toast.error("Selecciona al menos un participante");
      return;
    }
    try {
      const toastId = toast.loading(`Inscribiendo ${selectedParticipantes.length} participante(s)...`);
      for (const participanteId of selectedParticipantes) {
        await inscribirParticipanteEnCurso(id, participanteId);
      }
      toast.update(toastId, {
        render: `${selectedParticipantes.length} participante(s) inscrito(s) exitosamente`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      setShowInscriptionModal(false);
      setSelectedParticipantes([]);
      await loadCursoData();
    } catch (error) {
      toast.error("Error al inscribir participantes");
      console.error(error);
    }
  };

  // ==================================================================
  // ========= FUNCIÓN MODIFICADA CON LAS VALIDACIONES =========
  // ==================================================================
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      let newAndEnrolledCount = 0;
      let existingEnrolledCount = 0;
      let alreadyInCourseCount = 0;
      let errorCount = 0;

      const toastId = toast.loading(`Procesando ${rows.length} registros del Excel...`);

      for (const row of rows) {
        try {
          const curp = (row.curp || row.CURP || row.Curp)?.toString().trim().toUpperCase();
          const correo = (row.correo || row.email || row.Email || row.EMAIL)?.toString().trim().toLowerCase();

          if (!curp && !correo) {
            console.error("Fila omitida: No se proporcionó CURP ni Correo.", row);
            errorCount++;
            continue;
          }

          const yaInscrito = curso?.participantes?.some(pInscrito =>
            pInscrito.participante_id?.curp === curp || pInscrito.participante_id?.correo === correo
          );

          if (yaInscrito) {
            alreadyInCourseCount++;
            console.log(`Participante ${row.nombre} (${curp || correo}) ya está inscrito. Omitiendo.`);
            continue;
          }

          const participanteExistente = participantes.find(p =>
            (curp && p.curp === curp) || (correo && p.correo === correo)
          );

          if (participanteExistente) {
            await inscribirParticipanteEnCurso(id, participanteExistente._id);
            existingEnrolledCount++;
            console.log(`Participante existente ${participanteExistente.nombre} inscrito al curso.`);
          } else {
            const participanteData = {
              nombre: row.nombre || row.Nombre || row.NOMBRE,
              empresaProdecendia: row.empresaProdecendia || row.empresa || row.Empresa || row.EMPRESA,
              puesto: row.puesto || row.Puesto || row.PUESTO,
              edad: parseInt(row.edad || row.Edad || row.EDAD),
              correo: correo,
              telefono: (row.telefono || row.Telefono || row.TELEFONO)?.toString(),
              curp: curp
            };
            const newParticipanteResponse = await createParticipante(participanteData);
            await inscribirParticipanteEnCurso(id, newParticipanteResponse.data._id);
            newAndEnrolledCount++;
            console.log(`Nuevo participante ${participanteData.nombre} creado e inscrito.`);
          }
        } catch (error) {
          console.error("Error procesando una fila del Excel:", error, "Fila:", row);
          errorCount++;
        }
      }

      let summaryMessages = [];
      if (newAndEnrolledCount > 0) summaryMessages.push(`${newAndEnrolledCount} nuevo(s) inscrito(s)`);
      if (existingEnrolledCount > 0) summaryMessages.push(`${existingEnrolledCount} existente(s) inscrito(s)`);
      if (alreadyInCourseCount > 0) summaryMessages.push(`${alreadyInCourseCount} ya estaba(n) en el curso`);
      if (errorCount > 0) summaryMessages.push(`${errorCount} con error(es)`);
      const finalMessage = summaryMessages.length > 0 ? `Proceso finalizado: ${summaryMessages.join(', ')}.` : "No se procesaron registros.";

      toast.update(toastId, {
        render: finalMessage,
        type: errorCount > 0 && (newAndEnrolledCount + existingEnrolledCount) === 0 ? "error" : "success",
        isLoading: false,
        autoClose: 6000
      });

      await Promise.all([
        loadCursoData(),
        getParticipantes()
      ]);
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };
  // =================== FIN DE LA FUNCIÓN MODIFICADA =================

  const participantesDisponibles = participantes.filter(p => {
    const yaInscrito = curso?.participantes?.some(cp =>
      cp.participante_id?._id === p._id || cp.participante_id === p._id
    );
    const matchesSearch = p.nombre?.toLowerCase().includes(searchParticipante.toLowerCase()) ||
      p.correo?.toLowerCase().includes(searchParticipante.toLowerCase());
    return !yaInscrito && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">Cargando curso...</h2>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Curso no encontrado</h2>
          <button
            type="button"
            onClick={() => navigate("/cursos")}
            className="flex items-center gap-2 bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg shadow hover:bg-blue-200 dark:hover:bg-gray-700 transition mx-auto"
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium text-sm">Regresar</span>
          </button>
        </div>
      </div>
    );
  }

  const participantesInscritos = curso.participantes?.length || 0;
  const cuposDisponibles = curso.cupoMaximo - participantesInscritos;

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

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center">{curso.nombre}</h1>
        
        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={handleInscripcionRapida}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <FaUserPlus />
            <span>Inscripción Rápida</span>
          </button>
          
          <button
            onClick={() => setShowInscriptionModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <FaUsers />
            <span>Inscribir Existentes</span>
          </button>
          
          <label className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer">
            <FaFileExcel />
            <span>Importar Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImportExcel}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-8">
          {/* Datos generales */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Datos generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Tipo" value={curso.tipo} />
              <Info label="Modalidad" value={curso.modalidad} />
              <Info label="Fecha inicio" value={curso.fechaInicio ? curso.fechaInicio.slice(0, 10) : ""} />
              <Info label="Fecha fin" value={curso.fechaFin ? curso.fechaFin.slice(0, 10) : ""} />
              <Info label="Horario" value={curso.horario} />
              <Info label="Duración (horas)" value={curso.duracion} />
            </div>
          </section>

          {/* Instructor y objetivos */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Instructor y objetivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Instructor" value={curso.instructor} />
              <Info label="Perfil del instructor" value={curso.perfilInstructor} />
            </div>
            <div className="mt-2">
              <Info label="Objetivos" value={curso.objetivos} />
            </div>
          </section>

          {/* Participantes y cupos */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Participantes y cupos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Info label="Perfil del participante" value={curso.perfilParticipante} />
              <Info label="Cupo mínimo" value={curso.cupoMinimo} />
              <Info label="Cupo máximo" value={curso.cupoMaximo} />
              <Info 
                label="Participantes inscritos" 
                value={participantesInscritos}
                className={participantesInscritos >= curso.cupoMinimo ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
              />
              <Info 
                label="Cupos disponibles" 
                value={cuposDisponibles}
                className={cuposDisponibles > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
              />
            </div>
          </section>

          {/* Costos y temario */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Costos y temario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Costo" value={curso.costo ? `$${curso.costo}` : null} />
              <Info label="Costo general" value={curso.costoGeneral ? `$${curso.costoGeneral}`: null} />
            </div>
            <div className="mt-2">
              <Info label="Temario general" value={curso.temario} />
            </div>
          </section>

          {/* Proceso de inscripción */}
          <section>
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">Proceso de inscripción</h2>
            <div>
              <Info label="Proceso de inscripción" value={curso.procesoInscripcion} />
            </div>
          </section>

          {/* Lista de participantes inscritos */}
          {participantesInscritos > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-200 dark:border-blue-900 pb-2">
                Lista de participantes ({participantesInscritos})
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-60 overflow-y-auto">
                {curso.participantes.map((participante, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium">
                        {participante.participante_id?.nombre || `Participante ${index + 1}`}
                      </span>
                      <br />
                      <span className="text-sm text-gray-500">
                        {participante.participante_id?.correo}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        participante.estado === 'inscrito' ? 'bg-blue-100 text-blue-800' :
                        participante.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {participante.estado}
                      </span>
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(participante.fecha_inscripcion).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Modal para inscribir participantes existentes */}
      {showInscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                Inscribir Participantes Existentes
              </h3>
              <button
                onClick={() => setShowInscriptionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar participante por nombre o correo..."
                value={searchParticipante}
                onChange={(e) => setSearchParticipante(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {participantesDisponibles.map(participante => (
                <label key={participante._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                  <input
                    type="checkbox"
                    checked={selectedParticipantes.includes(participante._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedParticipantes([...selectedParticipantes, participante._id]);
                      } else {
                        setSelectedParticipantes(selectedParticipantes.filter(id => id !== participante._id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{participante.nombre}</div>
                    <div className="text-sm text-gray-500">{participante.correo} - {participante.empresaProdecendia}</div>
                  </div>
                </label>
              ))}
              {participantesDisponibles.length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay participantes disponibles</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleInscribirExistentes}
                disabled={selectedParticipantes.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Inscribir Seleccionados ({selectedParticipantes.length})
              </button>
              <button
                onClick={() => setShowInscriptionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar cada dato con etiqueta y valor
function Info({ label, value, className }) {
  return (
    <div className="flex flex-col mb-2">
      <span className="text-xs font-semibold text-blue-500 dark:text-blue-300 uppercase">{label}</span>
      <span className={`text-base ${className || 'text-gray-700 dark:text-gray-200'}`}>
        {value || <span className="italic text-gray-400">Sin información</span>}
      </span>
    </div>
  );
}

export default VerCurso;