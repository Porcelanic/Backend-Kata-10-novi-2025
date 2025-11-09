import { Request, Response } from "express";
import { SolicitudService } from "../services/Solicitud.service";
import { SolicitudDto, UpdateSolicitudDto } from "../dtos/SolicitudINS.dtos";

export class SolicitudController {
  private solicitudService: SolicitudService;

  constructor(solicitudService: SolicitudService) {
    this.solicitudService = solicitudService;
  }

  async createSolicitud(req: Request, res: Response): Promise<void> {
    try {
      const dto: SolicitudDto = req.body;
      const result = await this.solicitudService.createSolicitud(dto);
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(201).json({ solicitud: result.solicitud });
      }
    } catch (err) {
      console.error("Error creating solicitud:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getAllSolicitudes(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.solicitudService.getAllSolicitudes();
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitudes: result.solicitudes });
      }
    } catch (err) {
      console.error("Error fetching all solicitudes:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getSolicitudById(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud ID"] });
        return;
      }
      const result = await this.solicitudService.getSolicitudById(id_solicitud);
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitud: result.solicitud });
      }
    } catch (err) {
      console.error("Error fetching solicitud by ID:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getSolicitudByCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const centro_costo = parseInt(req.params.centro_costo, 10);
      if (isNaN(centro_costo)) {
        res.status(400).json({ errors: ["Invalid centro_costo"] });
        return;
      }
      const result =
        await this.solicitudService.getSolicitudByCentroCosto(centro_costo);
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitud: result.solicitud });
      }
    } catch (err) {
      console.error("Error fetching solicitud by centro_costo:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getSolicitudByCorreo(req: Request, res: Response): Promise<void> {
    try {
      const correo_solicitante = req.params.correo_solicitante;
      const result =
        await this.solicitudService.getSolicitudByCorreo(correo_solicitante);
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitud: result.solicitud });
      }
    } catch (err) {
      console.error("Error fetching solicitud by correo_solicitante:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async updateSolicitud(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud ID"] });
        return;
      }
      const dto: UpdateSolicitudDto = req.body;
      const result = await this.solicitudService.updateSolicitud(
        id_solicitud,
        dto
      );
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ solicitud: result.solicitud });
      }
    } catch (err) {
      console.error("Error updating solicitud:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async deleteSolicitud(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud ID"] });
        return;
      }
      const result = await this.solicitudService.deleteSolicitud(id_solicitud);
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error("Error deleting solicitud:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
}
