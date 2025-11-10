import { SolicitudRepository } from "../repositories/Solicitud.repository";
import { SolicitudDto, UpdateSolicitudDto } from "../dtos/SolicitudINS.dtos";
import {
  SolicitudDto as SolicitudOutputDto,
  GetSolicitudByIdResult,
  GetAllSolicitudesResult,
  UpdateSolicitudResult,
  DeleteSolicitudResult,
} from "../dtos/SolicitudOUTS.dtos";
import { validateSolicitud } from "../utils/Solicitud.validations";
import { Solicitud } from "../../../database/entities/Solicitud";
import { UsuarioRepository } from "../../usuario/repositories/Usuario.repository";
import { EmailService } from "../../../utils/email.service";

export class SolicitudService {
  private solicitudRepository: SolicitudRepository;
  private usuarioRepository: UsuarioRepository;
  private emailService: EmailService;

  constructor(
    solicitudRepository: SolicitudRepository,
    usuarioRepository: UsuarioRepository
  ) {
    this.solicitudRepository = solicitudRepository;
    this.usuarioRepository = usuarioRepository;
    this.emailService = new EmailService();
  }

  private mapToSolicitudDto(solicitud: Solicitud): SolicitudOutputDto {
    return {
      id_solicitud: solicitud.id_solicitud,
      titulo: solicitud.titulo,
      tipo_solicitud: solicitud.tipo_solicitud,
      estado: solicitud.estado,
      descripcion: solicitud.descripcion,
      centro_costo: solicitud.centro_costo,
      fecha_solicitud: solicitud.fecha_solicitud,
      comentario_adicional: solicitud.comentario_adicional || undefined,
      correo_solicitante: solicitud.correo_solicitante,
      solicitudAcceso: solicitud.solicitudAcceso
        ? {
            id_solicitud: solicitud.solicitudAcceso.id_solicitud,
            aplicacion: solicitud.solicitudAcceso.aplicacion,
            rol_en_aplicacion: solicitud.solicitudAcceso.rol_en_aplicacion,
          }
        : undefined,
      solicitudDespliegue: solicitud.solicitudDespliegue
        ? {
            id_solicitud: solicitud.solicitudDespliegue.id_solicitud,
            link_pull_request: solicitud.solicitudDespliegue.link_pull_request,
            documentacion_despliegue:
              solicitud.solicitudDespliegue.documentacion_despliegue,
            historia_jira: solicitud.solicitudDespliegue.historia_jira,
          }
        : undefined,
    };
  }

  async createSolicitud(dto: SolicitudDto): Promise<GetSolicitudByIdResult> {
    try {
      if (dto.correo_solicitante) {
        dto.correo_solicitante = dto.correo_solicitante.toLowerCase().trim();
      }
      const errors = await validateSolicitud(dto, this.usuarioRepository);
      if (errors.length > 0) {
        return { errors };
      }

      const solicitud = await this.solicitudRepository.save(dto);

      await this.notifyAprobadores(solicitud);

      return { solicitud: this.mapToSolicitudDto(solicitud) };
    } catch (err) {
      console.log("error creating solicitud", err);
      return { errors: ["error creating solicitud"] };
    }
  }

  private async notifyAprobadores(solicitud: Solicitud): Promise<void> {
    try {
      const aprobadores =
        await this.usuarioRepository.findAprobadoresByCentroCosto(
          solicitud.centro_costo
        );

      if (aprobadores.length === 0) {
        console.log(
          `No aprobadores found for centro_costo: ${solicitud.centro_costo}`
        );
        return;
      }

      console.log(`Sending notifications to ${aprobadores.length} aprobadores`);

      const emails = aprobadores.map((aprobador) =>
        this.emailService.createSolicitudNotificationEmail(aprobador.correo, {
          id_solicitud: solicitud.id_solicitud,
          titulo: solicitud.titulo,
          tipo_solicitud: solicitud.tipo_solicitud,
          descripcion: solicitud.descripcion,
          correo_solicitante: solicitud.correo_solicitante,
          fecha_solicitud: solicitud.fecha_solicitud,
          centro_costo: solicitud.centro_costo,
        })
      );

      await this.emailService.sendMultipleEmails(emails);
    } catch (err) {
      console.error("Error sending notification emails:", err);
    }
  }

  async getAllSolicitudes(): Promise<GetAllSolicitudesResult> {
    try {
      const solicitudes = await this.solicitudRepository.findAll();
      return { solicitudes: solicitudes.map((s) => this.mapToSolicitudDto(s)) };
    } catch (err) {
      console.log("error getting solicitudes", err);
      if (err instanceof Error) {
        return { errors: ["error getting solicitudes", err.message] };
      }
      return { errors: ["error getting solicitudes"] };
    }
  }

  async getSolicitudById(
    id_solicitud: string
  ): Promise<GetSolicitudByIdResult> {
    try {
      const solicitud = await this.solicitudRepository.findOneById(
        id_solicitud
      );
      if (!solicitud) {
        return { errors: ["Solicitud not found."] };
      }
      return { solicitud: this.mapToSolicitudDto(solicitud) };
    } catch (err) {
      console.log("error getting solicitud", err);
      return { errors: ["error getting solicitud"] };
    }
  }

