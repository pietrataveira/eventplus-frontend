/* Ícones pequenos usados nos formulários e nas telas */

interface Props {
    tamanho?: number;
}

export function IconeRelogio({ tamanho = 18 }: Props) {
    return (
        <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function IconeUpload({ tamanho = 18 }: Props) {
    return (
        <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11 15.5V6.8l-3.3 3.3-1.4-1.4L12 3l5.7 5.7-1.4 1.4L13 6.8v8.7z" />
            <path d="M4 14h2v4h12v-4h2v6H4z" />
        </svg>
    );
}

export function IconeLapis({ tamanho = 18 }: Props) {
    return (
        <svg width={tamanho} height={tamanho} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M14.18.73l-1.89 1.9 5.08 5.08 1.9-1.89a2.5 2.5 0 000-3.54L17.72.73a2.5 2.5 0 00-3.54 0zM11.4 3.51L2.29 12.63c-.4.4-.7.9-.87 1.46L.04 18.8a1 1 0 001.16 1.17l4.7-1.39c.56-.16 1.06-.46 1.47-.87l9.12-9.12z" />
        </svg>
    );
}

export function IconeLixeira({ tamanho = 18 }: Props) {
    return (
        <svg width={tamanho} height={tamanho} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.04.69l-.33.56H1.43C.64 1.25 0 1.81 0 2.5s.64 1.25 1.43 1.25h17.14c.8 0 1.43-.56 1.43-1.25s-.64-1.25-1.43-1.25h-4.28l-.33-.56A1.5 1.5 0 0012.69 0H7.31a1.5 1.5 0 00-1.27.69zM18.57 5H1.43l.95 13.24C2.45 19.23 3.38 20 4.51 20h10.98c1.13 0 2.06-.77 2.13-1.76z" />
        </svg>
    );
}
