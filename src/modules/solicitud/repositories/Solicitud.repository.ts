import { AppDataSource } from "../../../database/config/typeorm.config";
import { Solicitud } from "../../../database/entities/Solicitud";
import { Repository, DeleteResult } from "typeorm";
import { SolicitudDto, UpdateSolicitudDto } from "../dtos/SolicitudINS.dtos";

export class SolicitudRepository {
  private repository: Repository<Solicitud>;

  constructor() {
    this.repository = AppDataSource.getRepository(Solicitud);
  }

  async findOneById(id_solicitud: string): Promise<Solicitud | null> {
    return this.repository.findOne({
      where: { id_solicitud },
      relations: ["solicitudAcceso", "solicitudDespliegue"],
    });
  }

  async findOneByCentroCosto(centro_costo: number): Promise<Solicitud | null> {
    return this.repository.findOne({
      where: { centro_costo },
    });
  }

  async findOneByCorreo(correo_solicitante: string): Promise<Solicitud | null> {
    return this.repository.findOne({
      where: { correo_solicitante },
    });
  }

  async findAll(): Promise<Solicitud[]> {
    return this.repository.find({
      relations: ["solicitudAcceso", "solicitudDespliegue"],
    });
  }

  async save(
    solicitud: SolicitudDto | UpdateSolicitudDto | Solicitud
  ): Promise<Solicitud> {
    return this.repository.save(solicitud);
  }

  async delete(id_solicitud: string): Promise<DeleteResult> {
    return this.repository.delete({ id_solicitud });
  }
}