  async getSolicitudByCentroCosto(
    centro_costo: number
  ): Promise<GetSolicitudByIdResult> {
    try {
      const solicitud = await this.solicitudRepository.findOneByCentroCosto(
        centro_costo
      );
      if (!solicitud) {
        return { errors: ["Solicitud not found."] };
      }
      return { solicitud: this.mapToSolicitudDto(solicitud) };
    } catch (err) {
      console.log("error getting solicitud by centro_costo", err);
      return { errors: ["error getting solicitud by centro_costo"] };
    }
  }

  async getSolicitudByCorreo(
    correo_solicitante: string
  ): Promise<GetSolicitudByIdResult> {
    try {
      const solicitud = await this.solicitudRepository.findOneByCorreo(
        correo_solicitante.toLowerCase().trim()
      );
      if (!solicitud) {
        return { errors: ["Solicitud not found."] };
      }
      return { solicitud: this.mapToSolicitudDto(solicitud) };
    } catch (err) {
      console.log("error getting solicitud by correo_solicitante", err);
      return { errors: ["error getting solicitud by correo_solicitante"] };
    }
  }

  async updateSolicitud(
    id_solicitud: string,
    dto: UpdateSolicitudDto
  ): Promise<UpdateSolicitudResult> {
    try {
      const existingSolicitud = await this.solicitudRepository.findOneById(
        id_solicitud
      );

      if (!existingSolicitud) {
        return { errors: ["Solicitud not found."] };
      }

      if (dto.correo_solicitante) {
        dto.correo_solicitante = dto.correo_solicitante.toLowerCase().trim();
      }

      const estadoAnterior = existingSolicitud.estado;

      const dataToValidate: UpdateSolicitudDto = {
        titulo:
          dto.titulo !== undefined ? dto.titulo : existingSolicitud.titulo,
        tipo_solicitud:
          dto.tipo_solicitud !== undefined
            ? dto.tipo_solicitud
            : existingSolicitud.tipo_solicitud,
        estado:
          dto.estado !== undefined ? dto.estado : existingSolicitud.estado,
        descripcion:
          dto.descripcion !== undefined
            ? dto.descripcion
            : existingSolicitud.descripcion,
        centro_costo:
          dto.centro_costo !== undefined
            ? dto.centro_costo
            : existingSolicitud.centro_costo,
        fecha_solicitud:
          dto.fecha_solicitud !== undefined
            ? dto.fecha_solicitud
            : existingSolicitud.fecha_solicitud,
        comentario_adicional:
          dto.comentario_adicional !== undefined
            ? dto.comentario_adicional
            : existingSolicitud.comentario_adicional || undefined,
        correo_solicitante:
          dto.correo_solicitante !== undefined
            ? dto.correo_solicitante
            : existingSolicitud.correo_solicitante,
      };

      const errors = await validateSolicitud(
        dataToValidate,
        this.usuarioRepository
      );
      if (errors.length > 0) {
        return { errors };
      }

      const updatedSolicitud = await this.solicitudRepository.save({
        ...dataToValidate,
        id_solicitud,
      } as Solicitud);

      if (dto.estado !== undefined && estadoAnterior !== dto.estado) {
        await this.notifySolicitanteEstadoCambio(
          updatedSolicitud,
          estadoAnterior
        );
      }

      return { solicitud: this.mapToSolicitudDto(updatedSolicitud) };
    } catch (err) {
      console.log("error updating solicitud", err);
      return { errors: ["error updating solicitud"] };
    }
  }

  private async notifySolicitanteEstadoCambio(
    solicitud: Solicitud,
    estadoAnterior: string
  ): Promise<void> {
    try {
      console.log(
        `Sending estado change notification to: ${solicitud.correo_solicitante}`
      );

      const email = this.emailService.createEstadoCambioNotificationEmail(
        solicitud.correo_solicitante,
        {
          id_solicitud: solicitud.id_solicitud,
          titulo: solicitud.titulo,
          tipo_solicitud: solicitud.tipo_solicitud,
          estadoAnterior: estadoAnterior,
          estadoNuevo: solicitud.estado,
          descripcion: solicitud.descripcion,
          fecha_solicitud: solicitud.fecha_solicitud,
          centro_costo: solicitud.centro_costo,
          comentario_adicional: solicitud.comentario_adicional || undefined,
        }
      );

      await this.emailService.sendEmail(email);
    } catch (err) {
      console.error("Error sending estado change notification:", err);
    }
  }

  async deleteSolicitud(id_solicitud: string): Promise<DeleteSolicitudResult> {
    try {
      const result = await this.solicitudRepository.delete(id_solicitud);
      if (result.affected === 0) {
        return { errors: ["Solicitud not found."] };
      }
      return { success: true };
    } catch (err) {
      console.log("error deleting solicitud", err);
      return { errors: ["error deleting solicitud"] };
    }
  }
}
