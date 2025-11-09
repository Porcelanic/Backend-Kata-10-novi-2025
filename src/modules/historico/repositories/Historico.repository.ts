import { AppDataSource } from "../../../database/config/typeorm.config";
import { Historico } from "../../../database/entities/Historico";
import { Repository, DeleteResult } from "typeorm";
import { HistoricoDto, UpdateHistoricoDto } from "../dtos/HistoricoINS.dtos";

export class HistoricoRepository {
  private repository: Repository<Historico>;

  constructor() {
    this.repository = AppDataSource.getRepository(Historico);
  }

  async findOneById(id_historico: number): Promise<Historico | null> {
    return this.repository.findOne({
      where: { id_historico },
      relations: ["solicitud", "aprobador"],
    });
  }

  async findBySolicitudId(id_solicitud: string): Promise<Historico[]> {
    return this.repository.find({
      where: { id_solicitud },
      relations: ["solicitud", "aprobador"],
    });
  }

  async findByAprobador(correo_aprobador: string): Promise<Historico[]> {
    return this.repository.find({
      where: { correo_aprobador },
      relations: ["solicitud", "aprobador"],
    });
  }

  async findAll(): Promise<Historico[]> {
    return this.repository.find({
      relations: ["solicitud", "aprobador"],
    });
  }

  async save(
    historico: HistoricoDto | UpdateHistoricoDto | Historico
  ): Promise<Historico> {
    return this.repository.save(historico);
  }

  async delete(id_historico: number): Promise<DeleteResult> {
    return this.repository.delete({ id_historico });
  }
}
