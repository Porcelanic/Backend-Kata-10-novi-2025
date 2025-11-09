import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  LoginUsuarioDto,
} from "../dtos/UsuarioINS.dtos";
import { UsuarioRepository } from "../repositories/Usuario.repository";

export function validatecontrasena(contrasena: string): string[] {
  const errors: string[] = [];
  if (!contrasena || contrasena.length < 8) {
    errors.push("The contrasena must be at least 8 characters long.");
  }

  const uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(contrasena)) {
    errors.push("The contrasena must have at least one uppercase letter.");
  }

  const specialCharRegex = /[!@#$%^+&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(contrasena)) {
    errors.push("The contrasena must have at least one special character.");
  }
  return errors;
}

export async function validateUsuario(
  usuarioRepository: UsuarioRepository,
  dto: any,
  updating: boolean = false
): Promise<string[]> {
  let errors: string[] = [];

  if (!dto.correo) {
    errors.push("Correo is required.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.correo)) {
      errors.push("Must be a valid email for correo.");
    } else {
      dto.correo = dto.correo.toLowerCase().trim();
      if (!updating) {
        const existingUsuario = await usuarioRepository.findOneByCorreo(
          dto.correo
        );
        if (existingUsuario) {
          errors.push("A usuario with this correo already exists.");
        }
      }
    }
  }

  if (!dto.nombre || dto.nombre.trim() === "") {
    errors.push("Nombre is required.");
  } else if (dto.nombre.length > 63) {
    errors.push("Nombre cannot exceed 63 characters.");
  }

  if (!updating) {
    if (!dto.contrasena) {
      errors.push("contrasena is required.");
    } else {
      errors = errors.concat(validatecontrasena(dto.contrasena));
    }
  } else {
    if (
      dto.contrasena !== undefined &&
      dto.contrasena !== null &&
      dto.contrasena !== ""
    ) {
      errors = errors.concat(validatecontrasena(dto.contrasena));
    }
  }

  if (!dto.cargo || dto.cargo.trim() === "") {
    errors.push("Cargo is required.");
  } else if (dto.cargo.length > 63) {
    errors.push("Cargo cannot exceed 63 characters.");
  }

  if (dto.centro_costos === undefined || dto.centro_costos === null) {
    errors.push("Centro_costos is required.");
  } else if (typeof dto.centro_costos !== "number") {
    errors.push("Centro_costos must be a number.");
  } else if (dto.centro_costos < 1000 || dto.centro_costos > 9999) {
    errors.push("Centro_costos must be a 4-digit number.");
  }

  return errors;
}

export function validateLogin(dto: LoginUsuarioDto): string[] {
  const errors: string[] = [];

  if (!dto.correo) {
    errors.push("Correo is required.");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.correo)) {
      errors.push("Must be a valid email for correo.");
    }
  }

  if (!dto.contrasena) {
    errors.push("contrasena is required.");
  }

  return errors;
}
