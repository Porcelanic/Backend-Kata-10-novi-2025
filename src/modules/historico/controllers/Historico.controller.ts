import { Request, Response } from "express";
import { HistoricoService } from "../services/Historico.service";
import { HistoricoDto, UpdateHistoricoDto } from "../dtos/HistoricoINS.dtos";

export class HistoricoController {
  private historicoService: HistoricoService;

  constructor(historicoService: HistoricoService) {
    this.historicoService = historicoService;
  }

  async createHistorico(req: Request, res: Response): Promise<void> {
    try {
      const dto: HistoricoDto = req.body;
      const result = await this.historicoService.createHistorico(dto);
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(201).json({ historico: result.historico });
      }
    } catch (err) {
      console.error("Error creating historico:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getAllHistoricos(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.historicoService.getAllHistoricos();
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ historicos: result.historicos });
      }
    } catch (err) {
      console.error("Error fetching all historicos:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getHistoricoById(req: Request, res: Response): Promise<void> {
    try {
      const id_historico = parseInt(req.params.id, 10);
      if (isNaN(id_historico)) {
        res.status(400).json({ errors: ["Invalid historico ID"] });
        return;
      }
      const result = await this.historicoService.getHistoricoById(id_historico);
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ historico: result.historico });
      }
    } catch (err) {
      console.error("Error fetching historico by ID:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getHistoricosBySolicitudId(req: Request, res: Response): Promise<void> {
    try {
      const id_solicitud = parseInt(req.params.id_solicitud, 10);
      if (isNaN(id_solicitud)) {
        res.status(400).json({ errors: ["Invalid solicitud ID"] });
        return;
      }
      const result = await this.historicoService.getHistoricosBySolicitudId(
        id_solicitud
      );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ historicos: result.historicos });
      }
    } catch (err) {
      console.error("Error fetching historicos by solicitud ID:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async getHistoricosByAprobador(req: Request, res: Response): Promise<void> {
    try {
      const correo_aprobador = req.params.correo_aprobador;
      const result = await this.historicoService.getHistoricosByAprobador(
        correo_aprobador
      );
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ historicos: result.historicos });
      }
    } catch (err) {
      console.error("Error fetching historicos by correo_aprobador:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async updateHistorico(req: Request, res: Response): Promise<void> {
    try {
      const id_historico = parseInt(req.params.id, 10);
      if (isNaN(id_historico)) {
        res.status(400).json({ errors: ["Invalid historico ID"] });
        return;
      }
      const dto: UpdateHistoricoDto = req.body;
      const result = await this.historicoService.updateHistorico(
        id_historico,
        dto
      );
      if (result.errors) {
        res.status(400).json({ errors: result.errors });
      } else {
        res.status(200).json({ historico: result.historico });
      }
    } catch (err) {
      console.error("Error updating historico:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  async deleteHistorico(req: Request, res: Response): Promise<void> {
    try {
      const id_historico = parseInt(req.params.id, 10);
      if (isNaN(id_historico)) {
        res.status(400).json({ errors: ["Invalid historico ID"] });
        return;
      }
      const result = await this.historicoService.deleteHistorico(id_historico);
      if (result.errors) {
        res.status(404).json({ errors: result.errors });
      } else {
        res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error("Error deleting historico:", err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
}
