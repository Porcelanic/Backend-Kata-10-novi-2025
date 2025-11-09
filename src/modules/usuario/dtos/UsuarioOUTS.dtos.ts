export interface UsuarioDto {
  correo: string;
  nombre: string;
  cargo: string;
  contrasena: string;
  centro_costos: number;
}

export interface RegisterUsuarioResult {
  errors?: string[];
  user?: {
    correo: string;
  };
}

export interface LoginUsuarioResult {
  errors?: string[];
  tokens?: {
    nombre: string;
    correo: string;
    cargo: string;
    centro_costos: number;
  };
}

export interface GetAllUsuariosResult {
  usuarios?: UsuarioDto[];
  errors?: string[];
}

export interface GetUsuarioByCorreoResult {
  usuario?: UsuarioDto;
  errors?: string[];
}

export interface UpdateUsuarioResult {
  usuario?: UsuarioDto;
  errors?: string[];
}

export interface DeleteUsuarioResult {
  success?: boolean;
  errors?: string[];
}
