import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Campo from "../../components/campo/Campo";
import CampoSelect from "../../components/campo/CampoSelect";
import CampoArquivo from "../../components/campo/CampoArquivo";
import Botao from "../../components/botao/Botao";
import CardEvento from "../../components/cardEvento/CardEvento";
import TituloSecao from "../../components/tituloSecao/TituloSecao";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";
import { SecaoCadastro } from "../../components/layoutAdmin/LayoutAdmin";
import { IlustracaoEvento } from "../../components/ilustracoes/Ilustracoes";
import { IconeRelogio } from "../../components/icones/Icones";
import { eventoService, instituicaoService, tipoEventoService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { Evento, Instituicao, TipoEvento } from "../../types/api";
import "./AdminEventos.css";

interface FormularioEvento {
    nome: string;
    descricao: string;
    dataEvento: string;
    idTipoEvento: string;
    idInstituicao: string;
}

const inicial: FormularioEvento = { nome: "", descricao: "", dataEvento: "", idTipoEvento: "", idInstituicao: "" };
const TAMANHO_MAXIMO_FOTO = 5 * 1024 * 1024; // 5 MB

/** Converte a data da API para o formato do input datetime-local (AAAA-MM-DDTHH:mm) */
function paraInputData(valor: string) {
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return "";
    const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
    return ajustada.toISOString().slice(0, 16);
}

function AdminEventos() {
    const [formulario, setFormulario] = useState(inicial);
    const [foto, setFoto] = useState<File | null>(null);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [tipos, setTipos] = useState<TipoEvento[]>([]);
    const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
    const [eventoEmEdicao, setEventoEmEdicao] = useState<Evento | null>(null);
    const [selecionado, setSelecionado] = useState<Evento | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erroLista, setErroLista] = useState("");
    const [mensagem, setMensagem] = useState({ texto: "", sucesso: false });

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErroLista("");
        try {
            const [eventosApi, tiposApi, instituicoesApi] = await Promise.all([
                eventoService.listar(),
                tipoEventoService.listar(),
                instituicaoService.listar()
            ]);
            setEventos([...eventosApi].sort((a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime()));
            setTipos(tiposApi);
            setInstituicoes(instituicoesApi);
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

    function escolherFoto(arquivo: File | null) {
        if (arquivo && !arquivo.type.startsWith("image/")) {
            setMensagem({ texto: "Escolha um arquivo de imagem (JPG, PNG...).", sucesso: false });
            return;
        }
        if (arquivo && arquivo.size > TAMANHO_MAXIMO_FOTO) {
            setMensagem({ texto: "A foto pode ter no máximo 5 MB.", sucesso: false });
            return;
        }
        setMensagem({ texto: "", sucesso: false });
        setFoto(arquivo);
    }

    function limpar() {
        setFormulario(inicial);
        setFoto(null);
        setEventoEmEdicao(null);
    }

    function validar() {
        if (!formulario.nome.trim()) return "Informe o nome do evento.";
        if (!formulario.dataEvento) return "Informe a data e o horário.";
        if (!formulario.descricao.trim()) return "Informe a descrição.";
        if (!formulario.idTipoEvento) return "Selecione o tipo de evento.";
        if (!formulario.idInstituicao) return "Selecione a instituição.";
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
                ...formulario,
                nome: formulario.nome.trim(),
                descricao: formulario.descricao.trim(),
                imagem: foto
            };

            if (eventoEmEdicao) {
                await eventoService.atualizar(eventoEmEdicao.idEvento, payload, eventoEmEdicao.imagemUrl);
                setMensagem({ texto: "Evento atualizado com sucesso.", sucesso: true });
            } else {
                await eventoService.cadastrar(payload);
                setMensagem({ texto: "Evento cadastrado com sucesso.", sucesso: true });
            }
            limpar();
            await carregar();
        } catch (error) {
            setMensagem({ texto: getApiErrorMessage(error), sucesso: false });
        } finally {
            setEnviando(false);
        }
    }

    function editar(evento: Evento) {
        setEventoEmEdicao(evento);
        setFoto(null);
        setFormulario({
            nome: evento.nome,
            descricao: evento.descricao,
            dataEvento: paraInputData(evento.dataEvento),
            idTipoEvento: evento.idTipoEvento || evento.idTipoEventoNavigation?.idTipoEvento || "",
            idInstituicao: evento.idInstituicao || evento.idInstituicaoNavigation?.idInstituicao || ""
        });
        setMensagem({ texto: "", sucesso: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado) return;
        setEnviando(true);
        try {
            await eventoService.excluir(selecionado.idEvento);
            if (eventoEmEdicao?.idEvento === selecionado.idEvento) limpar();
            setMensagem({ texto: "Evento excluído com sucesso.", sucesso: true });
            await carregar();
        } catch (error) {
            setMensagem({ texto: getApiErrorMessage(error), sucesso: false });
        } finally {
            setSelecionado(null);
            setEnviando(false);
        }
    }

    function nomeTipo(evento: Evento) {
        return evento.idTipoEventoNavigation?.titulo
            || tipos.find((tipo) => tipo.idTipoEvento === evento.idTipoEvento)?.titulo;
    }

    return (
        <>
            <Header />
            <main>
                <SecaoCadastro titulo="Administração Evento" ilustracao={<IlustracaoEvento />}>
                    <form className="formulario-admin" onSubmit={salvar} noValidate>
                        {eventoEmEdicao ? <p className="formulario-admin-modo">Editando “{eventoEmEdicao.nome}”</p> : null}

                        <div className="formulario-admin-linha nome-data">
                            <div>
                                <label className="visually-hidden" htmlFor="evento-nome">Nome</label>
                                <Campo id="evento-nome" name="nome" placeholder="Nome" value={formulario.nome} onChange={atualizar} maxLength={100} />
                            </div>
                            <div>
                                <label className="visually-hidden" htmlFor="evento-data">Data e horário</label>
                                <Campo
                                    id="evento-data"
                                    name="dataEvento"
                                    type="datetime-local"
                                    className={`campo-data ${formulario.dataEvento ? "" : "vazio"}`}
                                    value={formulario.dataEvento}
                                    onChange={atualizar}
                                    icone={<IconeRelogio />}
                                    ladoIcone="esquerda"
                                />
                            </div>
                        </div>

                        <label className="visually-hidden" htmlFor="evento-descricao">Descrição</label>
                        <Campo id="evento-descricao" name="descricao" placeholder="Descrição" value={formulario.descricao} onChange={atualizar} maxLength={500} />

                        <div className="formulario-admin-linha">
                            <div>
                                <label className="visually-hidden" htmlFor="evento-tipo">Tipo de evento</label>
                                <CampoSelect
                                    id="evento-tipo"
                                    name="idTipoEvento"
                                    placeholder="Tipo de Evento"
                                    value={formulario.idTipoEvento}
                                    onChange={atualizar}
                                    opcoes={tipos.map((tipo) => ({ valor: tipo.idTipoEvento, texto: tipo.titulo }))}
                                />
                            </div>
                            <div>
                                <label className="visually-hidden" htmlFor="evento-instituicao">Instituição</label>
                                <CampoSelect
                                    id="evento-instituicao"
                                    name="idInstituicao"
                                    placeholder="Instituição"
                                    value={formulario.idInstituicao}
                                    onChange={atualizar}
                                    opcoes={instituicoes.map((instituicao) => ({ valor: instituicao.idInstituicao, texto: instituicao.nomeFantasia }))}
                                />
                            </div>
                        </div>

                        <CampoArquivo
                            id="evento-foto"
                            placeholder="Foto"
                            arquivo={foto}
                            nomeAtual={eventoEmEdicao?.imagemUrl ? "Foto atual (escolha outra para trocar)" : undefined}
                            onChange={escolherFoto}
                        />

                        <Botao type="submit" disabled={enviando} texto={enviando ? "Salvando..." : eventoEmEdicao ? "Salvar" : "Cadastrar"} />

                        {eventoEmEdicao ? (
                            <button type="button" className="formulario-admin-cancelar" onClick={() => { limpar(); setMensagem({ texto: "", sucesso: false }); }}>
                                Cancelar edição
                            </button>
                        ) : null}

                        {mensagem.texto ? (
                            <p className={`mensagem-ep ${mensagem.sucesso ? "sucesso" : ""}`} role="status">{mensagem.texto}</p>
                        ) : null}
                    </form>
                </SecaoCadastro>

                <section className="admin-eventos-lista">
                    <div className="container-ep">
                        <TituloSecao texto="Eventos" />

                        {carregando ? <p className="estado-vazio-ep">Carregando eventos...</p> : null}
                        {!carregando && erroLista ? <p className="estado-vazio-ep">{erroLista}</p> : null}
                        {!carregando && !erroLista && eventos.length === 0 ? (
                            <p className="estado-vazio-ep">Nenhum evento cadastrado ainda.</p>
                        ) : null}

                        {!carregando && !erroLista && eventos.length > 0 ? (
                            <div className="grade-eventos admin-eventos-grade">
                                {eventos.map((evento) => (
                                    <CardEvento
                                        key={evento.idEvento}
                                        id={evento.idEvento}
                                        imagem={evento.imagemUrl}
                                        categoria={nomeTipo(evento)}
                                        titulo={evento.nome}
                                        descricao={evento.descricao}
                                        emEdicao={eventoEmEdicao?.idEvento === evento.idEvento}
                                        onEditar={() => editar(evento)}
                                        onExcluir={() => setSelecionado(evento)}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>

                <ModalConfirmacao
                    show={Boolean(selecionado)}
                    titulo="Excluir evento"
                    mensagem={selecionado ? `Deseja excluir o evento "${selecionado.nome}"?` : ""}
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

export default AdminEventos;
