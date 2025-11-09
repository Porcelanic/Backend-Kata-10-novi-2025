export interface SolicitudDto {
  id_solicitud: number;
  titulo: string;
  tipo_solicitud: string;
  estado: string;
  descripcion: string;
  centro_costo: number;
  fecha_solicitud: Date;
  comentario_adicional?: string;
  correo_solicitante: string;
  solicitudAcceso?: {
    id_solicitud: number;
    aplicacion: string;
    rol_en_aplicacion: string;
  };
  solicitudDespliegue?: {
    id_solicitud: number;
    link_pull_request: string;
    documentacion_despliegue: string;
    historia_jira: string;
  };
}

export interface GetSolicitudByIdResult {
  solicitud?: SolicitudDto;
  errors?: string[];
}

export interface GetAllSolicitudesResult {
  solicitudes?: SolicitudDto[];
  errors?: string[];
}

export interface UpdateSolicitudResult {
  solicitud?: SolicitudDto;
  errors?: string[];
}

export interface DeleteSolicitudResult {
  success?: boolean;
  errors?: string[];
}
