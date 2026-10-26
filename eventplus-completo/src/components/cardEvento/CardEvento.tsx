import { Link } from "react-router-dom";

import imagemPadrao from "../../assets/banner-3.png";
import { IconeLapis, IconeLixeira } from "../icones/Icones";
import "./CardEvento.css";

interface CardEventoProps {
    id: string;
    imagem?: string | null;
    categoria?: string;
    titulo: string;
    descricao: string;
    /** quando informado, o card mostra os botões de editar/excluir (tela de administração) */
    onEditar?: () => void;
    onExcluir?: () => void;
    emEdicao?: boolean;
}

function CardEvento({ id, imagem, categoria, titulo, descricao, onEditar, onExcluir, emEdicao }: CardEventoProps) {
    const modoAdmin = Boolean(onEditar || onExcluir);

    return (
        <article className={`card-evento ${emEdicao ? "em-edicao" : ""}`}>
            <img
                className="card-evento-imagem"
                src={imagem || imagemPadrao}
                alt=""
                onError={(event) => { event.currentTarget.src = imagemPadrao; }}
            />
            <div className="card-evento-corpo">
                <span className="card-evento-categoria">{categoria || "Categoria"}</span>
                <h3>{titulo}</h3>
                <p>{descricao}</p>

                {modoAdmin ? (
                    <div className="card-evento-acoes">
                        <button type="button" onClick={onEditar} aria-label={`Editar ${titulo}`}>
                            <IconeLapis tamanho={14} /> Editar
                        </button>
                        <button type="button" onClick={onExcluir} aria-label={`Excluir ${titulo}`}>
                            <IconeLixeira tamanho={14} /> Excluir
                        </button>
                    </div>
                ) : (
                    <Link className="card-evento-link" to={`/eventos/${id}`}>Ver Evento</Link>
                )}
            </div>
        </article>
    );
}

export default CardEvento;
