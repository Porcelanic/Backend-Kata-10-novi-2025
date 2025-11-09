import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Usuario } from "../entities/Usuario";
import { Historico } from "../entities/Historico";
import { Solicitud } from "../entities/Solicitud";
import { SolicitudAcceso } from "../entities/SolicitudAcceso";
import { SolicitudDespliegue } from "../entities/SolicitudDespliegue";

dotenv.config();

const requiredEnvVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Usuario, Historico, Solicitud, SolicitudAcceso, SolicitudDespliegue],
  migrations: [],
  subscribers: [],
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});
