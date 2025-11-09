import { SolicitudController } from "./Solicitud.controller";
import { SolicitudService } from "../services/Solicitud.service";
import { SolicitudRepository } from "../repositories/Solicitud.repository";
import { UsuarioRepository } from "../../usuario/repositories/Usuario.repository";

const solicitudRepository = new SolicitudRepository();
const usuarioRepository = new UsuarioRepository();
const solicitudService = new SolicitudService(
  solicitudRepository,
  usuarioRepository
);
const solicitudController = new SolicitudController(solicitudService);

export { solicitudController };
