import { AppDataSource } from "../../../database/config/typeorm.config";
import { SolicitudAcceso } from "../../../database/entities/SolicitudAcceso";
import { Repository, DeleteResult } from "typeorm";
import {
  SolicitudAccesoDto,
  UpdateSolicitudAccesoDto,
} from "../dtos/SolicitudAccesoINS.dtos";

export class SolicitudAccesoRepository {
  private repository: Repository<SolicitudAcceso>;

  constructor() {
    this.repository = AppDataSource.getRepository(SolicitudAcceso);
  }

  async findOneById(id_solicitud: number): Promise<SolicitudAcceso | null> {
    return this.repository.findOne({
      where: { id_solicitud },
      relations: ["solicitud"],
    });
  }

  async findByAplicacion(aplicacion: string): Promise<SolicitudAcceso[]> {
    return this.repository.find({
      where: { aplicacion },
      relations: ["solicitud"],
    });
  }

  async findAll(): Promise<SolicitudAcceso[]> {
    return this.repository.find({
      relations: ["solicitud"],
    });
  }

  async save(
    solicitudAcceso:
      | SolicitudAccesoDto
      | UpdateSolicitudAccesoDto
      | SolicitudAcceso
  ): Promise<SolicitudAcceso> {
    return this.repository.save(solicitudAcceso);
  }

  async delete(id_solicitud: number): Promise<DeleteResult> {
    return this.repository.delete({ id_solicitud });
  }
}
