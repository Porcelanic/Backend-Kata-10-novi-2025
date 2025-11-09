import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Solicitud } from "./Solicitud";
import { Historico } from "./Historico";

@Entity()
export class Usuario {
  @PrimaryColumn({ length: 255 })
  correo!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 50 })
  cargo!: string;

  @Column({ length: 255 })
  contrasena!: string;

  @Column({ type: "int", width: 4 })
  centro_costos!: number;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.usuario)
  solicitudes!: Solicitud[];

  @OneToMany(() => Historico, (historico) => historico.aprobador)
  historicosAprobados!: Historico[];
}
