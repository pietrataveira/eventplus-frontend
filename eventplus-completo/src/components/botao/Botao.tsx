import type { ButtonHTMLAttributes } from "react";
import "./Botao.css";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    texto: string;
    /** "primario" = vermelho cheio | "secundario" = contorno */
    variante?: "primario" | "secundario";
}

function Botao({ texto, type = "button", variante = "primario", className = "", ...props }: BotaoProps) {
    const classes = ["botao", `botao-${variante}`, className].filter(Boolean).join(" ");

    return (
        <button className={classes} type={type} {...props}>
            {texto}
        </button>
    );
}

export default Botao;
