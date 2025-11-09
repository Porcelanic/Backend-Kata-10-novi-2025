import "reflect-metadata";
import express from "express";
import serverless from "serverless-http";
import solicitudAccesoRoutes from "../../routes/SolicitudAcceso.route";
import cors from "cors";
import { AppDataSource } from "../../database/config/typeorm.config";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/solicitud-acceso", solicitudAccesoRoutes);

let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("Solicitud Acceso Lambda: Database connected");
    } catch (error) {
      console.error(
        "Solicitud Acceso Lambda: Error during Data Source initialization:",
        error
      );
      throw error;
    }
  }
};

const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  await initializeDatabase();
  return serverlessHandler(event, context);
};
