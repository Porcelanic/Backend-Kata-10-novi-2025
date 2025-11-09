import { AppDataSource } from "../../../database/config/typeorm.config";
import { SolicitudDespliegue } from "../../../database/entities/SolicitudDespliegue";
import { Repository, DeleteResult } from "typeorm";
import {
  SolicitudDespliegueDto,
  UpdateSolicitudDespliegueDto,
} from "../dtos/SolicitudDespliegueINS.dtos";

export class SolicitudDespliegueRepository {
  private repository: Repository<SolicitudDespliegue>;

  constructor() {
    this.repository = AppDataSource.getRepository(SolicitudDespliegue);
  }

  async findOneById(id_solicitud: number): Promise<SolicitudDespliegue | null> {
    return this.repository.findOne({
      where: { id_solicitud },
      relations: ["solicitud"],
    });
  }

  async findByHistoriaJira(
    historia_jira: string
  ): Promise<SolicitudDespliegue[]> {
    return this.repository.find({
      where: { historia_jira },
      relations: ["solicitud"],
    });
  }

  async findAll(): Promise<SolicitudDespliegue[]> {
    return this.repository.find({
      relations: ["solicitud"],
    });
  }

  async save(
    solicitudDespliegue:
      | SolicitudDespliegueDto
      | UpdateSolicitudDespliegueDto
      | SolicitudDespliegue
  ): Promise<SolicitudDespliegue> {
    return this.repository.save(solicitudDespliegue);
  }

  async delete(id_solicitud: number): Promise<DeleteResult> {
    return this.repository.delete({ id_solicitud });
  }
}
