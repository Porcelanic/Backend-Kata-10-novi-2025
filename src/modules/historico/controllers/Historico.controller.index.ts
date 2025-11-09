import { HistoricoController } from "./Historico.controller";
import { HistoricoService } from "../services/Historico.service";
import { HistoricoRepository } from "../repositories/Historico.repository";
import { UsuarioRepository } from "../../usuario/repositories/Usuario.repository";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";

const historicoRepository = new HistoricoRepository();
const usuarioRepository = new UsuarioRepository();
const solicitudRepository = new SolicitudRepository();
const historicoService = new HistoricoService(
  historicoRepository,
  usuarioRepository,
  solicitudRepository
);
const historicoController = new HistoricoController(historicoService);

export { historicoController };
