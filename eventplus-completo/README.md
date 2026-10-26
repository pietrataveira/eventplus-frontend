# Event+ — Projeto 1 (completo)

Front-end em React + TypeScript + Vite com todas as telas do protótipo:

| Tela | Rota | Precisa de login? |
|---|---|---|
| Login | `/login` | não |
| Home | `/home` | não |
| Eventos (catálogo com filtro) | `/eventos` | não |
| Evento – Sobre o evento / Comentários | `/eventos/:id` | só para se inscrever/comentar |
| **Administração Tipo de Eventos** | `/tipo-eventos` | sim |
| **Administração Tipo de Usuários** | `/tipo-usuarios` | sim |
| **Administração Evento (cadastro de evento)** | `/admin/eventos` | sim |
| Administração Usuário | `/usuarios` | sim |

As telas de administração também ficam no menu **Usuário** (canto direito do header) depois do login.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

> A API precisa estar rodando. Por padrão o front chama `https://localhost:7169/api/`.
> Se a sua API usa outra porta, copie `.env.example` para `.env` e troque o endereço.

## Endpoints usados

- `POST Login`
- `GET/POST/PUT/DELETE TipoEvento` e `TipoUsuario` (corpo: `{ "titulo": "..." }`)
- `GET/POST/PUT/DELETE Usuario`
- `GET Instituicao`
- `GET Evento`, `GET Evento/proximos`, `GET Evento/{id}`, `POST/PUT/DELETE Evento`
- `GET Comentario/evento/{id}`, `POST Comentario`
- `GET Presenca/usuario/{id}`, `POST/DELETE Presenca`

**Cadastro de evento:** o front envia primeiro como `multipart/form-data`
(campos `nome`, `descricao`, `dataEvento`, `idTipoEvento`, `idInstituicao` e o arquivo `imagem`).
Se a API responder 415 (só aceita JSON), ele reenvia sozinho em JSON, com a foto em base64 no campo `imagemUrl`.
Isso fica em `src/services/eventPlusservice.ts`.

## Estrutura

```
src/
  components/   peças reutilizáveis (Header, Footer, Campo, Botao, CardEvento,
                TabelaCrud, CadastroTipo, ilustrações em SVG...)
  pages/        uma pasta por tela
  services/     chamadas à API (axios)
  context/      login / sessão
  routes/       rotas e proteção das telas de administração
```

As telas Tipo Evento e Tipo Usuário usam o mesmo componente `CadastroTipo`,
só mudando o texto, a ilustração e o endpoint.
