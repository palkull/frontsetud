import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/inicio/inicio";
import Estudiantes from "./pages/inicio/estudiantes";
import Usuarios from "./pages/inicio/usuarios";
import Cursos from "./pages/inicio/cursos";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./protectedRoutes";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />} >
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/cursos" element={<Cursos />} />
        </Route>  
      </Routes>
    </AuthProvider>
  );
}

export default App;
