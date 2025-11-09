export interface SolicitudDto {
  titulo: string;
  tipo_solicitud: string;
  estado: string;
  descripcion: string;
  centro_costo: number;
  fecha_solicitud: Date;
  comentario_adicional?: string;
  correo_solicitante: string;
}

export interface UpdateSolicitudDto {
  titulo?: string;
  tipo_solicitud?: string;
  estado?: string;
  descripcion?: string;
  centro_costo?: number;
  fecha_solicitud?: Date;
  comentario_adicional?: string;
  correo_solicitante?: string;
}