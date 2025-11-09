import { Request, Response } from "express";
import { SolicitudDespliegueService } from "../services/SolicitudDespliegue.service";
import {
  SolicitudDespliegueDto,
  UpdateSolicitudDespliegueDto,
} from "../dtos/SolicitudDespliegueINS.dtos";

export class SolicitudDespliegueController {
  private solicitudDespliegueService: SolicitudDespliegueService;

  constructor(solicitudDespliegueService: SolicitudDespliegueService) {
    this.solicitudDespliegueService = solicitudDespliegueService;
  }

  async createSolicitudDespliegue(req: Request, res: Response): Promise<void> {
    try {
      const dto: SolicitudDespliegueDto = req.body;
      const result =
        await this.solicitudDespliegueService.createSolicitudDespliegue(dto);
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res
          .status(201)
          .json({ solicitudDespliegue: result.solicitudDespliegue });
      }
    } catch (err) {
      console.error("Error creating solicitud despliegue:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getAllSolicitudesDespliegue(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const result =
        await this.solicitudDespliegueService.getAllSolicitudesDespliegue();
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res
          .status(200)
          .json({ solicitudesDespliegue: result.solicitudesDespliegue });
      }
    } catch (err) {
      console.error("Error fetching all solicitudes despliegue:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getSolicitudDespliegueById(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud ID"] });
        return;
      }
      const result =
        await this.solicitudDespliegueService.getSolicitudDespliegueById(
          id_solicitud
        );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res
          .status(200)
          .json({ solicitudDespliegue: result.solicitudDespliegue });
      }
    } catch (err) {
      console.error("Error fetching solicitud despliegue by ID:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getSolicitudesDespliegueByHistoriaJira(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const historia_jira = req.params.historia_jira;
      const result =
        await this.solicitudDespliegueService.getSolicitudesDespliegueByHistoriaJira(
          historia_jira
        );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res
          .status(200)
          .json({ solicitudesDespliegue: result.solicitudesDespliegue });
      }
    } catch (err) {
      console.error(
        "Error fetching solicitudes despliegue by historia_jira:",
        err
      );
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async updateSolicitudDespliegue(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud ID"] });
        return;
      }
      const dto: UpdateSolicitudDespliegueDto = req.body;
      const result =
        await this.solicitudDespliegueService.updateSolicitudDespliegue(
          id_solicitud,
          dto
        );
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res
          .status(200)
          .json({ solicitudDespliegue: result.solicitudDespliegue });
      }
    } catch (err) {
      console.error("Error updating solicitud despliegue:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async deleteSolicitudDespliegue(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud ID"] });
        return;
      }
      const result =
        await this.solicitudDespliegueService.deleteSolicitudDespliegue(
          id_solicitud
        );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error("Error deleting solicitud despliegue:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
}
