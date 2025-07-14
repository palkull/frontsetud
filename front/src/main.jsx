import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import "./index.css";
import  *  as pages from "./utils/routes.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/inicio" element={<pages.Inicio />} />
      <Route path="/cursos" element={<pages.Cursos />} >
        <Route index element={<pages.AddCursos />} />
        <Route path="delete" element={<pages.DeleteCursos />} />
        <Route path="consultar" element={<pages.Editcurso />} />
      </Route>
      <Route path="/usuarios" element={<pages.Usuarios />}>
        <Route index element={<pages.Addusers />} />
        <Route path="delete" element={<pages.DeleteUser />} />
        <Route path="consultar" element={<pages.ConsultarUsuario />} />
      </Route>
      <Route path="/estudiantes" element={<pages.Estudiante />}>
        <Route index element={<pages.AddEstudiante />} />
        <Route path="delete" element={<pages.DeleteEstudiante />} />
        <Route path="consultar" element={<pages.ListaEstudiantes />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
