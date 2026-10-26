import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Campo from "../../components/campo/Campo";
import CampoSelect from "../../components/campo/CampoSelect";
import Botao from "../../components/botao/Botao";
import TabelaCrud from "../../components/tabelaCrud/TabelaCrud";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";
import { SecaoCadastro, SecaoLista } from "../../components/layoutAdmin/LayoutAdmin";
import { IlustracaoUsuario } from "../../components/ilustracoes/Ilustracoes";
import { tipoUsuarioService, usuarioService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { TipoUsuario, Usuario } from "../../types/api";

interface FormularioUsuario {
    nome: string;
    email: string;
    senha: string;
    idTipoUsuario: string;
}

const inicial: FormularioUsuario = { nome: "", email: "", senha: "", idTipoUsuario: "" };
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Usuarios() {
    const [formulario, setFormulario] = useState(inicial);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [tipos, setTipos] = useState<TipoUsuario[]>([]);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erroLista, setErroLista] = useState("");
    const [mensagem, setMensagem] = useState({ texto: "", sucesso: false });

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErroLista("");
        try {
            const [usuariosApi, tiposApi] = await Promise.all([usuarioService.listar(), tipoUsuarioService.listar()]);
            setUsuarios(usuariosApi);
            setTipos(tiposApi);
        } catch (error) {
            setErroLista(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    function atualizar(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormulario((valor) => ({ ...valor, [event.target.name]: event.target.value }));
    }

    function limpar() {
        setFormulario(inicial);
        setIdEmEdicao(null);
    }

    function validar() {
        if (!formulario.nome.trim()) return "Informe o nome.";
        if (!EMAIL_VALIDO.test(formulario.email.trim())) return "Informe um e-mail válido.";
        if (!formulario.idTipoUsuario) return "Selecione o tipo de usuário.";
        if (formulario.senha.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
        return "";
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const erro = validar();
        if (erro) {
            setMensagem({ texto: erro, sucesso: false });
            return;
        }

        setEnviando(true);
        setMensagem({ texto: "", sucesso: false });
        try {
            const payload = {
                nome: formulario.nome.trim(),
                email: formulario.email.trim(),
                senha: formulario.senha,
                idTipoUsuario: formulario.idTipoUsuario || null
            };

            if (idEmEdicao) {
                await usuarioService.atualizar(idEmEdicao, payload);
                setMensagem({ texto: "Usuário atualizado com sucesso.", sucesso: true });
            } else {
                await usuarioService.cadastrar(payload);
                setMensagem({ texto: "Usuário cadastrado com sucesso.", sucesso: true });
            }
            limpar();
            await carregar();
        } catch (error) {
            setMensagem({ texto: getApiErrorMessage(error), sucesso: false });
        } finally {
            setEnviando(false);
        }
    }

    function editar(usuario: Usuario) {
        setIdEmEdicao(usuario.idUsuario);
        setFormulario({
            nome: usuario.nome,
            email: usuario.email,
            idTipoUsuario: usuario.idTipoUsuario || usuario.idTipoUsuarioNavigation?.idTipoUsuario || "",
            senha: ""
        });
        setMensagem({ texto: "Informe uma nova senha para concluir a edição.", sucesso: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado) return;
        setEnviando(true);
        try {
            await usuarioService.excluir(selecionado.idUsuario);
            if (idEmEdicao === selecionado.idUsuario) limpar();
            setMensagem({ texto: "Usuário excluído com sucesso.", sucesso: true });
            await carregar();
        } catch (error) {
            setMensagem({ texto: getApiErrorMessage(error), sucesso: false });
        } finally {
            setSelecionado(null);
            setEnviando(false);
        }
    }

    function nomeTipo(usuario: Usuario) {
        return usuario.idTipoUsuarioNavigation?.titulo
            || tipos.find((tipo) => tipo.idTipoUsuario === usuario.idTipoUsuario)?.titulo
            || "Não informado";
    }

    return (
        <>
            <Header />
            <main>
                <SecaoCadastro titulo="Administração Usuário" ilustracao={<IlustracaoUsuario />}>
                    <form className="formulario-admin" onSubmit={salvar} noValidate>
                        {idEmEdicao ? <p className="formulario-admin-modo">Editando usuário</p> : null}

                        <label className="visually-hidden" htmlFor="usuario-nome">Nome</label>
                        <Campo id="usuario-nome" name="nome" placeholder="Nome" value={formulario.nome} onChange={atualizar} maxLength={100} />

                        <label className="visually-hidden" htmlFor="usuario-email">E-mail</label>
                        <Campo id="usuario-email" name="email" type="email" placeholder="Email" value={formulario.email} onChange={atualizar} />

                        <div className="formulario-admin-linha">
                            <div>
                                <label className="visually-hidden" htmlFor="usuario-tipo">Tipo de usuário</label>
                                <CampoSelect
                                    id="usuario-tipo"
                                    name="idTipoUsuario"
                                    placeholder="Tipo de Usuário"
                                    value={formulario.idTipoUsuario}
                                    onChange={atualizar}
                                    opcoes={tipos.map((tipo) => ({ valor: tipo.idTipoUsuario, texto: tipo.titulo }))}
                                />
                            </div>
                            <div>
                                <label className="visually-hidden" htmlFor="usuario-senha">Senha</label>
                                <Campo
                                    id="usuario-senha"
                                    name="senha"
                                    type="password"
                                    placeholder={idEmEdicao ? "Nova senha" : "Senha"}
                                    value={formulario.senha}
                                    onChange={atualizar}
                                    autoComplete="new-password"
                                    maxLength={60}
                                />
                            </div>
                        </div>

                        <Botao type="submit" disabled={enviando} texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar" : "Cadastrar"} />

                        {idEmEdicao ? (
                            <button type="button" className="formulario-admin-cancelar" onClick={() => { limpar(); setMensagem({ texto: "", sucesso: false }); }}>
                                Cancelar edição
                            </button>
                        ) : null}

                        {mensagem.texto ? (
                            <p className={`mensagem-ep ${mensagem.sucesso ? "sucesso" : ""}`} role="status">{mensagem.texto}</p>
                        ) : null}
                    </form>
                </SecaoCadastro>

                <SecaoLista titulo="Lista Usuários">
                    <TabelaCrud<Usuario>
                        colunas={[
                            { titulo: "Nome", valor: (usuario) => usuario.nome, largura: "24%" },
                            { titulo: "Email", valor: (usuario) => usuario.email, largura: "30%" },
                            { titulo: "Tipo de Usuário", valor: nomeTipo, largura: "22%" }
                        ]}
                        itens={usuarios}
                        chave={(usuario) => usuario.idUsuario}
                        descricao={(usuario) => usuario.nome}
                        idEmEdicao={idEmEdicao}
                        carregando={carregando}
                        erro={erroLista}
                        textoVazio="Nenhum usuário cadastrado."
                        onEditar={editar}
                        onExcluir={setSelecionado}
                    />
                </SecaoLista>

                <ModalConfirmacao
                    show={Boolean(selecionado)}
                    titulo="Excluir usuário"
                    mensagem={selecionado ? `Deseja excluir "${selecionado.nome}"?` : ""}
                    textoConfirmar={enviando ? "Excluindo..." : "Excluir"}
                    textoCancelar="Cancelar"
                    onClose={() => { if (!enviando) setSelecionado(null); }}
                    onConfirm={() => void excluir()}
                />
            </main>
            <Footer />
        </>
    );
}

export default Usuarios;
