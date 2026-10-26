import CadastroTipo from "../../components/cadastroTipo/CadastroTipo";
import { IlustracaoTipoEvento } from "../../components/ilustracoes/Ilustracoes";
import { tipoEventoService } from "../../services/eventPlusservice";
import type { TipoEvento } from "../../types/api";

function TipoEventos() {
    return (
        <CadastroTipo<TipoEvento>
            tituloPagina="Administração Tipo de Eventos"
            tituloLista="Lista Tipo de Eventos"
            nomeItem="tipo de evento"
            ilustracao={<IlustracaoTipoEvento />}
            servico={tipoEventoService}
            pegarId={(tipo) => tipo.idTipoEvento}
        />
    );
}

export default TipoEventos;
