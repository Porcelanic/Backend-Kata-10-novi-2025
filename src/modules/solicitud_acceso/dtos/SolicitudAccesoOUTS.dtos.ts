export interface SolicitudAccesoDto {
  id_solicitud: number;
  aplicacion: string;
  rol_en_aplicacion: string;
}

export interface GetSolicitudAccesoByIdResult {
  solicitudAcceso?: SolicitudAccesoDto;
  errors?: string[];
}

export interface GetAllSolicitudesAccesoResult {
  solicitudesAcceso?: SolicitudAccesoDto[];
  errors?: string[];
}

export interface UpdateSolicitudAccesoResult {
  solicitudAcceso?: SolicitudAccesoDto;
  errors?: string[];
}

export interface DeleteSolicitudAccesoResult {
  success?: boolean;
  errors?: string[];
}
