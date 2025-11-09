import { Request, Response } from "express";
import { UsuarioService } from "../services/Usuario.service";
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  LoginUsuarioDto,
} from "../dtos/UsuarioINS.dtos";

export class UsuarioController {
  private usuarioService: UsuarioService;
  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

  async registerUsuario(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateUsuarioDto = req.body;
      const result = await this.usuarioService.registerUsuario(dto);
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(201).json({ user: result.user });
      }
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async loginUsuario(req: Request, res: Response): Promise<void> {
    try {
      const dto: LoginUsuarioDto = req.body;
      const result = await this.usuarioService.loginUsuario(dto);
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ tokens: result.tokens });
      }
    } catch (err) {
      console.error("Error logging in user:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getAllUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.usuarioService.getAllUsuarios();
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ usuarios: result.usuarios });
      }
    } catch (err) {
      console.error("Error fetching all users:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getUsuarioByCorreo(req: Request, res: Response): Promise<void> {
    try {
      const usuarioCorreo = req.params.correo;
      const result = await this.usuarioService.getUsuarioByCorreo(
        usuarioCorreo
      );
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ usuario: result.usuario });
      }
    } catch (err) {
      console.error("Error fetching user by correo:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async updateUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuarioCorreo = req.params.correo;
      const dto: UpdateUsuarioDto = req.body;
      const result = await this.usuarioService.updateUsuario(
        usuarioCorreo,
        dto
      );
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ usuario: result.usuario });
      }
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async deleteUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuarioCorreo = req.params.correo;
      const result = await this.usuarioService.deleteUsuario(usuarioCorreo);
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
}