import "./TituloSecao.css";

interface TituloSecaoProps {
    texto: string;
    /** true quando o título fica em cima do fundo vermelho */
    claro?: boolean;
    /** h1 para o título principal da página, h2 para seções */
    nivel?: "h1" | "h2";
}

/** Título em caixa alta com o tracinho embaixo, como no protótipo */
function TituloSecao({ texto, claro = false, nivel = "h2" }: TituloSecaoProps) {
    const Tag = nivel;
    return (
        <div className={`titulo-secao ${claro ? "claro" : ""}`}>
            <Tag>{texto}</Tag>
            <span className="titulo-secao-linha" aria-hidden="true" />
        </div>
    );
}

export default TituloSecao;
