import CadastroTipo from "../../components/cadastroTipo/CadastroTipo";
import { IlustracaoTipoUsuario } from "../../components/ilustracoes/Ilustracoes";
import { tipoUsuarioService } from "../../services/eventPlusservice";
import type { TipoUsuario } from "../../types/api";

function TipoUsuarios() {
    return (
        <CadastroTipo<TipoUsuario>
            tituloPagina="Administração Tipo de Usuários"
            tituloLista="Lista Tipo de Usuários"
            nomeItem="tipo de usuário"
            ilustracao={<IlustracaoTipoUsuario />}
            servico={tipoUsuarioService}
            pegarId={(tipo) => tipo.idTipoUsuario}
        />
    );
}

export default TipoUsuarios;
