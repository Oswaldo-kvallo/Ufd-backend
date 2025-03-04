import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Administrador
import Login from "./Administrador/login.jsx";
import AdminInicio from "./Administrador/admin_inicio.jsx";
import AdminAreas from "./Administrador/admin_areas.jsx";
import AdminAcceso from "./Administrador/admin_acceso.jsx";
import AdminRegistros from "./Administrador/admin_registros.jsx";

// Alimentador
import AlimentadorLogin from "./Alimentador/alimentador_login.jsx";
import AlimentadorInicio from "./Alimentador/alimentador_inicio.jsx";
import AlimentadorRecopilacion from "./Alimentador/alimentador_recopilacion.jsx";

//Proteger rutas
import ProtectedRoute from "./services/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      {/* Administrador */}
      <Route path="/" element={<Login />} />
      <Route path="/admin_inicio" element={ <ProtectedRoute rolerequired="Administrador"><AdminInicio /></ProtectedRoute>} />
      <Route path="/admin_areas" element={<AdminAreas />} />
      <Route path="/admin_acceso" element={<AdminAcceso />} />
      <Route path="/admin_registros" element={<AdminRegistros />}/>

      {/* Alimentador */}
      <Route path="/alimentador_login" element={<AlimentadorLogin />} />
      <Route path="/alimentador_inicio" element={<AlimentadorInicio />} />
      <Route path="/alimentador_recopilacion" element={<AlimentadorRecopilacion />} />
      
    </Routes>
  </Router>
);