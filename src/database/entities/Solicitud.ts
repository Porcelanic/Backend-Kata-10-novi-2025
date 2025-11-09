import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Generated,
} from "typeorm";
import { Usuario } from "./Usuario";
import { SolicitudAcceso } from "./SolicitudAcceso";
import { SolicitudDespliegue } from "./SolicitudDespliegue";
import { Historico } from "./Historico";

@Entity()
export class Solicitud {
  @PrimaryGeneratedColumn("uuid")
  id_solicitud!: string;

  @Column({ length: 100 })
  titulo!: string;

  @Column({ length: 50 })
  tipo_solicitud!: string;

  @Column({ length: 50 })
  estado!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ type: "int", width: 4 })
  centro_costo!: number;

  @Column({ type: "timestamp" })
  fecha_solicitud!: Date;

  @Column({ type: "text", nullable: true })
  comentario_adicional!: string | null;

  @Column({ length: 255 })
  correo_solicitante!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
  @JoinColumn({ name: "correo_solicitante" })
  usuario!: Usuario;

  @OneToOne(
    () => SolicitudAcceso,
    (solicitudAcceso) => solicitudAcceso.solicitud
  )
  solicitudAcceso?: SolicitudAcceso;

  @OneToOne(
    () => SolicitudDespliegue,
    (solicitudDespliegue) => solicitudDespliegue.solicitud
  )
  solicitudDespliegue?: SolicitudDespliegue;

  @OneToMany(() => Historico, (historico) => historico.solicitud)
  historicos!: Historico[];
}
