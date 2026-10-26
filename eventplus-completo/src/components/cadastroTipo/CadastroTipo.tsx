import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import Campo from "../campo/Campo";
import Botao from "../botao/Botao";
import TabelaCrud from "../tabelaCrud/TabelaCrud";
import ModalConfirmacao from "../modalConfirmacao/ModalConfirmacao";
import { SecaoCadastro, SecaoLista } from "../layoutAdmin/LayoutAdmin";
import { getApiErrorMessage } from "../../services/api";

/** O que cada tela de "tipo" precisa informar */
interface ServicoTipo<T> {
    listar: () => Promise<T[]>;
    cadastrar: (titulo: string) => Promise<T>;
    atualizar: (id: string, titulo: string) => Promise<void>;
    excluir: (id: string) => Promise<void>;
}

interface CadastroTipoProps<T extends { titulo: string }> {
    tituloPagina: string;
    tituloLista: string;
    nomeItem: string;
    ilustracao: ReactNode;
    servico: ServicoTipo<T>;
    pegarId: (item: T) => string;
}

/**
 * Tela completa de cadastro de "tipo" (com título só).
 * É usada por Tipo Evento e Tipo Usuário — as duas são iguais, só muda o texto,
 * a ilustração e o endpoint da API.
 */
function CadastroTipo<T extends { titulo: string }>({
    tituloPagina,
    tituloLista,
    nomeItem,
    ilustracao,
    servico,
    pegarId
}: CadastroTipoProps<T>) {
    const [titulo, setTitulo] = useState("");
    const [itens, setItens] = useState<T[]>([]);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<T | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erroLista, setErroLista] = useState("");
    const [mensagem, setMensagem] = useState({ texto: "", sucesso: false });

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErroLista("");
        try {
            const dados = await servico.listar();
            setItens([...dados].sort((a, b) => a.titulo.localeCompare(b.titulo)));
        } catch (error) {
            setErroLista(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, [servico]);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    function limpar() {
        setTitulo("");
        setIdEmEdicao(null);
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const tituloLimpo = titulo.trim();

        if (!tituloLimpo) {
            setMensagem({ texto: "Informe o título.", sucesso: false });
            return;
        }

        const repetido = itens.some(
            (item) => item.titulo.toLowerCase() === tituloLimpo.toLowerCase() && pegarId(item) !== idEmEdicao
        );
        if (repetido) {
            setMensagem({ texto: `Já existe um ${nomeItem} com esse título.`, sucesso: false });
            return;
        }

        setEnviando(true);
        setMensagem({ texto: "", sucesso: false });
        try {
            if (idEmEdicao) {
                await servico.atualizar(idEmEdicao, tituloLimpo);
                setMensagem({ texto: `${capitalizar(nomeItem)} atualizado com sucesso.`, sucesso: true });
            } else {
                await servico.cadastrar(tituloLimpo);
                setMensagem({ texto: `${capitalizar(nomeItem)} cadastrado com sucesso.`, sucesso: true });
            }
            limpar();
            await carregar();
        } catch (error) {
            setMensagem({ texto: getApiErrorMessage(error), sucesso: false });
        } finally {
            setEnviando(false);
        }
    }

    function editar(item: T) {
        setIdEmEdicao(pegarId(item));
        setTitulo(item.titulo);
        setMensagem({ texto: "", sucesso: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado) return;
        setEnviando(true);
        try {
            await servico.excluir(pegarId(selecionado));
            if (idEmEdicao === pegarId(selecionado)) limpar();
            setMensagem({ texto: `${capitalizar(nomeItem)} excluído com sucesso.`, sucesso: true });
            await carregar();
        } catch (error) {
            setMensagem({ texto: getApiErrorMessage(error), sucesso: false });
        } finally {
            setSelecionado(null);
            setEnviando(false);
        }
    }

    return (
        <>
            <Header />
            <main>
                <SecaoCadastro titulo={tituloPagina} ilustracao={ilustracao}>
                    <form className="formulario-admin" onSubmit={salvar} noValidate>
                        {idEmEdicao ? <p className="formulario-admin-modo">Editando {nomeItem}</p> : null}

                        <label className="visually-hidden" htmlFor="tipo-titulo">Título</label>
                        <Campo
                            id="tipo-titulo"
                            placeholder="Título"
                            value={titulo}
                            maxLength={100}
                            onChange={(event) => setTitulo(event.target.value)}
                            required
                        />

                        <Botao
                            type="submit"
                            disabled={enviando}
                            texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar" : "Cadastrar"}
                        />

                        {idEmEdicao ? (
                            <button type="button" className="formulario-admin-cancelar" onClick={limpar}>
                                Cancelar edição
                            </button>
                        ) : null}

                        {mensagem.texto ? (
                            <p className={`mensagem-ep ${mensagem.sucesso ? "sucesso" : ""}`} role="status">
                                {mensagem.texto}
                            </p>
                        ) : null}
                    </form>
                </SecaoCadastro>

                <SecaoLista titulo={tituloLista}>
                    <TabelaCrud
                        colunas={[
                            { titulo: "Título", valor: (item: T) => item.titulo, largura: "34%" },
                            { titulo: "", valor: () => null }
                        ]}
                        itens={itens}
                        chave={pegarId}
                        descricao={(item) => item.titulo}
                        idEmEdicao={idEmEdicao}
                        carregando={carregando}
                        erro={erroLista}
                        textoVazio={`Nenhum ${nomeItem} cadastrado.`}
                        onEditar={editar}
                        onExcluir={setSelecionado}
                    />
                </SecaoLista>

                <ModalConfirmacao
                    show={Boolean(selecionado)}
                    titulo={`Excluir ${nomeItem}`}
                    mensagem={selecionado ? `Deseja excluir "${selecionado.titulo}"?` : ""}
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

function capitalizar(texto: string) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default CadastroTipo;
