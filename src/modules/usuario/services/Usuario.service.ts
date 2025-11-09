import bcrypt from "bcryptjs";
import { UsuarioRepository } from "../repositories/Usuario.repository";
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  LoginUsuarioDto,
} from "../dtos/UsuarioINS.dtos";
import {
  UsuarioDto,
  RegisterUsuarioResult,
  LoginUsuarioResult,
  GetAllUsuariosResult,
  GetUsuarioByCorreoResult,
  UpdateUsuarioResult,
  DeleteUsuarioResult,
} from "../dtos/UsuarioOUTS.dtos";
import { validateUsuario, validateLogin } from "../utils/Usuario.validations";
import { Usuario } from "../../../database/entities/Usuario";

export class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor(usuarioRepository: UsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  private mapToUsuarioDto(usuario: Usuario): UsuarioDto {
    return {
      correo: usuario.correo,
      nombre: usuario.nombre,
      cargo: usuario.cargo,
      contrasena: usuario.contrasena,
      centro_costos: usuario.centro_costos,
    };
  }

  async registerUsuario(dto: CreateUsuarioDto): Promise<RegisterUsuarioResult> {
    try {
      if(dto.correo){
        dto.correo = dto.correo.toLowerCase().trim();
      }
      const errors = await validateUsuario(this.usuarioRepository, dto, false);
      if (errors.length > 0) {
        return { errors };
      }

      const hashedPassword = await bcrypt.hash(dto.contrasena, 10);
      dto.contrasena = hashedPassword;

      const usuario = await this.usuarioRepository.save(dto);
      return { user: { correo: usuario.correo } };
    } catch (err) {
      console.log("error registering usuario", err);
      return { errors: ["error registering usuario"] };
    }
  }

  async loginUsuario(dto: LoginUsuarioDto): Promise<LoginUsuarioResult> {
    try {
      if(dto.correo){
        dto.correo = dto.correo.toLowerCase().trim();
      }
      const errors = validateLogin(dto);
      if (errors.length > 0) {
        return { errors };
      }

      const usuario = await this.usuarioRepository.findOneByCorreo(dto.correo);
      if (
        !usuario ||
        !(await bcrypt.compare(dto.contrasena, usuario.contrasena))
      ) {
        return { errors: ["Invalid correo or contrasena."] };
      }

      return {
        tokens: { nombre: usuario.nombre, correo: usuario.correo, cargo: usuario.cargo, centro_costos: usuario.centro_costos},
      };
    } catch (err) {
      console.log("error logging in usuario", err);
      return { errors: ["error logging in usuario"] };
    }
  }

  async getAllUsuarios(): Promise<GetAllUsuariosResult> {
    try {
      const usuarios = await this.usuarioRepository.findAll();
      return { usuarios: usuarios };
    } catch (err) {
      console.log("error getting usuarios", err);
      if (err instanceof Error) {
        return { errors: ["error getting usuarios", err.message] };
      }
      return { errors: ["error getting usuarios"] };
    }
  }

  async getUsuarioByCorreo(correo: string): Promise<GetUsuarioByCorreoResult> {
    try {
      correo = correo.toLowerCase().trim();
      const usuario = await this.usuarioRepository.findOneByCorreo(correo);
      if (!usuario) {
        return { errors: ["Usuario not found."] };
      }
      return { usuario: this.mapToUsuarioDto(usuario) };
    } catch (err) {
      console.log("error getting usuario", err);
      return { errors: ["error getting usuario"] };
    }
  }

  async updateUsuario(
    correo: string,
    dto: UpdateUsuarioDto
  ): Promise<UpdateUsuarioResult> {
    try {
      correo = correo.toLowerCase().trim();
      let targetCorreo = dto.correo ? dto.correo.toLowerCase().trim() : correo;
      console.log("targetCorreo", targetCorreo);
      let existingUsuario = await this.usuarioRepository.findOneByCorreo(
        targetCorreo
      );
      console.log("existingUsuario", existingUsuario);
      if (dto.correo) {
        dto.correo = dto.correo.toLowerCase().trim();
        if (existingUsuario && existingUsuario.correo !== correo) {
          return { errors: ["An usuario with this correo already exists."] };
        }
        if (!existingUsuario) {
          existingUsuario = await this.usuarioRepository.findOneByCorreo(
            correo
          );
        } else if (existingUsuario.correo !== correo) {
          existingUsuario = await this.usuarioRepository.findOneByCorreo(
            correo
          );
        }
      } else {
        existingUsuario = await this.usuarioRepository.findOneByCorreo(correo);
      }

      if (!existingUsuario) {
        return { errors: ["Usuario not found."] };
      }
      console.log("dto", dto);
      const dataToValidate = {
        correo: dto.correo !== undefined ? dto.correo : existingUsuario.correo,
        nombre: dto.nombre !== undefined ? dto.nombre : existingUsuario.nombre,
        cargo: dto.cargo !== undefined ? dto.cargo : existingUsuario.cargo,
        contrasena: dto.contrasena !== undefined ? dto.contrasena : undefined,
        centro_costos:
          dto.centro_costos !== undefined
            ? dto.centro_costos
            : existingUsuario.centro_costos,
      };

      const errors = await validateUsuario(
        this.usuarioRepository,
        dataToValidate,
        true
      );
      if (errors.length > 0) {
        return { errors };
      }
      dto = dataToValidate;
      if (dto.contrasena) {
        const hashedPassword = await bcrypt.hash(dto.contrasena, 10);
        dto.contrasena = hashedPassword;
      } else {
        dto.contrasena = existingUsuario.contrasena;
      }
      console.log("dto before save", dto);
      const updatedUsuario = await this.usuarioRepository.save(dto);
      if (!updatedUsuario) {
        return { errors: ["Usuario not found."] };
      }
      if (updatedUsuario.correo !== correo) {
        await this.usuarioRepository.deleteUsuario(correo);
      }
      return { usuario: this.mapToUsuarioDto(updatedUsuario) };
    } catch (err) {
      console.log("error updating usuario", err);
      return { errors: ["error updating usuario"] };
    }
  }

  async deleteUsuario(correo: string): Promise<DeleteUsuarioResult> {
    try {
      correo = correo.toLowerCase().trim();
      const result = await this.usuarioRepository.deleteUsuario(correo);
      if (result.affected === 0) {
        return { errors: ["Usuario not found."] };
      }
      return { success: true };
    } catch (err) {
      console.log("error deleting usuario", err);
      return { errors: ["error deleting usuario"] };
    }
  }
}
