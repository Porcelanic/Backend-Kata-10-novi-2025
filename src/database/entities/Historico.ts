import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Solicitud } from "./Solicitud";
import { Usuario } from "./Usuario";

@Entity()
export class Historico {
  @PrimaryGeneratedColumn()
  id_historico!: number;

  @Column({ type: "timestamp" })
  fecha_accion!: Date;

  @Column({ type: "text", nullable: true })
  comentario_adicional!: string | null;

  @Column("uuid")
  id_solicitud!: string;

  @Column({ length: 255 })
  correo_aprobador!: string;

  @ManyToOne(() => Solicitud, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_solicitud" })
  solicitud!: Solicitud;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "correo_aprobador" })
  aprobador!: Usuario;
}
