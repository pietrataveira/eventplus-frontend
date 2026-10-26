/*
 * Ilustrações das telas (feitas em SVG, no estilo flat dos protótipos).
 * Como são componentes, não dependem de nenhum arquivo de imagem externo.
 */

const VERMELHO = "#b51d44";
const ESCURO = "#3f3d56";
const CABELO = "#2f2e41";
const PELE = "#f6b9ad";
const PELE_ESCURA = "#a0616a";
const CINZA = "#f2f2f2";
const CINZA_MEDIO = "#e4e4e4";

interface Props {
    className?: string;
}

/* Tela Tipo Evento: monitor, homem apontando para o "+" e mulher segurando um card */
export function IlustracaoTipoEvento({ className }: Props) {
    return (
        <svg className={className} viewBox="0 0 400 230" role="img" aria-label="Pessoas cadastrando um tipo de evento em um monitor">
            {/* planta */}
            <path d="M362 214c-14-20-12-48 0-62 12 14 14 42 0 62z" fill={CINZA_MEDIO} />
            <path d="M350 214c-12-6-18-18-14-30 10 4 16 16 14 30z" fill={CINZA_MEDIO} />
            <path d="M362 214v-50" stroke="#d6d6d6" strokeWidth="1.5" />

            {/* monitor */}
            <rect x="62" y="4" width="268" height="150" rx="7" fill={ESCURO} />
            <rect x="62" y="140" width="268" height="24" rx="6" fill="#cfcfcf" />
            <rect x="74" y="16" width="244" height="124" rx="3" fill="#fff" />
            <rect x="74" y="16" width="44" height="124" fill={CINZA} />
            <path d="M178 164h36l12 50h-60z" fill={CINZA_MEDIO} />

            {/* cards na tela */}
            <rect x="200" y="32" width="96" height="26" fill="#fff" stroke="#dcdcdc" strokeWidth="1.5" />
            <rect x="212" y="40" width="72" height="3" rx="1.5" fill="#d0d0d0" />
            <rect x="212" y="48" width="72" height="3" rx="1.5" fill="#d0d0d0" />
            <rect x="134" y="74" width="96" height="26" fill="#fff" stroke="#dcdcdc" strokeWidth="1.5" />
            <rect x="146" y="82" width="72" height="3" rx="1.5" fill="#d0d0d0" />
            <rect x="146" y="90" width="72" height="3" rx="1.5" fill="#d0d0d0" />

            {/* chão */}
            <path d="M0 214h96M112 214h290" stroke="#d6d6d6" strokeWidth="1.5" />

            {/* homem */}
            <rect x="30" y="148" width="10" height="64" rx="3" fill={CABELO} />
            <rect x="44" y="148" width="10" height="64" rx="3" fill={CABELO} />
            <ellipse cx="34" cy="213" rx="8" ry="3" fill={CABELO} />
            <ellipse cx="50" cy="213" rx="8" ry="3" fill={CABELO} />
            <path d="M28 104c0-8 6-12 14-12s14 4 14 12l2 50H26z" fill={VERMELHO} />
            <path d="M52 104l34-14" stroke={VERMELHO} strokeWidth="9" strokeLinecap="round" />
            <circle cx="88" cy="89" r="4.5" fill={PELE} />
            <rect x="38" y="84" width="8" height="10" fill={PELE} />
            <circle cx="42" cy="78" r="10" fill={PELE} />
            <path d="M32 76c0-9 6-13 12-13 7 0 11 5 10 10-4-3-9-2-12 1-2 2-2 6-4 7-3 1-6-1-6-5z" fill={CABELO} />

            {/* botão + */}
            <circle cx="100" cy="86" r="13" fill={VERMELHO} />
            <path d="M100 79v14M93 86h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />

            {/* mulher */}
            <rect x="264" y="160" width="9" height="52" rx="3" fill={CABELO} />
            <rect x="277" y="160" width="9" height="52" rx="3" fill={CABELO} />
            <ellipse cx="268" cy="213" rx="8" ry="3" fill={CABELO} />
            <ellipse cx="282" cy="213" rx="8" ry="3" fill={CABELO} />
            <path d="M262 114c0-6 6-10 13-10s13 4 13 10l2 52h-30z" fill={ESCURO} />
            <rect x="271" y="96" width="8" height="10" fill={PELE} />
            <circle cx="275" cy="90" r="10" fill={PELE} />
            <path d="M264 92c-2-12 5-17 12-17s13 6 11 16c-3-4-6-6-10-6-5 0-9 3-13 7z" fill={CABELO} />
            <path d="M264 92c0 6 1 10 3 12h-5c-1-4-1-8 2-12z" fill={CABELO} />

            {/* card que ela segura */}
            <g transform="rotate(16 262 134)">
                <rect x="222" y="120" width="82" height="30" fill="#fff" stroke="#cfcfcf" strokeWidth="1.5" />
                <rect x="232" y="130" width="62" height="3.5" fill={VERMELHO} />
                <rect x="232" y="139" width="62" height="3.5" fill={VERMELHO} />
            </g>
            <circle cx="292" cy="146" r="4" fill={PELE} />
        </svg>
    );
}

