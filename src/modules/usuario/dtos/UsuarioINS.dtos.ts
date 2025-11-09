export interface CreateUsuarioDto {
  correo: string;
  nombre: string;
  cargo: string;
  contrasena: string;
  centro_costos: number;
}

export interface UpdateUsuarioDto {
  correo?: string;
  nombre?: string;
  cargo?: string;
  contrasena?: string;
  centro_costos?: number;
}

export interface LoginUsuarioDto {
  correo: string;
  contrasena: string;
}
