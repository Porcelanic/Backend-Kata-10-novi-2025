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

export class SolicitudService {
  private solicitudRepository: SolicitudRepository;
  private usuarioRepository: UsuarioRepository;

  constructor(
    solicitudRepository: SolicitudRepository,
    usuarioRepository: UsuarioRepository
  ) {
    this.solicitudRepository = solicitudRepository;
    this.usuarioRepository = usuarioRepository;
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
      return { solicitud: this.mapToSolicitudDto(solicitud) };
    } catch (err) {
      console.log("error creating solicitud", err);
      return { errors: ["error creating solicitud"] };
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
    id_solicitud: number
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
    id_solicitud: number,
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

      return { solicitud: this.mapToSolicitudDto(updatedSolicitud) };
    } catch (err) {
      console.log("error updating solicitud", err);
      return { errors: ["error updating solicitud"] };
    }
  }

  async deleteSolicitud(id_solicitud: number): Promise<DeleteSolicitudResult> {
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
