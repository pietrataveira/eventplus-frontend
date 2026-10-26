import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import logoEvent from "../../assets/logo-event.svg";
import { perfilEhAdministrador, useAuth } from "../../context/auth";
import "./Header.css";

function Header() {
    const { autenticado, usuario, perfil, logout } = useAuth();
    const administrador = perfilEhAdministrador(perfil);
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // fecha o menu ao clicar fora dele
    useEffect(() => {
        function fecharAoClicarFora(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuAberto(false);
            }
        }
        document.addEventListener("mousedown", fecharAoClicarFora);
        return () => document.removeEventListener("mousedown", fecharAoClicarFora);
    }, []);

    function sair() {
        setMenuAberto(false);
        logout();
        navigate("/login");
    }

    const primeiroNome = usuario?.nome?.split(" ")[0];

    return (
        <header className="header">
            <div className="header-conteudo">
                <Link to="/home" className="header-logo">
                    <img src={logoEvent} alt="Event+ página inicial" />
                </Link>

                <nav className="header-nav" aria-label="Navegação principal">
                    <NavLink to="/home" end>Home</NavLink>
                    <NavLink to="/eventos">Eventos</NavLink>
                    {administrador ? <NavLink to="/usuarios">Usuários</NavLink> : null}
                    <Link to="/home#contato">Contatos</Link>
                </nav>

                <div className="header-usuario" ref={menuRef}>
                    {autenticado ? (
                        <>
                            <button
                                type="button"
                                className="header-usuario-botao"
                                aria-expanded={menuAberto}
                                aria-haspopup="menu"
                                onClick={() => setMenuAberto((aberto) => !aberto)}
                            >
                                {primeiroNome || "Usuário"}
                                <span className={`header-seta ${menuAberto ? "aberta" : ""}`} aria-hidden="true" />
                            </button>

                            {menuAberto ? (
                                <div className="header-menu" role="menu">
                                    {administrador ? (
                                        <>
                                            <span className="header-menu-titulo">Administração</span>
                                            <Link role="menuitem" to="/admin/eventos" onClick={() => setMenuAberto(false)}>Eventos</Link>
                                            <Link role="menuitem" to="/tipo-eventos" onClick={() => setMenuAberto(false)}>Tipos de Evento</Link>
                                            <Link role="menuitem" to="/usuarios" onClick={() => setMenuAberto(false)}>Usuários</Link>
                                            <Link role="menuitem" to="/tipo-usuarios" onClick={() => setMenuAberto(false)}>Tipos de Usuário</Link>
                                            <hr />
                                        </>
                                    ) : null}
                                    <button role="menuitem" type="button" onClick={sair}>Sair</button>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <Link to="/login" className="header-usuario-botao">Usuário</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
