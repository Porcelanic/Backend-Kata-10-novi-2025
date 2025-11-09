import { Request, Response } from "express";
import { SolicitudAccesoService } from "../services/SolicitudAcceso.service";
import {
  SolicitudAccesoDto,
  UpdateSolicitudAccesoDto,
} from "../dtos/SolicitudAccesoINS.dtos";

export class SolicitudAccesoController {
  private solicitudAccesoService: SolicitudAccesoService;

  constructor(solicitudAccesoService: SolicitudAccesoService) {
    this.solicitudAccesoService = solicitudAccesoService;
  }

  async createSolicitudAcceso(req: Request, res: Response): Promise<void> {
    try {
      const dto: SolicitudAccesoDto = req.body;
      const result = await this.solicitudAccesoService.createSolicitudAcceso(
        dto
      );
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(201).json({ solicitudAcceso: result.solicitudAcceso });
      }
    } catch (err) {
      console.error("Error creating solicitud acceso:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getAllSolicitudesAcceso(req: Request, res: Response): Promise<void> {
    try {
      const result =
        await this.solicitudAccesoService.getAllSolicitudesAcceso();
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitudesAcceso: result.solicitudesAcceso });
      }
    } catch (err) {
      console.error("Error fetching all solicitudes acceso:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getSolicitudAccesoById(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud acceso ID"] });
        return;
      }
      const result = await this.solicitudAccesoService.getSolicitudAccesoById(
        id_solicitud
      );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitudAcceso: result.solicitudAcceso });
      }
    } catch (err) {
      console.error("Error fetching solicitud acceso by ID:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getSolicitudesAccesoByAplicacion(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const aplicacion = req.params.aplicacion;
      const result =
        await this.solicitudAccesoService.getSolicitudesAccesoByAplicacion(
          aplicacion
        );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitudesAcceso: result.solicitudesAcceso });
      }
    } catch (err) {
      console.error("Error fetching solicitudes acceso by aplicacion:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async updateSolicitudAcceso(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud acceso ID"] });
        return;
      }
      const dto: UpdateSolicitudAccesoDto = req.body;
      const result = await this.solicitudAccesoService.updateSolicitudAcceso(
        id_solicitud,
        dto
      );
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitudAcceso: result.solicitudAcceso });
      }
    } catch (err) {
      console.error("Error updating solicitud acceso:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async deleteSolicitudAcceso(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud acceso ID"] });
        return;
      }
      const result = await this.solicitudAccesoService.deleteSolicitudAcceso(
        id_solicitud
      );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error("Error deleting solicitud acceso:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
}
