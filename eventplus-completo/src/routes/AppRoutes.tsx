import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home";
import Eventos from "../pages/Eventos/Eventos";
import DetalhesEvento from "../pages/DetalhesEvento/DetalhesEvento";
import Login from "../pages/Login/Login";
import Usuarios from "../pages/Usuarios/Usuarios";
import TipoEventos from "../pages/TipoEventos/TipoEventos";
import TipoUsuarios from "../pages/TipoUsuarios/TipoUsuarios";
import AdminEventos from "../pages/AdminEventos/AdminEventos";
import RotaPrivada from "./RotaPrivada";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<DetalhesEvento />} />

            {/* Telas administrativas: só para o Administrador */}
            <Route element={<RotaPrivada apenasAdmin />}>
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/tipo-eventos" element={<TipoEventos />} />
                <Route path="/tipo-usuarios" element={<TipoUsuarios />} />
                <Route path="/admin/eventos" element={<AdminEventos />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    )
}

export default AppRoutes;
