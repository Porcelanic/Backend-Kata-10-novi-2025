import express from "express";
import { solicitudDespliegueController } from "../modules/solicitud_despliegue/controllers/SolicitudDespliegue.controller.index";

const router = express.Router();

router.post("/", (req, res) =>
  solicitudDespliegueController.createSolicitudDespliegue(req, res)
);

router.get("/", (req, res) =>
  solicitudDespliegueController.getAllSolicitudesDespliegue(req, res)
);
router.get("/:id", (req, res) =>
  solicitudDespliegueController.getSolicitudDespliegueById(req, res)
);
router.get("/historia-jira/:historia_jira", (req, res) =>
  solicitudDespliegueController.getSolicitudesDespliegueByHistoriaJira(req, res)
);

router.put("/:id", (req, res) =>
  solicitudDespliegueController.updateSolicitudDespliegue(req, res)
);
router.delete("/:id", (req, res) =>
  solicitudDespliegueController.deleteSolicitudDespliegue(req, res)
);

export default router;