/* Tela Tipo Usuário: janela do navegador + avatar de mulher com "+" */
export function IlustracaoTipoUsuario({ className }: Props) {
    return (
        <svg className={className} viewBox="0 0 330 230" role="img" aria-label="Janela com cadastro de tipo de usuário">
            <defs>
                <clipPath id="clip-avatar-tipo-usuario">
                    <circle cx="246" cy="156" r="58" />
                </clipPath>
            </defs>

            {/* folhas ao fundo */}
            <path d="M262 16c40 6 62 40 50 78-30-6-56-36-50-78z" fill={CINZA} />
            <path d="M250 26c28 14 38 46 22 74-22-16-34-46-22-74z" fill="#f7f7f7" />

            {/* janela */}
            <rect x="4" y="6" width="250" height="160" rx="4" fill="#fff" stroke={ESCURO} strokeWidth="1.6" />
            <path d="M4 20h250" stroke={ESCURO} strokeWidth="1.6" />
            <circle cx="13" cy="13" r="2.6" fill={ESCURO} />
            <circle cx="21" cy="13" r="2.6" fill={ESCURO} />
            <circle cx="29" cy="13" r="2.6" fill={ESCURO} />

            <rect x="76" y="38" width="104" height="6" rx="3" fill={CINZA_MEDIO} />
            <rect x="52" y="54" width="152" height="6" rx="3" fill={CINZA_MEDIO} />
            <rect x="52" y="74" width="58" height="5" rx="2.5" fill={CINZA_MEDIO} />
            <rect x="146" y="74" width="58" height="5" rx="2.5" fill={CINZA_MEDIO} />
            <rect x="52" y="86" width="152" height="5" rx="2.5" fill={CINZA_MEDIO} />
            <rect x="52" y="98" width="152" height="5" rx="2.5" fill={CINZA_MEDIO} />

            {/* avatar */}
            <circle cx="246" cy="156" r="58" fill="#fff" />
            <g clipPath="url(#clip-avatar-tipo-usuario)">
                <path d="M200 216c2-38 18-56 46-56s44 18 46 56z" fill={VERMELHO} />
                <path d="M210 216h72v6h-72z" fill={CABELO} />
                <rect x="240" y="146" width="12" height="16" fill={PELE_ESCURA} />
                <circle cx="246" cy="134" r="17" fill={PELE_ESCURA} />
                <path d="M229 132c0-13 8-20 17-20s17 7 17 18c-6-6-12-8-17-8-7 0-12 4-17 10z" fill={CABELO} />
                <circle cx="230" cy="114" r="7" fill={CABELO} />
                <circle cx="262" cy="114" r="7" fill={CABELO} />
            </g>
            <circle cx="246" cy="156" r="58" fill="none" stroke={ESCURO} strokeWidth="1.6" />

            {/* botão + */}
            <circle cx="296" cy="104" r="14" fill={VERMELHO} />
            <path d="M296 96v16M288 104h16" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
    );
}

/* Tela Administração Usuário: ficha de cadastro ligada a uma mulher */
export function IlustracaoUsuario({ className }: Props) {
    return (
        <svg className={className} viewBox="0 0 300 200" role="img" aria-label="Pessoa com ficha de cadastro de usuário">
            <defs>
                <clipPath id="clip-circulo-usuario">
                    <circle cx="178" cy="104" r="80" />
                </clipPath>
            </defs>

            {/* ficha */}
            <rect x="4" y="4" width="64" height="74" fill="#fff" stroke="#d6d6d6" strokeWidth="1.5" />
            <circle cx="36" cy="20" r="8" fill={VERMELHO} />
            <circle cx="36" cy="18" r="3" fill="#fff" />
            <path d="M31 25c1-3 3-4 5-4s4 1 5 4" fill="#fff" />
            <rect x="16" y="36" width="40" height="3" fill="#e0e0e0" />
            <rect x="16" y="45" width="40" height="3.5" fill={VERMELHO} />
            <rect x="16" y="54" width="40" height="3.5" fill={VERMELHO} />
            <path d="M44 66c4-2 8 0 8 4" stroke={ESCURO} strokeWidth="1.2" fill="none" />

            {/* fio */}
            <path d="M44 70c-8 30 30 26 20 54-8 22-30 6-20 30 6 14 28 8 52 6" stroke={ESCURO} strokeWidth="1.6" fill="none" />

            {/* círculo de fundo */}
            <circle cx="178" cy="104" r="80" fill={CINZA} />

            <g clipPath="url(#clip-circulo-usuario)">
                <path d="M138 120c4-20 18-26 40-26s36 6 40 26l6 70h-92z" fill={VERMELHO} />
                <path d="M134 184h88v20h-88z" fill={CABELO} />
            </g>

            {/* braço */}
            <path d="M146 116c-14 18-30 30-46 40" stroke={PELE} strokeWidth="10" strokeLinecap="round" />
            <path d="M152 108c-8 8-14 18-20 26" stroke={VERMELHO} strokeWidth="14" strokeLinecap="round" />
            <circle cx="98" cy="157" r="6" fill={PELE} />

            {/* cabeça */}
            <rect x="172" y="80" width="13" height="16" fill={PELE} />
            <circle cx="178" cy="68" r="20" fill={PELE} />
            <path d="M156 74c-4-24 8-36 24-36 16 0 26 12 22 34-2-10-8-16-16-18-8 6-20 10-30 20z" fill={CABELO} />
            <path d="M156 74c0 10 2 16 6 20h-10c-2-6-1-14 4-20z" fill={CABELO} />
        </svg>
    );
}

