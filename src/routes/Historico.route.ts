import express from "express";
import { historicoController } from "../modules/historico/controllers/Historico.controller.index";

const router = express.Router();

router.post("/", (req, res) => historicoController.createHistorico(req, res));

router.get("/", (req, res) => historicoController.getAllHistoricos(req, res));
router.get("/:id", (req, res) =>
  historicoController.getHistoricoById(req, res)
);
router.get("/solicitud/:id_solicitud", (req, res) =>
  historicoController.getHistoricosBySolicitudId(req, res)
);

router.get("/aprobador/:correo_aprobador", (req, res) =>
  historicoController.getHistoricosByAprobador(req, res)
);

router.put("/:id", (req, res) => historicoController.updateHistorico(req, res));
router.delete("/:id", (req, res) =>
  historicoController.deleteHistorico(req, res)
);

export default router;
