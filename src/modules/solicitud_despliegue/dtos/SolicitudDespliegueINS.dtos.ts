export interface SolicitudDespliegueDto {
  id_solicitud: number;
  link_pull_request: string;
  documentacion_despliegue: string;
  historia_jira: string;
}

export interface UpdateSolicitudDespliegueDto {
  link_pull_request?: string;
  documentacion_despliegue?: string;
  historia_jira?: string;
}
