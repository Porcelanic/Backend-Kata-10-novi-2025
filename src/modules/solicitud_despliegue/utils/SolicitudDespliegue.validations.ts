import {
  SolicitudDespliegueDto,
  UpdateSolicitudDespliegueDto,
} from "../dtos/SolicitudDespliegueINS.dtos";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";

export async function validateSolicitudDespliegue(
  dto: SolicitudDespliegueDto | UpdateSolicitudDespliegueDto,
  solicitudRepository: SolicitudRepository
): Promise<string[]> {
  const errors: string[] = [];

  if ("id_solicitud" in dto) {
    if (dto.id_solicitud === -1) {
      errors.push("Id_solicitud is required.");
    } else if (typeof dto.id_solicitud !== "number") {
      errors.push("Id_solicitud must be a number.");
    } else {
      const solicitud = await solicitudRepository.findOneById(dto.id_solicitud);
      if (!solicitud) {
        errors.push("Solicitud with the given ID does not exist.");
      }
    }
  }

  if (!dto.link_pull_request || dto.link_pull_request.trim() === "") {
    errors.push("Link_pull_request is required.");
  } else if (dto.link_pull_request.length > 255) {
    errors.push("Link_pull_request cannot exceed 255 characters.");
  }

  if (
    !dto.documentacion_despliegue ||
    dto.documentacion_despliegue.trim() === ""
  ) {
    errors.push("Documentacion_despliegue is required.");
  } else if (dto.documentacion_despliegue.length > 255) {
    errors.push("Documentacion_despliegue cannot exceed 255 characters.");
  }

  if (!dto.historia_jira || dto.historia_jira.trim() === "") {
    errors.push("Historia_jira is required.");
  } else if (dto.historia_jira.length > 255) {
    errors.push("Historia_jira cannot exceed 255 characters.");
  }

  return errors;
}
