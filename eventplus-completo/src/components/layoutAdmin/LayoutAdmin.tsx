import type { ReactNode } from "react";
import TituloSecao from "../tituloSecao/TituloSecao";
import "./LayoutAdmin.css";

interface SecaoCadastroProps {
    titulo: string;
    ilustracao: ReactNode;
    children: ReactNode;
}

/** Parte branca de cima: título + ilustração à esquerda + formulário à direita */
export function SecaoCadastro({ titulo, ilustracao, children }: SecaoCadastroProps) {
    return (
        <section className="secao-cadastro">
            <div className="container-ep">
                <TituloSecao texto={titulo} nivel="h1" />
                <div className="secao-cadastro-conteudo">
                    <div className="secao-cadastro-ilustracao">{ilustracao}</div>
                    <div className="secao-cadastro-formulario">{children}</div>
                </div>
            </div>
        </section>
    );
}

interface SecaoListaProps {
    titulo: string;
    children: ReactNode;
}

/** Parte vermelha de baixo com a tabela */
export function SecaoLista({ titulo, children }: SecaoListaProps) {
    return (
        <section className="secao-lista">
            <div className="container-ep">
                <TituloSecao texto={titulo} claro />
                <div className="secao-lista-conteudo">{children}</div>
            </div>
        </section>
    );
}
