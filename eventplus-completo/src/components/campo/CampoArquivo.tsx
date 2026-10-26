import { IconeUpload } from "../icones/Icones";
import "./Campo.css";

interface CampoArquivoProps {
    id: string;
    placeholder: string;
    arquivo: File | null;
    nomeAtual?: string;
    accept?: string;
    onChange: (arquivo: File | null) => void;
}

/** Campo de upload com o mesmo visual dos outros campos (linha + ícone de upload) */
function CampoArquivo({ id, placeholder, arquivo, nomeAtual, accept = "image/*", onChange }: CampoArquivoProps) {
    const texto = arquivo?.name || nomeAtual || placeholder;

    return (
        <label htmlFor={id} className={`campo-arquivo ${arquivo || nomeAtual ? "preenchido" : ""}`}>
            <span className="campo-arquivo-nome">{texto}</span>
            <span className="campo-icone" aria-hidden="true"><IconeUpload /></span>
            <input
                id={id}
                type="file"
                accept={accept}
                aria-label={placeholder}
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            />
        </label>
    );
}

export default CampoArquivo;
