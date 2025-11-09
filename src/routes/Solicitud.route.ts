import express from "express";
import { solicitudController } from "../modules/solicitud/controllers/Solicitud.controller.index";

const router = express.Router();

router.post("/", (req, res) => solicitudController.createSolicitud(req, res));

router.get("/", (req, res) => solicitudController.getAllSolicitudes(req, res));
router.get("/:id", (req, res) =>
  solicitudController.getSolicitudById(req, res)
);
router.get("/centro_costo/:centro_costo", (req, res) =>
  solicitudController.getSolicitudByCentroCosto(req, res)
);

router.get("/correo_solicitante/:correo_solicitante", (req, res) =>
  solicitudController.getSolicitudByCorreo(req, res)
);

router.put("/:id", (req, res) => solicitudController.updateSolicitud(req, res));
router.delete("/:id", (req, res) =>
  solicitudController.deleteSolicitud(req, res)
);

export default router;
