import { AppDataSource } from "../../../database/config/typeorm.config";
import { Usuario } from "../../../database/entities/Usuario";
import { Repository, DeleteResult } from "typeorm";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dtos/UsuarioINS.dtos";

export class UsuarioRepository {
  private repository: Repository<Usuario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuario);
  }

  async findOneByCorreo(correo: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { correo },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.repository.find();
  }

  async save(usuario: CreateUsuarioDto | UpdateUsuarioDto): Promise<Usuario> {
    return this.repository.save(usuario);
  }

  async deleteUsuario(correo: string): Promise<DeleteResult> {
    return this.repository.delete({ correo });
  }
}
