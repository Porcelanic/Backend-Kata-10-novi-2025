import express from "express";
import { usuarioController } from "../modules/usuario/controllers/Usuario.controller.index";

const router = express.Router();

router.post("/register", (req, res) =>
  usuarioController.registerUsuario(req, res)
);
router.post("/login", (req, res) => usuarioController.loginUsuario(req, res));

router.get("/", (req, res) => usuarioController.getAllUsuarios(req, res));
router.get("/:correo", (req, res) =>
  usuarioController.getUsuarioByCorreo(req, res)
);
router.put("/:correo", (req, res) => usuarioController.updateUsuario(req, res));
router.delete("/:correo", (req, res) =>
  usuarioController.deleteUsuario(req, res)
);

export default router;
