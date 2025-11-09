import { SolicitudAccesoController } from "./SolicitudAcceso.controller";
import { SolicitudAccesoService } from "../services/SolicitudAcceso.service";
import { SolicitudAccesoRepository } from "../repositories/SolicitudAcceso.repository";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";
import { SolicitudDespliegueRepository } from "../../solicitud_despliegue/repositories/SolicitudDespliegue.repository";

const solicitudAccesoRepository = new SolicitudAccesoRepository();
const solicitudRepository = new SolicitudRepository();
const solicitudDespliegueRepository = new SolicitudDespliegueRepository();
const solicitudAccesoService = new SolicitudAccesoService(
  solicitudAccesoRepository,
  solicitudRepository,
  solicitudDespliegueRepository
);
const solicitudAccesoController = new SolicitudAccesoController(
  solicitudAccesoService
);

export { solicitudAccesoController };
