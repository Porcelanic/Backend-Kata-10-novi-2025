import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/Usuario.route";
import solicitudRoutes from "./routes/Solicitud.route";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/usuario", usuarioRoutes);
app.use("/solicitud", solicitudRoutes);

