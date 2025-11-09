import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Solicitud } from "./Solicitud";

@Entity()
export class SolicitudAcceso {
  @PrimaryColumn()
  id_solicitud!: number;

  @Column({ length: 100 })
  aplicacion!: string;

  @Column({ length: 100 })
  rol_en_aplicacion!: string;

  @OneToOne(() => Solicitud)
  @JoinColumn({ name: "id_solicitud" })
  solicitud!: Solicitud;
}
