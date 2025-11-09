import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Solicitud } from "./Solicitud";

@Entity()
export class SolicitudDespliegue {
  @PrimaryColumn()
  id_solicitud!: number;

  @Column({ length: 255 })
  link_pull_request!: string;

  @Column({ length: 255 })
  documentacion_despliegue!: string;

  @Column({ length: 255 })
  historia_jira!: string;

  @OneToOne(() => Solicitud, (solicitud) => solicitud.solicitudDespliegue)
  @JoinColumn({ name: "id_solicitud" })
  solicitud!: Solicitud;
}
