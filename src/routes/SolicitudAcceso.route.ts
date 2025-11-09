import express from "express";
import { solicitudAccesoController } from "../modules/solicitud_acceso/controllers/SolicitudAcceso.controller.index";

const router = express.Router();

router.post("/", (req, res) =>
  solicitudAccesoController.createSolicitudAcceso(req, res)
);

router.get("/", (req, res) =>
  solicitudAccesoController.getAllSolicitudesAcceso(req, res)
);
router.get("/:id", (req, res) =>
  solicitudAccesoController.getSolicitudAccesoById(req, res)
);
router.get("/aplicacion/:aplicacion", (req, res) =>
  solicitudAccesoController.getSolicitudesAccesoByAplicacion(req, res)
);

router.put("/:id", (req, res) =>
  solicitudAccesoController.updateSolicitudAcceso(req, res)
);
router.delete("/:id", (req, res) =>
  solicitudAccesoController.deleteSolicitudAcceso(req, res)
);

export default router;
