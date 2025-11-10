import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Solicitud } from "./Solicitud";

@Entity()
export class SolicitudDespliegue {
  @PrimaryColumn("uuid")
  id_solicitud!: string;

  @Column({ length: 255 })
  link_pull_request!: string;

  @Column({ length: 255 })
  documentacion_despliegue!: string;

  @Column({ length: 255 })
  historia_jira!: string;

  @OneToOne(() => Solicitud, (solicitud) => solicitud.solicitudDespliegue, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_solicitud" })
  solicitud!: Solicitud;
}
