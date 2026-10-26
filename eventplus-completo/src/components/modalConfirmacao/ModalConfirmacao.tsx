import { useEffect } from "react";
import "./ModalConfirmacao.css";

interface ModalConfirmacaoProps {
    show: boolean;
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    onClose: () => void;
    onConfirm: () => void;
}

function ModalConfirmacao({
    show,
    titulo,
    mensagem,
    textoConfirmar = "Confirmar",
    textoCancelar = "Voltar",
    onClose,
    onConfirm
}: ModalConfirmacaoProps) {

    // fecha com a tecla ESC
    useEffect(() => {
        if (!show) return;
        const fecharComEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", fecharComEsc);
        return () => window.removeEventListener("keydown", fecharComEsc);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <>
            <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="modal-confirmacao-titulo">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content modal-ep">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modal-confirmacao-titulo">{titulo}</h5>
                            <button className="btn-close" type="button" aria-label="Fechar" onClick={onClose} />
                        </div>
                        <div className="modal-body">
                            <p>{mensagem}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-secondary" type="button" onClick={onClose}>{textoCancelar}</button>
                            <button className="btn btn-danger" type="button" onClick={onConfirm} autoFocus>{textoConfirmar}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </>
    );
}

export default ModalConfirmacao;
