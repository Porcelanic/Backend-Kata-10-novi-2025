export interface SolicitudDespliegueDto {
  id_solicitud: number;
  link_pull_request: string;
  documentacion_despliegue: string;
  historia_jira: string;
}

export interface GetSolicitudDespliegueByIdResult {
  solicitudDespliegue?: SolicitudDespliegueDto;
  errors?: string[];
}

export interface GetAllSolicitudesDespliegueResult {
  solicitudesDespliegue?: SolicitudDespliegueDto[];
  errors?: string[];
}

export interface UpdateSolicitudDespliegueResult {
  solicitudDespliegue?: SolicitudDespliegueDto;
  errors?: string[];
}

export interface DeleteSolicitudDespliegueResult {
  success?: boolean;
  errors?: string[];
}
