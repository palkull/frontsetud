import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/inicio/inicio";
import Participantes from "./pages/inicio/estudiantes";
import AddEstudiante from "./components/estudiantes/addestudiante";

import Usuarios from "./pages/inicio/usuarios";
import AddUsuarios from "./components/users/addusers";
import DeleteUsers from "./components/users/deleteusers";


import Cursos from "./pages/inicio/cursos";
import AddCursos from "./components/cursos/addcursos";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./protectedRoutes";
import { CursoProvider } from "./context/CursoContext";
import { ParticipantesProvider } from "./context/ParticipantesContext";
import VerCurso from "./components/cursos/verCurso"; 
import AddParticipantes from "./components/estudiantes/addestudiante";

function App() {
  return (
    <AuthProvider>
      <CursoProvider>
        <ParticipantesProvider>
          {/* Aquí puedes agregar más contextos si es necesario */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />} >
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/estudiantes" element={<Participantes />} />
              <Route path="/add-participantes" element={<AddParticipantes />} />
              <Route path="/historial-participantes" element={<DeleteUsers />} />

              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/add-usuarios" element={<AddUsuarios />} />
              <Route path="/historial-usuarios" element={<DeleteUsers />} />

              <Route path="/verCurso/:id" element={<VerCurso />} /> {/* <-- Cambia esto */}
              <Route path="/add-cursos" element={<AddCursos />} />
              <Route path="/cursos" element={<Cursos />} />
            </Route>  
          </Routes>
        </ParticipantesProvider>
      </CursoProvider>
    </AuthProvider>
  );
}

export default App;
