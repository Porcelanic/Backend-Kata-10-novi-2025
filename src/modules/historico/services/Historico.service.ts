import { HistoricoRepository } from "../repositories/Historico.repository";
import { HistoricoDto, UpdateHistoricoDto } from "../dtos/HistoricoINS.dtos";
import {
  HistoricoDto as HistoricoOutputDto,
  GetHistoricoByIdResult,
  GetAllHistoricosResult,
  UpdateHistoricoResult,
  DeleteHistoricoResult,
} from "../dtos/HistoricoOUTS.dtos";
import { validateHistorico } from "../utils/Historico.validations";
import { Historico } from "../../../database/entities/Historico";
import { UsuarioRepository } from "../../usuario/repositories/Usuario.repository";
import { SolicitudRepository } from "../../solicitud/repositories/Solicitud.repository";

export class HistoricoService {
  private historicoRepository: HistoricoRepository;
  private usuarioRepository: UsuarioRepository;
  private solicitudRepository: SolicitudRepository;

  constructor(
    historicoRepository: HistoricoRepository,
    usuarioRepository: UsuarioRepository,
    solicitudRepository: SolicitudRepository
  ) {
    this.historicoRepository = historicoRepository;
    this.usuarioRepository = usuarioRepository;
    this.solicitudRepository = solicitudRepository;
  }

  private mapToHistoricoDto(historico: Historico): HistoricoOutputDto {
    return {
      id_historico: historico.id_historico,
      fecha_accion: historico.fecha_accion,
      comentario_adicional: historico.comentario_adicional || undefined,
      id_solicitud: historico.id_solicitud,
      correo_aprobador: historico.correo_aprobador,
    };
  }

  async createHistorico(dto: HistoricoDto): Promise<GetHistoricoByIdResult> {
    try {
      if (dto.correo_aprobador) {
        dto.correo_aprobador = dto.correo_aprobador.toLowerCase().trim();
      }
      const errors = await validateHistorico(
        dto,
        this.usuarioRepository,
        this.solicitudRepository
      );
      if (errors.length > 0) {
        return { errors };
      }

      const historico = await this.historicoRepository.save(dto);
      return { historico: this.mapToHistoricoDto(historico) };
    } catch (err) {
      console.log("error creating historico", err);
      return { errors: ["error creating historico"] };
    }
  }

  async getAllHistoricos(): Promise<GetAllHistoricosResult> {
    try {
      const historicos = await this.historicoRepository.findAll();
      return {
        historicos: historicos.map((h) => this.mapToHistoricoDto(h)),
      };
    } catch (err) {
      console.log("error getting historicos", err);
      if (err instanceof Error) {
        return { errors: ["error getting historicos", err.message] };
      }
      return { errors: ["error getting historicos"] };
    }
  }

  async getHistoricoById(
    id_historico: number
  ): Promise<GetHistoricoByIdResult> {
    try {
      const historico = await this.historicoRepository.findOneById(
        id_historico
      );
      if (!historico) {
        return { errors: ["Historico not found."] };
      }
      return { historico: this.mapToHistoricoDto(historico) };
    } catch (err) {
      console.log("error getting historico", err);
      return { errors: ["error getting historico"] };
    }
  }

  async getHistoricosBySolicitudId(
    id_solicitud: string
  ): Promise<GetAllHistoricosResult> {
    try {
      const historicos = await this.historicoRepository.findBySolicitudId(
        id_solicitud
      );
      if (!historicos || historicos.length === 0) {
        return { errors: ["No historicos found for this solicitud."] };
      }
      return {
        historicos: historicos.map((h) => this.mapToHistoricoDto(h)),
      };
    } catch (err) {
      console.log("error getting historicos by solicitud_id", err);
      return { errors: ["error getting historicos by solicitud_id"] };
    }
  }

  async getHistoricosByAprobador(
    correo_aprobador: string
  ): Promise<GetAllHistoricosResult> {
    try {
      const historicos = await this.historicoRepository.findByAprobador(
        correo_aprobador.toLowerCase().trim()
      );
      if (!historicos || historicos.length === 0) {
        return { errors: ["No historicos found for this aprobador."] };
      }
      return {
        historicos: historicos.map((h) => this.mapToHistoricoDto(h)),
      };
    } catch (err) {
      console.log("error getting historicos by correo_aprobador", err);
      return { errors: ["error getting historicos by correo_aprobador"] };
    }
  }

  async updateHistorico(
    id_historico: number,
    dto: UpdateHistoricoDto
  ): Promise<UpdateHistoricoResult> {
    try {
      const existingHistorico = await this.historicoRepository.findOneById(
        id_historico
      );

      if (!existingHistorico) {
        return { errors: ["Historico not found."] };
      }

      if (dto.correo_aprobador) {
        dto.correo_aprobador = dto.correo_aprobador.toLowerCase().trim();
      }

      const dataToValidate: UpdateHistoricoDto = {
        fecha_accion:
          dto.fecha_accion !== undefined
            ? dto.fecha_accion
            : existingHistorico.fecha_accion,
        comentario_adicional:
          dto.comentario_adicional !== undefined
            ? dto.comentario_adicional
            : existingHistorico.comentario_adicional || undefined,
        id_solicitud:
          dto.id_solicitud !== undefined
            ? dto.id_solicitud
            : existingHistorico.id_solicitud,
        correo_aprobador:
          dto.correo_aprobador !== undefined
            ? dto.correo_aprobador
            : existingHistorico.correo_aprobador,
      };

      const errors = await validateHistorico(
        dataToValidate,
        this.usuarioRepository,
        this.solicitudRepository
      );
      if (errors.length > 0) {
        return { errors };
      }

      const updatedHistorico = await this.historicoRepository.save({
        ...dataToValidate,
        id_historico,
      } as Historico);

      return { historico: this.mapToHistoricoDto(updatedHistorico) };
    } catch (err) {
      console.log("error updating historico", err);
      return { errors: ["error updating historico"] };
    }
  }

  async deleteHistorico(id_historico: number): Promise<DeleteHistoricoResult> {
    try {
      const result = await this.historicoRepository.delete(id_historico);
      if (result.affected === 0) {
        return { errors: ["Historico not found."] };
      }
      return { success: true };
    } catch (err) {
      console.log("error deleting historico", err);
      return { errors: ["error deleting historico"] };
    }
  }
}
