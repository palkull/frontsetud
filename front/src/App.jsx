import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/inicio/inicio";

import VerParticipante from "./components/estudiantes/verParticipante";
import VerCurso from "./components/cursos/verCurso"; 
import VerUsuario from "./components/users/verUsuario";
import VerEmpresa from "./components/empresas/verEmpresa";

import Empresas from "./pages/inicio/empresas";
import Usuarios from "./pages/inicio/usuarios";
import Cursos from "./pages/inicio/cursos";
import Participantes from "./pages/inicio/estudiantes";

import AddCursos from "./components/cursos/addcursos";
import AddUsuarios from "./components/users/addusers";
import AddParticipantes from "./components/estudiantes/addestudiante";
import AddToParticipantes from "./components/estudiantes/addtoEstudiante";
import AddEmpresas from "./components/empresas/addEmpresa";

import HistorialUsuarios from "./components/users/deleteusers";
import HistorialParticipantes from './components/estudiantes/historialParticipantes';

import { EmpresasProvider } from "./context/EmpresasContext";
import { AuthProvider } from "./context/AuthContext";
import { CursoProvider } from "./context/CursoContext";
import { ParticipantesProvider } from "./context/ParticipantesContext";
import ProtectedRoutes from "./protectedRoutes";

function App() {
  return (
    <AuthProvider>
      <CursoProvider>
        <EmpresasProvider>
        <ParticipantesProvider>
          {/* Aquí puedes agregar más contextos si es necesario */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoutes />} >
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/participantes" element={<Participantes />} />
              <Route path="/empresas" element={<Empresas />} />
              <Route path="/add-empresas" element={<AddEmpresas />} />
              <Route path="/add-participantes" element={<AddParticipantes />} />
              <Route path="/add-participantes-to/:id" element={<AddToParticipantes />} />
              

              <Route path="/verEmpresa/:id" element={<VerEmpresa />} />
              <Route path="/verParticipante/:id" element={<VerParticipante />} />
              <Route path="/verUsuario/:id" element={<VerUsuario />} />
              <Route path="/historial-participantes" element={<HistorialParticipantes />} />

              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/add-usuarios" element={<AddUsuarios />} />
              <Route path="/historial-usuarios" element={<HistorialUsuarios />} />

              <Route path="/verCurso/:id" element={<VerCurso />} />
              <Route path="/add-cursos" element={<AddCursos />} />
              <Route path="/cursos" element={<Cursos />} />
            </Route>  
          </Routes>
        </ParticipantesProvider>
        </EmpresasProvider>
      </CursoProvider>
    </AuthProvider>
  );
}

export default App;
