import {
  SolicitudAccesoDto,
  UpdateSolicitudAccesoDto,
} from "../dtos/SolicitudAccesoINS.dtos";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";

export async function validateSolicitudAcceso(
  dto: SolicitudAccesoDto | UpdateSolicitudAccesoDto,
  solicitudRepository: SolicitudRepository
): Promise<string[]> {
  const errors: string[] = [];

  if ("id_solicitud" in dto) {
    if (!dto.id_solicitud || dto.id_solicitud.trim() === "") {
      errors.push("Id_solicitud is required.");
    } else if (typeof dto.id_solicitud !== "string") {
      errors.push("Id_solicitud must be a string (UUID).");
    } else {
      const solicitud = await solicitudRepository.findOneById(dto.id_solicitud);
      if (!solicitud) {
        errors.push("Solicitud with the given ID does not exist.");
      }
    }
  }

  if (!dto.aplicacion || dto.aplicacion.trim() === "") {
    errors.push("Aplicacion is required.");
  } else if (dto.aplicacion.length > 100) {
    errors.push("Aplicacion cannot exceed 100 characters.");
  }

  if (!dto.rol_en_aplicacion || dto.rol_en_aplicacion.trim() === "") {
    errors.push("Rol_en_aplicacion is required.");
  } else if (dto.rol_en_aplicacion.length > 100) {
    errors.push("Rol_en_aplicacion cannot exceed 100 characters.");
  }

  return errors;
}
