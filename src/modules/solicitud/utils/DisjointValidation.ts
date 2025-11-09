import { SolicitudAccesoRepository } from "../../solicitud_acceso/repositories/SolicitudAcceso.repository";
import { SolicitudDespliegueRepository } from "../../solicitud_despliegue/repositories/SolicitudDespliegue.repository";

export async function validateDisjointConstraint(
  id_solicitud: string,
  tipoQueSeVaACrear: "acceso" | "despliegue",
  solicitudAccesoRepo: SolicitudAccesoRepository,
  solicitudDespliegueRepo: SolicitudDespliegueRepository
): Promise<string[]> {
  const errors: string[] = [];

  if (tipoQueSeVaACrear === "acceso") {
    const existeDespliegue = await solicitudDespliegueRepo.findOneById(
      id_solicitud
    );
    if (existeDespliegue) {
      errors.push(
        `Cannot create SolicitudAcceso: solicitud ${id_solicitud} already has a SolicitudDespliegue. A solicitud can only be of one type (DISJOINT constraint).`
      );
    }
  } else if (tipoQueSeVaACrear === "despliegue") {
    const existeAcceso = await solicitudAccesoRepo.findOneById(id_solicitud);
    if (existeAcceso) {
      errors.push(
        `Cannot create SolicitudDespliegue: solicitud ${id_solicitud} already has a SolicitudAcceso. A solicitud can only be of one type (DISJOINT constraint).`
      );
    }
  }

  return errors;
}
