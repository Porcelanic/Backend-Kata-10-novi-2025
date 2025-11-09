import { UsuarioController } from "./Usuario.controller";
import { UsuarioService } from "../services/Usuario.service";
import { UsuarioRepository } from "../repositories/Usuario.repository";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

export { usuarioController };
