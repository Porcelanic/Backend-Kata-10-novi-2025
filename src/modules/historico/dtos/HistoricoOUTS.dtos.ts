export interface HistoricoDto {
  id_historico: number;
  fecha_accion: Date;
  comentario_adicional?: string | null;
  id_solicitud: string;
  correo_aprobador: string;
}

export interface GetHistoricoByIdResult {
  historico?: HistoricoDto;
  errors?: string[];
}

export interface GetAllHistoricosResult {
  historicos?: HistoricoDto[];
  errors?: string[];
}

export interface UpdateHistoricoResult {
  historico?: HistoricoDto;
  errors?: string[];
}

export interface DeleteHistoricoResult {
  success?: boolean;
  errors?: string[];
}
