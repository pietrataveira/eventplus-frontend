import type { ReactNode } from "react";
import { IconeLapis, IconeLixeira } from "../icones/Icones";
import "./TabelaCrud.css";

export interface Coluna<T> {
    titulo: string;
    valor: (item: T) => ReactNode;
    /** largura da coluna (ex.: "30%") */
    largura?: string;
}

interface TabelaCrudProps<T> {
    colunas: Coluna<T>[];
    itens: T[];
    chave: (item: T) => string;
    descricao: (item: T) => string;
    idEmEdicao?: string | null;
    carregando?: boolean;
    erro?: string;
    textoVazio: string;
    onEditar: (item: T) => void;
    onExcluir: (item: T) => void;
}

/**
 * Tabela usada nas listas das telas de administração
 * (Tipo Evento, Tipo Usuário e Usuários). Sempre tem as colunas Editar e Deletar.
 */
function TabelaCrud<T>({
    colunas,
    itens,
    chave,
    descricao,
    idEmEdicao,
    carregando,
    erro,
    textoVazio,
    onEditar,
    onExcluir
}: TabelaCrudProps<T>) {
    const totalColunas = colunas.length + 2;

    let linhaEstado: string | null = null;
    if (carregando) linhaEstado = "Carregando...";
    else if (erro) linhaEstado = erro;
    else if (itens.length === 0) linhaEstado = textoVazio;

    return (
        <div className="tabela-crud-wrapper">
            <table className="tabela-crud">
                <thead>
                    <tr>
                        {colunas.map((coluna) => (
                            <th key={coluna.titulo} style={{ width: coluna.largura }}>{coluna.titulo}</th>
                        ))}
                        <th className="tabela-crud-acao-coluna">Editar</th>
                        <th className="tabela-crud-acao-coluna">Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {linhaEstado ? (
                        <tr>
                            <td colSpan={totalColunas} className="tabela-crud-estado">{linhaEstado}</td>
                        </tr>
                    ) : (
                        itens.map((item) => (
                            <tr key={chave(item)} className={idEmEdicao === chave(item) ? "em-edicao" : ""}>
                                {colunas.map((coluna) => (
                                    <td key={coluna.titulo}>{coluna.valor(item)}</td>
                                ))}
                                <td>
                                    <button
                                        className="tabela-crud-acao"
                                        type="button"
                                        aria-label={`Editar ${descricao(item)}`}
                                        title="Editar"
                                        onClick={() => onEditar(item)}
                                    >
                                        <IconeLapis />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="tabela-crud-acao"
                                        type="button"
                                        aria-label={`Deletar ${descricao(item)}`}
                                        title="Deletar"
                                        onClick={() => onExcluir(item)}
                                    >
                                        <IconeLixeira />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaCrud;
