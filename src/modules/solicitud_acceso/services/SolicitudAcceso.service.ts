import { SolicitudAccesoRepository } from "../repositories/SolicitudAcceso.repository";
import {
  SolicitudAccesoDto,
  UpdateSolicitudAccesoDto,
} from "../dtos/SolicitudAccesoINS.dtos";
import {
  SolicitudAccesoDto as SolicitudAccesoOutputDto,
  GetSolicitudAccesoByIdResult,
  GetAllSolicitudesAccesoResult,
  UpdateSolicitudAccesoResult,
  DeleteSolicitudAccesoResult,
} from "../dtos/SolicitudAccesoOUTS.dtos";
import { validateSolicitudAcceso } from "../utils/SolicitudAcceso.validations";
import { SolicitudAcceso } from "../../../database/entities/SolicitudAcceso";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";
import { SolicitudDespliegueRepository } from "../../solicitud_despliegue/repositories/SolicitudDespliegue.repository";
import { validateDisjointConstraint } from "../../solicitud/utils/DisjointValidation";

export class SolicitudAccesoService {
  private solicitudAccesoRepository: SolicitudAccesoRepository;
  private solicitudRepository: SolicitudRepository;
  private solicitudDespliegueRepository: SolicitudDespliegueRepository;

  constructor(
    solicitudAccesoRepository: SolicitudAccesoRepository,
    solicitudRepository: SolicitudRepository,
    solicitudDespliegueRepository: SolicitudDespliegueRepository
  ) {
    this.solicitudAccesoRepository = solicitudAccesoRepository;
    this.solicitudRepository = solicitudRepository;
    this.solicitudDespliegueRepository = solicitudDespliegueRepository;
  }

  private mapToSolicitudAccesoDto(
    solicitudAcceso: SolicitudAcceso
  ): SolicitudAccesoOutputDto {
    return {
      id_solicitud: solicitudAcceso.id_solicitud,
      aplicacion: solicitudAcceso.aplicacion,
      rol_en_aplicacion: solicitudAcceso.rol_en_aplicacion,
    };
  }

  async createSolicitudAcceso(
    dto: SolicitudAccesoDto
  ): Promise<GetSolicitudAccesoByIdResult> {
    try {
      if (
        dto.id_solicitud === undefined ||
        dto.id_solicitud === null ||
        dto.id_solicitud === ""
      ) {
        dto.id_solicitud = ""; // Will fail validation if empty
      }
      const errors = await validateSolicitudAcceso(
        dto,
        this.solicitudRepository
      );
      if (errors.length > 0) {
        return { errors };
      }

      const disjointErrors = await validateDisjointConstraint(
        dto.id_solicitud,
        "acceso",
        this.solicitudAccesoRepository,
        this.solicitudDespliegueRepository
      );
      if (disjointErrors.length > 0) {
        return { errors: disjointErrors };
      }

      const solicitudAcceso = await this.solicitudAccesoRepository.save(dto);
      return {
        solicitudAcceso: this.mapToSolicitudAccesoDto(solicitudAcceso),
      };
    } catch (err) {
      console.log("error creating solicitud acceso", err);
      return { errors: ["error creating solicitud acceso"] };
    }
  }

  async getAllSolicitudesAcceso(): Promise<GetAllSolicitudesAccesoResult> {
    try {
      const solicitudesAcceso = await this.solicitudAccesoRepository.findAll();
      return {
        solicitudesAcceso: solicitudesAcceso.map((sa) =>
          this.mapToSolicitudAccesoDto(sa)
        ),
      };
    } catch (err) {
      console.log("error getting solicitudes acceso", err);
      if (err instanceof Error) {
        return { errors: ["error getting solicitudes acceso", err.message] };
      }
      return { errors: ["error getting solicitudes acceso"] };
    }
  }

  async getSolicitudAccesoById(
    id_solicitud: string
  ): Promise<GetSolicitudAccesoByIdResult> {
    try {
      const solicitudAcceso = await this.solicitudAccesoRepository.findOneById(
        id_solicitud
      );
      if (!solicitudAcceso) {
        return { errors: ["Solicitud Acceso not found."] };
      }
      return {
        solicitudAcceso: this.mapToSolicitudAccesoDto(solicitudAcceso),
      };
    } catch (err) {
      console.log("error getting solicitud acceso", err);
      return { errors: ["error getting solicitud acceso"] };
    }
  }

  async getSolicitudesAccesoByAplicacion(
    aplicacion: string
  ): Promise<GetAllSolicitudesAccesoResult> {
    try {
      const solicitudesAcceso =
        await this.solicitudAccesoRepository.findByAplicacion(aplicacion);
      if (!solicitudesAcceso || solicitudesAcceso.length === 0) {
        return { errors: ["No solicitudes acceso found for this aplicacion."] };
      }
      return {
        solicitudesAcceso: solicitudesAcceso.map((sa) =>
          this.mapToSolicitudAccesoDto(sa)
        ),
      };
    } catch (err) {
      console.log("error getting solicitudes acceso by aplicacion", err);
      return { errors: ["error getting solicitudes acceso by aplicacion"] };
    }
  }

  async updateSolicitudAcceso(
    id_solicitud: string,
    dto: UpdateSolicitudAccesoDto
  ): Promise<UpdateSolicitudAccesoResult> {
    try {
      const existingSolicitudAcceso =
        await this.solicitudAccesoRepository.findOneById(id_solicitud);

      if (!existingSolicitudAcceso) {
        return { errors: ["Solicitud Acceso not found."] };
      }

      const dataToValidate: UpdateSolicitudAccesoDto = {
        aplicacion:
          dto.aplicacion !== undefined
            ? dto.aplicacion
            : existingSolicitudAcceso.aplicacion,
        rol_en_aplicacion:
          dto.rol_en_aplicacion !== undefined
            ? dto.rol_en_aplicacion
            : existingSolicitudAcceso.rol_en_aplicacion,
      };

      const errors = await validateSolicitudAcceso(
        dataToValidate,
        this.solicitudRepository
      );
      if (errors.length > 0) {
        return { errors };
      }

      const updatedSolicitudAcceso = await this.solicitudAccesoRepository.save({
        ...dataToValidate,
        id_solicitud,
      } as SolicitudAcceso);

      return {
        solicitudAcceso: this.mapToSolicitudAccesoDto(updatedSolicitudAcceso),
      };
    } catch (err) {
      console.log("error updating solicitud acceso", err);
      return { errors: ["error updating solicitud acceso"] };
    }
  }

  async deleteSolicitudAcceso(
    id_solicitud: string
  ): Promise<DeleteSolicitudAccesoResult> {
    try {
      const result = await this.solicitudAccesoRepository.delete(id_solicitud);
      if (result.affected === 0) {
        return { errors: ["Solicitud Acceso not found."] };
      }
      return { success: true };
    } catch (err) {
      console.log("error deleting solicitud acceso", err);
      return { errors: ["error deleting solicitud acceso"] };
    }
  }
}
