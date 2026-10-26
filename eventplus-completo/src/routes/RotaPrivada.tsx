import { Navigate, Outlet, useLocation } from "react-router-dom";
import { perfilEhAdministrador, useAuth } from "../context/auth";

interface RotaPrivadaProps {
    /** quando true, só o tipo de usuário "Administrador" (ou "admin") pode entrar */
    apenasAdmin?: boolean;
}

/**
 * Protege as telas.
 * - Sem login: manda para o login e depois volta para a tela que tentou abrir.
 * - Logado, mas não é admin (em telas apenasAdmin): volta para a Home.
 */
function RotaPrivada({ apenasAdmin = false }: RotaPrivadaProps) {
    const { autenticado, perfil } = useAuth();
    const location = useLocation();

    if (!autenticado) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (apenasAdmin && !perfilEhAdministrador(perfil)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default RotaPrivada;
