import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/Usuario.route";
import solicitudRoutes from "./routes/Solicitud.route";
import historicoRoutes from "./routes/Historico.route";
import solicitudAccesoRoutes from "./routes/SolicitudAcceso.route";
import solicitudDespliegueRoutes from "./routes/SolicitudDespliegue.route";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/usuario", usuarioRoutes);
app.use("/solicitud", solicitudRoutes);
app.use("/historico", historicoRoutes);
app.use("/solicitud-acceso", solicitudAccesoRoutes);
app.use("/solicitud-despliegue", solicitudDespliegueRoutes);

