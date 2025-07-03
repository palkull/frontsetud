import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import "./index.css";
import Usuarios from "./pages/inicio/usuarios.jsx";
import DeleteUser from "./components/users/deleteusers.jsx";
import Addusers from "./components/users/addusers.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />

      <Route path="/usuarios" element={<Usuarios />}>
        <Route index element={<DeleteUser />} />
        <Route path="add" element={<Addusers />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
