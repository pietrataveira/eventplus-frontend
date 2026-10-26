import { useCallback, useEffect, useMemo, useState } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardEvento from "../../components/cardEvento/CardEvento";
import { eventoService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { Evento } from "../../types/api";
import "./Eventos.css";

const TODOS = "Todos";

function Eventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [filtro, setFiltro] = useState(TODOS);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro("");
        try {
            setEventos(await eventoService.listar());
        } catch (error) {
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    // as categorias do filtro vêm dos próprios eventos cadastrados
    const categorias = useMemo(() => {
        const titulos = eventos
            .map((evento) => evento.idTipoEventoNavigation?.titulo)
            .filter((titulo): titulo is string => Boolean(titulo));
        return [TODOS, ...Array.from(new Set(titulos)).sort()];
    }, [eventos]);

    const eventosFiltrados = filtro === TODOS
        ? eventos
        : eventos.filter((evento) => evento.idTipoEventoNavigation?.titulo === filtro);

    return (
        <>
            <Header />
            <main className="eventos-pagina">
                <div className="container-ep eventos-container">
                    <h1 className="visually-hidden">Eventos</h1>

                    <div className="eventos-filtros" role="group" aria-label="Filtrar por categoria">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                type="button"
                                className={`eventos-filtro ${filtro === categoria ? "ativo" : ""}`}
                                aria-pressed={filtro === categoria}
                                onClick={() => setFiltro(categoria)}
                            >
                                {categoria}
                            </button>
                        ))}
                    </div>

                    {carregando ? <p className="estado-vazio-ep">Carregando eventos...</p> : null}
                    {!carregando && erro ? <p className="estado-vazio-ep">{erro}</p> : null}
                    {!carregando && !erro && eventosFiltrados.length === 0 ? (
                        <p className="estado-vazio-ep">Nenhum evento encontrado.</p>
                    ) : null}

                    <div className="grade-eventos">
                        {eventosFiltrados.map((evento) => (
                            <CardEvento
                                key={evento.idEvento}
                                id={evento.idEvento}
                                imagem={evento.imagemUrl}
                                categoria={evento.idTipoEventoNavigation?.titulo}
                                titulo={evento.nome}
                                descricao={evento.descricao}
                            />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Eventos;
