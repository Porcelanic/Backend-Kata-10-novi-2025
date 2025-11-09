export const TIPOS_SOLICITUD = {
  ACCESO: "acceso",
  DESPLIEGUE: "despliegue",
} as const;

export const TIPOS_SOLICITUD_VALIDOS = Object.values(TIPOS_SOLICITUD);

export function isValidTipoSolicitud(tipo: string): boolean {
  return TIPOS_SOLICITUD_VALIDOS.includes(tipo.toLowerCase().trim() as any);
}

export type TipoSolicitud =
  (typeof TIPOS_SOLICITUD)[keyof typeof TIPOS_SOLICITUD];
