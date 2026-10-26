import type { InputHTMLAttributes, ReactNode } from "react";
import "./Campo.css";

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    /** ícone opcional exibido no lado do campo (ex.: relógio, upload) */
    icone?: ReactNode;
    /** lado em que o ícone aparece */
    ladoIcone?: "esquerda" | "direita";
}

function Campo({
    placeholder,
    type = "text",
    className = "",
    icone,
    ladoIcone = "direita",
    ...props
}: CampoProps) {
    const classes = ["campo", className].filter(Boolean).join(" ");

    if (!icone) {
        return <input className={classes} type={type} placeholder={placeholder} {...props} />;
    }

    return (
        <div className={`campo-com-icone icone-${ladoIcone}`}>
            <span className="campo-icone" aria-hidden="true">{icone}</span>
            <input className={classes} type={type} placeholder={placeholder} {...props} />
        </div>
    );
}

export default Campo;
