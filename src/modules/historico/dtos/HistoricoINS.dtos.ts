export interface HistoricoDto {
  fecha_accion: Date;
  comentario_adicional?: string | null;
  id_solicitud: number;
  correo_aprobador: string;
}

export interface UpdateHistoricoDto {
  fecha_accion?: Date;
  comentario_adicional?: string | null;
  id_solicitud?: number;
  correo_aprobador?: string;
}
