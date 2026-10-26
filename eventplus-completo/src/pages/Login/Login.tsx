import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logoEvent from "../../assets/logo-event.svg";
import Botao from "../../components/botao/Botao";
import Campo from "../../components/campo/Campo";
import { useAuth } from "../../context/auth";
import { getApiErrorMessage } from "../../services/api";
import "./Login.css";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, autenticado } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");
    const [enviando, setEnviando] = useState(false);

    const destino = (location.state as { from?: string } | null)?.from || "/home";

    // se já estiver logado, não faz sentido ficar no login
    useEffect(() => {
        if (autenticado) navigate(destino, { replace: true });
    }, [autenticado, destino, navigate]);

    async function entrar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setAviso("");

        if (!email.trim() || !senha) {
            setErro("Preencha o login e a senha.");
            return;
        }
        if (!EMAIL_VALIDO.test(email.trim())) {
            setErro("Digite um e-mail válido.");
            return;
        }

        setEnviando(true);
        try {
            await login({ email: email.trim(), senha });
            navigate(destino, { replace: true });
        } catch (error) {
            setErro(getApiErrorMessage(error));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="login-pagina">
            <div className="login-container">
                <img className="login-logo" src={logoEvent} alt="Event+" />

                <form className="login-formulario" onSubmit={entrar} noValidate>
                    <div>
                        <label className="visually-hidden" htmlFor="login-email">Login (e-mail)</label>
                        <Campo
                            id="login-email"
                            type="email"
                            placeholder="Login"
                            value={email}
                            autoComplete="email"
                            onChange={(event) => setEmail(event.target.value)}
                            aria-invalid={Boolean(erro)}
                            required
                        />
                    </div>

                    <div>
                        <label className="visually-hidden" htmlFor="login-senha">Senha</label>
                        <Campo
                            id="login-senha"
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            autoComplete="current-password"
                            onChange={(event) => setSenha(event.target.value)}
                            aria-invalid={Boolean(erro)}
                            required
                        />
                    </div>

                    <button
                        type="button"
                        className="login-esqueceu"
                        onClick={() => setAviso("Procure o administrador do Event+ para redefinir sua senha.")}
                    >
                        Esqueceu a senha?
                    </button>

                    <Botao type="submit" texto={enviando ? "Entrando..." : "Entrar"} disabled={enviando} />

                    {erro ? <p className="mensagem-ep" role="alert">{erro}</p> : null}
                    {aviso ? <p className="login-aviso" role="status">{aviso}</p> : null}
                </form>
            </div>
        </main>
    );
}

export default Login;
