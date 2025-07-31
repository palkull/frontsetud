import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/inicio/inicio";
import Estudiantes from "./pages/inicio/estudiantes";
import Usuarios from "./pages/inicio/usuarios";
import Cursos from "./pages/inicio/cursos";
import AddCursos from "./components/cursos/addcursos";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./protectedRoutes";
import { CursoProvider } from "./context/CursoContext";
import VerCurso from "./components/cursos/verCurso"; // Asegúrate de importar el componente

function App() {
  return (
    <AuthProvider>
      <CursoProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />} >
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/verCurso/:id" element={<VerCurso />} /> {/* <-- Cambia esto */}
            <Route path="/add-cursos" element={<AddCursos />} />
            <Route path="/cursos" element={<Cursos />} />
          </Route>  
        </Routes>
      </CursoProvider>
    </AuthProvider>
  );
}

export default App;