/* Tela Administração Evento: palestrante no púlpito */
export function IlustracaoEvento({ className }: Props) {
    return (
        <svg className={className} viewBox="0 0 330 230" role="img" aria-label="Palestrante apresentando um evento">
            <defs>
                <clipPath id="clip-fundo-evento">
                    <rect x="0" y="0" width="330" height="230" rx="48" />
                </clipPath>
            </defs>
            <rect x="0" y="0" width="330" height="230" rx="48" fill={CINZA} />

            <g clipPath="url(#clip-fundo-evento)">
                {/* plateia (silhuetas) */}
                <circle cx="182" cy="62" r="16" fill="#fff" />
                <path d="M156 230v-110c0-22 12-38 26-38s26 16 26 38v110z" fill="#fff" />
                <circle cx="252" cy="58" r="17" fill="#fff" opacity="0.9" />
                <path d="M224 230v-112c0-24 13-40 28-40s28 16 28 40v112z" fill="#fff" opacity="0.9" />
                <circle cx="128" cy="78" r="13" fill="#fff" opacity="0.7" />
                <path d="M106 230v-90c0-20 10-32 22-32s22 12 22 32v90z" fill="#fff" opacity="0.7" />

                {/* palestrante */}
                <path d="M58 64c-4-26 10-40 30-40 18 0 30 14 28 38l4 70H60z" fill={CABELO} />
                <rect x="80" y="74" width="14" height="18" fill={PELE} />
                <circle cx="87" cy="62" r="18" fill={PELE} />
                <path d="M68 62c0-18 10-26 21-26 12 0 19 8 19 16-12-2-26 2-40 10z" fill={CABELO} />
                <path d="M54 230l4-110c2-18 14-28 30-28s28 10 30 28l6 110z" fill={ESCURO} />
                <path d="M74 98h26l4 132H70z" fill={VERMELHO} />
                <path d="M110 112c10 6 22 8 34 4" stroke={ESCURO} strokeWidth="12" strokeLinecap="round" />
                <circle cx="148" cy="114" r="6" fill={PELE} />

                {/* púlpito e microfone */}
                <path d="M180 130c-6-14-4-26 6-32" stroke={CABELO} strokeWidth="2.5" fill="none" />
                <ellipse cx="188" cy="96" rx="5" ry="4" fill={CABELO} />
                <path d="M146 136h120l-10 94h-100z" fill={ESCURO} />
                <rect x="140" y="130" width="132" height="10" rx="2" fill="#2a2840" />
            </g>
        </svg>
    );
}

/* Seção Contato: mapa com marcador */
export function IlustracaoMapa({ className }: Props) {
    return (
        <svg className={className} viewBox="0 0 320 240" role="img" aria-label="Mapa com a localização da escola">
            <path d="M20 40l90-24 100 24 90-24v184l-90 24-100-24-90 24z" fill={ESCURO} />
            <path d="M110 16v184M210 40v184" stroke="#56546e" strokeWidth="2" />
            <path d="M20 150c50-10 80 20 130 6s90-30 150-6" stroke="#fff" strokeWidth="6" fill="none" opacity="0.85" />
            <path d="M60 230c10-60 40-120 90-150" stroke="#fff" strokeWidth="5" fill="none" opacity="0.85" />
            <path d="M200 60l30-34 26 26 18-18 26 30" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
            <path d="M204 60h96v20h-96z" fill={ESCURO} />
            <path d="M120 60c-26 0-46 20-46 46 0 34 46 80 46 80s46-46 46-80c0-26-20-46-46-46z" fill={VERMELHO} />
            <circle cx="120" cy="104" r="16" fill="#fff" />
        </svg>
    );
}
