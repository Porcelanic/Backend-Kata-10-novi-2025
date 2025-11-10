import { SolicitudDespliegueRepository } from "../repositories/SolicitudDespliegue.repository";
import {
  SolicitudDespliegueDto,
  UpdateSolicitudDespliegueDto,
} from "../dtos/SolicitudDespliegueINS.dtos";
import {
  SolicitudDespliegueDto as SolicitudDespliegueOutputDto,
  GetSolicitudDespliegueByIdResult,
  GetAllSolicitudesDespliegueResult,
  UpdateSolicitudDespliegueResult,
  DeleteSolicitudDespliegueResult,
} from "../dtos/SolicitudDespliegueOUTS.dtos";
import { validateSolicitudDespliegue } from "../utils/SolicitudDespliegue.validations";
import { SolicitudDespliegue } from "../../../database/entities/SolicitudDespliegue";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";
import { SolicitudAccesoRepository } from "../../solicitud_acceso/repositories/SolicitudAcceso.repository";
import { validateDisjointConstraint } from "../../solicitud/utils/DisjointValidation";

export class SolicitudDespliegueService {
  private solicitudDespliegueRepository: SolicitudDespliegueRepository;
  private solicitudRepository: SolicitudRepository;
  private solicitudAccesoRepository: SolicitudAccesoRepository;

  constructor(
    solicitudDespliegueRepository: SolicitudDespliegueRepository,
    solicitudRepository: SolicitudRepository,
    solicitudAccesoRepository: SolicitudAccesoRepository
  ) {
    this.solicitudDespliegueRepository = solicitudDespliegueRepository;
    this.solicitudRepository = solicitudRepository;
    this.solicitudAccesoRepository = solicitudAccesoRepository;
  }

  private mapToSolicitudDespliegueDto(
    solicitudDespliegue: SolicitudDespliegue
  ): SolicitudDespliegueOutputDto {
    return {
      id_solicitud: solicitudDespliegue.id_solicitud,
      link_pull_request: solicitudDespliegue.link_pull_request,
      documentacion_despliegue: solicitudDespliegue.documentacion_despliegue,
      historia_jira: solicitudDespliegue.historia_jira,
    };
  }

  async createSolicitudDespliegue(
    dto: SolicitudDespliegueDto
  ): Promise<GetSolicitudDespliegueByIdResult> {
    try {
      if (
        dto.id_solicitud === undefined ||
        dto.id_solicitud === null ||
        dto.id_solicitud === ""
      ) {
        dto.id_solicitud = "";
      }
      const errors = await validateSolicitudDespliegue(
        dto,
        this.solicitudRepository
      );
      if (errors.length > 0) {
        return { errors };
      }

      const disjointErrors = await validateDisjointConstraint(
        dto.id_solicitud,
        "despliegue",
        this.solicitudAccesoRepository,
        this.solicitudDespliegueRepository
      );
      if (disjointErrors.length > 0) {
        return { errors: disjointErrors };
      }

      const solicitudDespliegue = await this.solicitudDespliegueRepository.save(
        dto
      );
      return {
        solicitudDespliegue:
          this.mapToSolicitudDespliegueDto(solicitudDespliegue),
      };
    } catch (err) {
      console.log("error creating solicitud despliegue", err);
      return { errors: ["error creating solicitud despliegue"] };
    }
  }

  async getAllSolicitudesDespliegue(): Promise<GetAllSolicitudesDespliegueResult> {
    try {
      const solicitudesDespliegue =
        await this.solicitudDespliegueRepository.findAll();
      return {
        solicitudesDespliegue: solicitudesDespliegue.map((s) =>
          this.mapToSolicitudDespliegueDto(s)
        ),
      };
    } catch (err) {
      console.log("error getting solicitudes despliegue", err);
      if (err instanceof Error) {
        return {
          errors: ["error getting solicitudes despliegue", err.message],
        };
      }
      return { errors: ["error getting solicitudes despliegue"] };
    }
  }

  async getSolicitudDespliegueById(
    id_solicitud: string
  ): Promise<GetSolicitudDespliegueByIdResult> {
    try {
      const solicitudDespliegue =
        await this.solicitudDespliegueRepository.findOneById(id_solicitud);
      if (!solicitudDespliegue) {
        return { errors: ["SolicitudDespliegue not found."] };
      }
      return {
        solicitudDespliegue:
          this.mapToSolicitudDespliegueDto(solicitudDespliegue),
      };
    } catch (err) {
      console.log("error getting solicitud despliegue", err);
      return { errors: ["error getting solicitud despliegue"] };
    }
  }

  async getSolicitudesDespliegueByHistoriaJira(
    historia_jira: string
  ): Promise<GetAllSolicitudesDespliegueResult> {
    try {
      const solicitudesDespliegue =
        await this.solicitudDespliegueRepository.findByHistoriaJira(
          historia_jira
        );
      return {
        solicitudesDespliegue: solicitudesDespliegue.map((s) =>
          this.mapToSolicitudDespliegueDto(s)
        ),
      };
    } catch (err) {
      console.log("error getting solicitudes despliegue by historia_jira", err);
      return {
        errors: ["error getting solicitudes despliegue by historia_jira"],
      };
    }
  }

  async updateSolicitudDespliegue(
    id_solicitud: string,
    dto: UpdateSolicitudDespliegueDto
  ): Promise<UpdateSolicitudDespliegueResult> {
    try {
      const existingSolicitudDespliegue =
        await this.solicitudDespliegueRepository.findOneById(id_solicitud);

      if (!existingSolicitudDespliegue) {
        return { errors: ["SolicitudDespliegue not found."] };
      }

      const dataToValidate: UpdateSolicitudDespliegueDto = {
        link_pull_request:
          dto.link_pull_request !== undefined
            ? dto.link_pull_request
            : existingSolicitudDespliegue.link_pull_request,
        documentacion_despliegue:
          dto.documentacion_despliegue !== undefined
            ? dto.documentacion_despliegue
            : existingSolicitudDespliegue.documentacion_despliegue,
        historia_jira:
          dto.historia_jira !== undefined
            ? dto.historia_jira
            : existingSolicitudDespliegue.historia_jira,
      };

      const errors = await validateSolicitudDespliegue(
        dataToValidate,
        this.solicitudRepository
      );
      if (errors.length > 0) {
        return { errors };
      }

      const updatedSolicitudDespliegue =
        await this.solicitudDespliegueRepository.save({
          ...dataToValidate,
          id_solicitud,
        } as SolicitudDespliegue);

      return {
        solicitudDespliegue: this.mapToSolicitudDespliegueDto(
          updatedSolicitudDespliegue
        ),
      };
    } catch (err) {
      console.log("error updating solicitud despliegue", err);
      return { errors: ["error updating solicitud despliegue"] };
    }
  }

  async deleteSolicitudDespliegue(
    id_solicitud: string
  ): Promise<DeleteSolicitudDespliegueResult> {
    try {
      const result = await this.solicitudDespliegueRepository.delete(
        id_solicitud
      );
      if (result.affected === 0) {
        return { errors: ["SolicitudDespliegue not found."] };
      }
      return { success: true };
    } catch (err) {
      console.log("error deleting solicitud despliegue", err);
      return { errors: ["error deleting solicitud despliegue"] };
    }
  }
}
