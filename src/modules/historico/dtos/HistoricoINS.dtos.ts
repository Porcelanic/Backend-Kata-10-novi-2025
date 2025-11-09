export interface HistoricoDto {
  fecha_accion: Date;
  comentario_adicional?: string | null;
  id_solicitud: string;
  correo_aprobador: string;
}

export interface UpdateHistoricoDto {
  fecha_accion?: Date;
  comentario_adicional?: string | null;
  id_solicitud?: string;
  correo_aprobador?: string;
}
