export interface SolicitudAccesoDto {
  id_solicitud: string;
  aplicacion: string;
  rol_en_aplicacion: string;
}

export interface UpdateSolicitudAccesoDto {
  aplicacion?: string;
  rol_en_aplicacion?: string;
}
