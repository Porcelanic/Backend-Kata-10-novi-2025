import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Solicitud } from "./Solicitud";

@Entity()
export class SolicitudAcceso {
  @PrimaryColumn("uuid")
  id_solicitud!: string;

  @Column({ length: 100 })
  aplicacion!: string;

  @Column({ length: 100 })
  rol_en_aplicacion!: string;

  @OneToOne(() => Solicitud, (solicitud) => solicitud.solicitudAcceso, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_solicitud" })
  solicitud!: Solicitud;
}
