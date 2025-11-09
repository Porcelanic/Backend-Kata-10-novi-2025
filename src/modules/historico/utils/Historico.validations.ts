import { HistoricoDto, UpdateHistoricoDto } from "../dtos/HistoricoINS.dtos";
import { UsuarioRepository } from "../../usuario/repositories/Usuario.repository";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";

export async function validateHistorico(
  dto: HistoricoDto | UpdateHistoricoDto,
  usuarioRepository: UsuarioRepository,
  solicitudRepository: SolicitudRepository
): Promise<string[]> {
  const errors: string[] = [];

  if (!dto.fecha_accion) {
    errors.push("Fecha_accion is required.");
  } else if (isNaN(new Date(dto.fecha_accion).getTime())) {
    errors.push("Invalid fecha_accion format.");
  }

  if (dto.id_solicitud !== undefined && dto.id_solicitud !== null) {
    if (typeof dto.id_solicitud !== "number") {
      errors.push("Id_solicitud must be a number.");
    } else {
      const solicitud = await solicitudRepository.findOneById(dto.id_solicitud);
      if (!solicitud) {
        errors.push("Solicitud with the given ID does not exist.");
      }
    }
  } else {
    errors.push("Id_solicitud is required.");
  }

  if (!dto.correo_aprobador || dto.correo_aprobador.trim() === "") {
    errors.push("Correo_aprobador is required.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.correo_aprobador)) {
      errors.push("Must be a valid email for correo_aprobador.");
    } else {
      const usuarioExistente = await usuarioRepository.findOneByCorreo(
        dto.correo_aprobador.toLowerCase().trim()
      );
      if (!usuarioExistente) {
        errors.push("The user with the provided email does not exist.");
      }
    }
  }

  return errors;
}
