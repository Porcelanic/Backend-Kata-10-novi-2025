import { SolicitudDto, UpdateSolicitudDto } from "../dtos/SolicitudINS.dtos";
import { UsuarioRepository } from "../../usuario/repositories/Usuario.repository";

export async function validateSolicitud(
  dto: SolicitudDto | UpdateSolicitudDto,
  usuarioRepository: UsuarioRepository
): Promise<string[]> {
  const errors: string[] = [];

  if (!dto.titulo || dto.titulo.trim() === "") {
    errors.push("Titulo is required.");
  } else if (dto.titulo.length > 255) {
    errors.push("Titulo cannot exceed 255 characters.");
  }

  if (!dto.tipo_solicitud || dto.tipo_solicitud.trim() === "") {
    errors.push("Tipo_solicitud is required.");
  } else if (dto.tipo_solicitud.length > 50) {
    errors.push("Tipo_solicitud cannot exceed 50 characters.");
  }

  if (!dto.estado || dto.estado.trim() === "") {
    errors.push("Estado is required.");
  } else if (dto.estado.length > 50) {
    errors.push("Estado cannot exceed 50 characters.");
  }

  if (!dto.descripcion || dto.descripcion.trim() === "") {
    errors.push("Descripcion is required.");
  }

  if (dto.centro_costo === null) {
    errors.push("Centro_costo is required.");
  } else if (typeof dto.centro_costo !== "number") {
    errors.push("Centro_costo must be a number.");
  } else if (!/^\d{4}$/.test(dto.centro_costo.toString())) {
    errors.push("Centro_costo must be exactly 4 digits.");
  }

  if (!dto.fecha_solicitud) {
    errors.push("Fecha_solicitud is required.");
  } else if (isNaN(new Date(dto.fecha_solicitud).getTime())) {
    errors.push("Invalid fecha_solicitud format.");
  }

  if (!dto.correo_solicitante || dto.correo_solicitante.trim() === "") {
    errors.push("Correo_solicitante is required.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.correo_solicitante)) {
      errors.push("Must be a valid email for correo_solicitante.");
    } else {
      // Validar que el usuario existe en la base de datos
      const usuarioExistente = await usuarioRepository.findOneByCorreo(
        dto.correo_solicitante.toLowerCase().trim()
      );
      if (!usuarioExistente) {
        errors.push("The user with the provided email does not exist.");
      }
    }
  }

  return errors;
}
