import { ApiError, axiosInstance } from "./api";

import type {
    Comentario,
    ComentarioPayload,
    Evento,
    EventoPayload,
    Instituicao,
    LoginPayload,
    LoginResponse,
    MensagemModeracao,
    Presenca,
    PresencaPayload,
    TipoEvento,
    TipoUsuario,
    Usuario,
    UsuarioPayload
} from "../types/api";

export const authService = {
    async login(payload: LoginPayload) {
        const { data } = await axiosInstance.post<LoginResponse>("Login", payload);
        return data;
    }
}

/* ---------------------------------------------------------------
 * EVENTO
 * O cadastro envia primeiro como multipart/form-data (com o arquivo
 * da foto). Se a API responder 415 (só aceita JSON), ele reenvia
 * automaticamente em JSON, com a foto convertida em texto (base64)
 * no campo imagemUrl. Assim funciona com os dois tipos de API.
 * ------------------------------------------------------------- */

function arquivoParaBase64(arquivo: File) {
    return new Promise<string>((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => resolve(String(leitor.result));
        leitor.onerror = () => reject(leitor.error);
        leitor.readAsDataURL(arquivo);
    });
}

function montarFormData(payload: EventoPayload) {
    const form = new FormData();
    form.append("nome", payload.nome);
    form.append("descricao", payload.descricao);
    form.append("dataEvento", payload.dataEvento);
    form.append("idTipoEvento", payload.idTipoEvento);
    form.append("idInstituicao", payload.idInstituicao);
    if (payload.imagem) form.append("arquivoImagem", payload.imagem);
    return form;
}

async function montarJson(payload: EventoPayload, imagemAtual?: string | null) {
    return {
        nome: payload.nome,
        descricao: payload.descricao,
        dataEvento: payload.dataEvento,
        idTipoEvento: payload.idTipoEvento,
        idInstituicao: payload.idInstituicao,
        imagemUrl: payload.imagem ? await arquivoParaBase64(payload.imagem) : imagemAtual ?? null
    };
}

async function enviarEvento(
    metodo: "post" | "put",
    url: string,
    payload: EventoPayload,
    imagemAtual?: string | null
) {
    try {
        const { data } = await axiosInstance.request<Evento>({
            method: metodo,
            url,
            data: montarFormData(payload)
        });
        return data;
    } catch (error) {
        if (error instanceof ApiError && error.status === 415) {
            const { data } = await axiosInstance.request<Evento>({
                method: metodo,
                url,
                data: await montarJson(payload, imagemAtual),
                headers: { "Content-Type": "application/json" }
            });
            return data;
        }
        throw error;
    }
}

export const eventoService = {
    async listar() {
        const { data } = await axiosInstance.get<Evento[]>("Evento");
        return data;
    },

    async listarProximos() {
        const { data } = await axiosInstance.get<Evento[]>("Evento/proximos");
        return data;
    },

    async buscar(id: string) {
        const { data } = await axiosInstance.get<Evento>(`Evento/${id}`);
        return data;
    },

    async cadastrar(payload: EventoPayload) {
        return enviarEvento("post", "Evento", payload);
    },

    async atualizar(id: string, payload: EventoPayload, imagemAtual?: string | null) {
        await enviarEvento("put", `Evento/${id}`, payload, imagemAtual);
    },

    async excluir(id: string) {
        await axiosInstance.delete(`Evento/${id}`);
    }
}

export const comentarioService = {
    async listarPorEvento(idEvento: string) {
        const { data } = await axiosInstance.get<Comentario[]>(`Comentario/evento/${idEvento}`);
        return data;
    },

    async cadastrar(payload: ComentarioPayload) {
        const { data } = await axiosInstance.post<Comentario | MensagemModeracao>("Comentario", payload);
        return data;
    }
}

export const presencaService = {
    async listarPorUsuario(idUsuario: string) {
        const { data } = await axiosInstance.get<Presenca[]>(`Presenca/usuario/${idUsuario}`);
        return data;
    },

    async cadastrar(payload: PresencaPayload) {
        const { data } = await axiosInstance.post<Presenca>("Presenca", payload);
        return data;
    },

    async excluir(id: string) {
        await axiosInstance.delete(`Presenca/${id}`);
    }
}

export const usuarioService = {
    async listar() {
        const { data } = await axiosInstance.get<Usuario[]>("Usuario");
        return data;
    },

    async buscar(id: string) {
        const { data } = await axiosInstance.get<Usuario>(`Usuario/${id}`);
        return data;
    },

    async cadastrar(payload: UsuarioPayload) {
        const { data } = await axiosInstance.post<Usuario>("Usuario", payload);
        return data;
    },

    async atualizar(id: string, payload: UsuarioPayload) {
        await axiosInstance.put(`Usuario/${id}`, payload);
    },

    async excluir(id: string) {
        await axiosInstance.delete(`Usuario/${id}`);
    }
}

export const instituicaoService = {
    async listar() {
        const { data } = await axiosInstance.get<Instituicao[]>("Instituicao");
        return data;
    }
}

/* Serviço genérico para as tabelas de "tipo" (só têm título) */
function tipoService<T extends { titulo: string }>(endpoint: string) {
    return {
        async listar() {
            const { data } = await axiosInstance.get<T[]>(endpoint);
            return data;
        },
        async cadastrar(titulo: string) {
            const { data } = await axiosInstance.post<T>(endpoint, { titulo });
            return data;
        },
        async atualizar(id: string, titulo: string) {
            await axiosInstance.put(`${endpoint}/${id}`, { titulo });
        },
        async excluir(id: string) {
            await axiosInstance.delete(`${endpoint}/${id}`);
        }
    }
}

export const tipoUsuarioService = tipoService<TipoUsuario>("TipoUsuario");
export const tipoEventoService = tipoService<TipoEvento>("TipoEvento");


