import { SolicitudDespliegueController } from "./SolicitudDespliegue.controller";
import { SolicitudDespliegueService } from "../services/SolicitudDespliegue.service";
import { SolicitudDespliegueRepository } from "../repositories/SolicitudDespliegue.repository";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";
import { SolicitudAccesoRepository } from "../../solicitud_acceso/repositories/SolicitudAcceso.repository";

const solicitudDespliegueRepository = new SolicitudDespliegueRepository();
const solicitudRepository = new SolicitudRepository();
const solicitudAccesoRepository = new SolicitudAccesoRepository();
const solicitudDespliegueService = new SolicitudDespliegueService(
  solicitudDespliegueRepository,
  solicitudRepository,
  solicitudAccesoRepository
);
const solicitudDespliegueController = new SolicitudDespliegueController(
  solicitudDespliegueService
);

export { solicitudDespliegueController };
