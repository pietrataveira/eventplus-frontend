import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import imagemPadrao from "../../assets/banner-1.png";
import relogio from "../../assets/icons/relogio.svg";
import predio from "../../assets/icons/predio.svg";
import filtroIcone from "../../assets/icons/filtro.svg";
import enviar from "../../assets/icons/enviar.svg";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Botao from "../../components/botao/Botao";
import Campo from "../../components/campo/Campo";
import TituloSecao from "../../components/tituloSecao/TituloSecao";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";
import { comentarioService, eventoService, presencaService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import { useAuth } from "../../context/auth";
import type { Comentario, Evento, MensagemModeracao, Presenca } from "../../types/api";
import "./DetalhesEvento.css";

/** Ex.: "29 de Agosto às 17:00" */
function formatarDataHora(valor?: string) {
    const data = new Date(valor ?? "");
    if (Number.isNaN(data.getTime())) return "Data não informada";
    const dia = data.getDate();
    const mes = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(data);
    const hora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(data);
    return `${dia} de ${mes.charAt(0).toUpperCase()}${mes.slice(1)} às ${hora}`;
}

function DetalhesEvento() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { autenticado, usuario } = useAuth();

    const [evento, setEvento] = useState<Evento | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [aba, setAba] = useState<"sobre" | "comentarios">("sobre");
    const [presenca, setPresenca] = useState<Presenca | null>(null);
    const [presencaCarregada, setPresencaCarregada] = useState("");
    const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
    const [enviandoInscricao, setEnviandoInscricao] = useState(false);
    const [mensagemInscricao, setMensagemInscricao] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [novoComentario, setNovoComentario] = useState("");
    const [mensagemComentario, setMensagemComentario] = useState("");
    const [enviandoComentario, setEnviandoComentario] = useState(false);
    const [erro, setErro] = useState("");

    const carregar = useCallback(async () => {
        if (!id) return;
        setCarregando(true);
        setErro("");
        try {
            const [eventoAtual, comentariosAtuais] = await Promise.all([
                eventoService.buscar(id),
                comentarioService.listarPorEvento(id).catch(() => [] as Comentario[])
            ]);
            setEvento(eventoAtual);
            setComentarios(comentariosAtuais);
        } catch (error) {
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, [id]);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    // verifica se o usuário logado já está inscrito
    useEffect(() => {
        if (!usuario || !id) return;
        const chave = `${usuario.idUsuario}:${id}`;
        let ativo = true;

        presencaService
            .listarPorUsuario(usuario.idUsuario)
            .then((itens) => { if (ativo) setPresenca(itens.find((item) => item.idEvento === id) ?? null); })
            .catch(() => { if (ativo) setPresenca(null); })
            .finally(() => { if (ativo) setPresencaCarregada(chave); });

        return () => { ativo = false; };
    }, [id, usuario]);

    function exigirLogin() {
        if (autenticado) return false;
        navigate("/login", { state: { from: location.pathname } });
        return true;
    }

    async function inscrever() {
        if (exigirLogin() || !usuario || !evento || presenca) return;
        setEnviandoInscricao(true);
        setMensagemInscricao("");
        try {
            const novaPresenca = await presencaService.cadastrar({
                situacao: true,
                idEvento: evento.idEvento,
                idUsuario: usuario.idUsuario
            });
            setPresenca(novaPresenca);
            setMensagemInscricao("Inscrição realizada com sucesso.");
        } catch (error) {
            setMensagemInscricao(getApiErrorMessage(error));
        } finally {
            setEnviandoInscricao(false);
        }
    }

    async function cancelarInscricao() {
        if (!presenca || enviandoInscricao) return;
        setEnviandoInscricao(true);
        setMensagemInscricao("");
        try {
            await presencaService.excluir(presenca.idPresenca);
            setPresenca(null);
            setMensagemInscricao("Inscrição cancelada com sucesso.");
        } catch (error) {
            setMensagemInscricao(getApiErrorMessage(error));
        } finally {
            setConfirmandoCancelamento(false);
            setEnviandoInscricao(false);
        }
    }

    async function comentar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (exigirLogin() || !usuario || !evento || !novoComentario.trim()) return;
        setEnviandoComentario(true);
        setMensagemComentario("");
        try {
            const resposta = await comentarioService.cadastrar({
                descricao: novoComentario.trim(),
                idEvento: evento.idEvento,
                idUsuario: usuario.idUsuario
            });
            setNovoComentario("");
            if ("mensagem" in resposta) {
                setMensagemComentario((resposta as MensagemModeracao).mensagem);
            } else {
                setComentarios((itens) => [...itens, { ...resposta, idUsuarioNavigation: resposta.idUsuarioNavigation ?? usuario }]);
                setMensagemComentario("Comentário publicado.");
            }
        } catch (error) {
            setMensagemComentario(getApiErrorMessage(error));
        } finally {
            setEnviandoComentario(false);
        }
    }

    const chavePresenca = usuario && id ? `${usuario.idUsuario}:${id}` : "";
    const checandoPresenca = Boolean(chavePresenca && presencaCarregada !== chavePresenca);
    const comentariosVisiveis = comentarios.filter((comentario) => comentario.exibe !== false);

    if (carregando || erro || !evento) {
        return (
            <>
                <Header />
                <main className="detalhe-pagina">
                    <p className="estado-vazio-ep">
                        {carregando ? "Carregando evento..." : erro || "Evento não encontrado."}
                    </p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="detalhe-pagina">
                <div className="detalhe-container">
                    <img
                        className="detalhe-banner"
                        src={evento.imagemUrl || imagemPadrao}
                        alt={`Banner do evento ${evento.nome}`}
                        onError={(event) => { event.currentTarget.src = imagemPadrao; }}
                    />
                    <h1 className="detalhe-titulo">{evento.nome}</h1>

                    <div className="detalhe-conteudo">
                        <div className="detalhe-principal">
                            <div className="detalhe-abas" role="tablist">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={aba === "sobre"}
                                    className={aba === "sobre" ? "ativa" : ""}
                                    onClick={() => setAba("sobre")}
                                >
                                    Sobre o evento
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={aba === "comentarios"}
                                    className={aba === "comentarios" ? "ativa" : ""}
                                    onClick={() => setAba("comentarios")}
                                >
                                    Comentários
                                </button>
                            </div>

                            {aba === "sobre" ? (
                                <p className="detalhe-descricao" role="tabpanel">{evento.descricao}</p>
                            ) : (
                                <div className="detalhe-comentarios" role="tabpanel">
                                    <form className="detalhe-comentario-form" onSubmit={comentar}>
                                        <label className="visually-hidden" htmlFor="novo-comentario">Escreva um comentário</label>
                                        <Campo
                                            id="novo-comentario"
                                            placeholder={autenticado ? "Escreva um comentário..." : "Entre para comentar"}
                                            value={novoComentario}
                                            maxLength={200}
                                            onChange={(event) => setNovoComentario(event.target.value)}
                                        />
                                        <button type="submit" aria-label="Enviar comentário" disabled={enviandoComentario}>
                                            <img src={enviar} alt="" />
                                        </button>
                                    </form>

                                    {mensagemComentario ? <p className="mensagem-ep" role="status">{mensagemComentario}</p> : null}

                                    {comentariosVisiveis.length === 0 ? (
                                        <p className="detalhe-sem-comentarios">Nenhum comentário publicado.</p>
                                    ) : (
                                        comentariosVisiveis.map((comentario) => (
                                            <article key={comentario.idComentario} className="detalhe-comentario">
                                                <div className="detalhe-comentario-topo">
                                                    <strong>{comentario.idUsuarioNavigation?.nome || "Usuário"}</strong>
                                                    <time dateTime={comentario.dataComentario}>
                                                        {new Date(comentario.dataComentario).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                                                    </time>
                                                </div>
                                                <p>{comentario.descricao}</p>
                                            </article>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <aside className="detalhe-info">
                            <div className="detalhe-info-titulo">
                                <TituloSecao texto="Informações principais" />
                            </div>

                            <ul>
                                <li><img src={relogio} alt="" /> {formatarDataHora(evento.dataEvento)}</li>
                                <li><img src={predio} alt="" /> {evento.idInstituicaoNavigation?.nomeFantasia || "Local não informado"}</li>
                                <li><img src={filtroIcone} alt="" /> {evento.idTipoEventoNavigation?.titulo || "Categoria não informada"}</li>
                            </ul>

                            <Botao
                                variante={presenca ? "secundario" : "primario"}
                                texto={
                                    checandoPresenca ? "Verificando inscrição..."
                                        : presenca ? "Cancelar inscrição"
                                            : enviandoInscricao ? "Inscrevendo..."
                                                : "Se-inscrever"
                                }
                                disabled={checandoPresenca || enviandoInscricao}
                                onClick={() => (presenca ? setConfirmandoCancelamento(true) : void inscrever())}
                            />
                            {mensagemInscricao ? <p className="mensagem-ep" role="status">{mensagemInscricao}</p> : null}
                        </aside>
                    </div>
                </div>

                <ModalConfirmacao
                    show={confirmandoCancelamento}
                    titulo="Cancelar inscrição"
                    mensagem={`Deseja cancelar sua inscrição em "${evento.nome}"?`}
                    textoConfirmar={enviandoInscricao ? "Cancelando..." : "Cancelar inscrição"}
                    textoCancelar="Manter inscrição"
                    onClose={() => { if (!enviandoInscricao) setConfirmandoCancelamento(false); }}
                    onConfirm={() => void cancelarInscricao()}
                />
            </main>
            <Footer />
        </>
    );
}

export default DetalhesEvento;
