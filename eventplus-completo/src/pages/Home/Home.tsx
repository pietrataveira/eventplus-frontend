import { useCallback, useEffect, useState } from "react";

import visaoImg from "../../assets/visao-img.png";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardEvento from "../../components/cardEvento/CardEvento";
import Carrossel from "../../components/carrossel/Carrossel";
import TituloSecao from "../../components/tituloSecao/TituloSecao";
import { IlustracaoMapa } from "../../components/ilustracoes/Ilustracoes";
import { eventoService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { Evento } from "../../types/api";
import "./Home.css";

const LINK_MAPA = "https://www.google.com/maps/search/?api=1&query=SENAI+S%C3%A3o+Caetano+do+Sul+Cyber+e+IA";

function Home() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro("");
        try {
            setEventos((await eventoService.listarProximos()).slice(0, 3));
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

    // quando clica em "Contatos" no menu, rola até a seção
    useEffect(() => {
        if (window.location.hash === "#contato") {
            requestAnimationFrame(() => document.querySelector("#contato")?.scrollIntoView());
        }
    }, []);

    return (
        <>
            <Header />
            <main>
                <Carrossel />

                <section className="home-visao">
                    <div className="container-ep home-visao-conteudo">
                        <div className="home-visao-imagem">
                            <img src={visaoImg} alt="Pessoas conversando em volta de uma mesa" />
                        </div>
                        <div className="home-visao-texto">
                            <TituloSecao texto="Visão" claro />
                            <p>
                                A EventPlus organiza eventos e informações em uma interface direta,
                                com foco em facilitar a consulta da agenda, o cadastro e a navegação
                                entre as telas principais.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="home-eventos" id="eventos">
                    <div className="container-ep">
                        <TituloSecao texto="Próximos Eventos" />

                        {carregando ? <p className="estado-vazio-ep">Carregando próximos eventos...</p> : null}
                        {!carregando && erro ? <p className="estado-vazio-ep">{erro}</p> : null}
                        {!carregando && !erro && eventos.length === 0 ? (
                            <p className="estado-vazio-ep">Nenhum próximo evento cadastrado.</p>
                        ) : null}

                        {eventos.length > 0 ? (
                            <div className="grade-eventos home-eventos-grade">
                                {eventos.map((evento) => (
                                    <CardEvento
                                        key={evento.idEvento}
                                        id={evento.idEvento}
                                        titulo={evento.nome}
                                        imagem={evento.imagemUrl}
                                        descricao={evento.descricao}
                                        categoria={evento.idTipoEventoNavigation?.titulo}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>

                <section id="contato" className="home-contato">
                    <div className="container-ep">
                        <TituloSecao texto="Contato" claro />
                        <div className="home-contato-conteudo">
                            <address className="home-contato-endereco">
                                <p>Rua Niterói, 180 - Centro</p>
                                <p>São Caetano do Sul - SP</p>
                                <a href="tel:+551142252000">(11) 4225-2000</a>
                            </address>
                            <a className="home-contato-mapa" href={LINK_MAPA} target="_blank" rel="noreferrer" aria-label="Abrir localização no Google Maps">
                                <IlustracaoMapa />
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Home;
