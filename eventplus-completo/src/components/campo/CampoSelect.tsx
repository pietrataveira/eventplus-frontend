import type { SelectHTMLAttributes } from "react";
import "./Campo.css";

interface Opcao {
    valor: string;
    texto: string;
}

interface CampoSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    placeholder: string;
    opcoes: Opcao[];
}

/** Select no estilo do protótipo: linha embaixo + bolinha preta com seta */
function CampoSelect({ placeholder, opcoes, value, className = "", ...props }: CampoSelectProps) {
    return (
        <div className="campo-select">
            <select value={value} className={`${className} ${value ? "" : "vazio"}`} {...props}>
                <option value="" disabled>{placeholder}</option>
                {opcoes.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>{opcao.texto}</option>
                ))}
            </select>
            <span className="campo-select-seta" aria-hidden="true" />
        </div>
    );
}

export default CampoSelect;
