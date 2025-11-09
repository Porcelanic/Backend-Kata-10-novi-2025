import "reflect-metadata";
import express from "express";
import serverless from "serverless-http";
import historicoRoutes from "../../routes/Historico.route";
import { corsMiddleware } from "../../utils/cors";
import { AppDataSource } from "../../database/config/typeorm.config";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/historico", historicoRoutes);

let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("Historico Lambda: Database connected");
    } catch (error) {
      console.error(
        "Historico Lambda: Error during Data Source initialization:",
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
