import type { Request, Response } from 'express';
import { z } from 'zod';

import { validateRequest } from '../middlewares/validateRequest';
import { CatalogService } from '../services/CatalogService';

const areaSchema = z.object({ body: z.object({ nome: z.string(), descricao: z.string().optional() }) });
const grandeAreaSchema = z.object({ body: z.object({ nome: z.string(), areaAtuacaoId: z.string().optional() }) });
const subareaSchema = z.object({ body: z.object({ nome: z.string(), grandeAreaId: z.string() }) });

export class CatalogController {
  static listAreas = async (_req: Request, res: Response) => {
    res.json(await CatalogService.listAreas());
  };

  static createArea = [validateRequest(areaSchema), async (req: Request, res: Response) => {
    const area = await CatalogService.createArea(req.body);
    res.status(201).json(area);
  }];

  static updateArea = [validateRequest(areaSchema), async (req: Request, res: Response) => {
    const area = await CatalogService.updateArea(req.params.id, req.body);
    res.json(area);
  }];

  static deleteArea = async (req: Request, res: Response) => {
    await CatalogService.deleteArea(req.params.id);
    res.status(204).send();
  };

  static listGrandesAreas = async (_req: Request, res: Response) => {
    res.json(await CatalogService.listGrandesAreas());
  };

  static createGrandeArea = [validateRequest(grandeAreaSchema), async (req: Request, res: Response) => {
    const grandeArea = await CatalogService.createGrandeArea(req.body);
    res.status(201).json(grandeArea);
  }];

  static updateGrandeArea = [validateRequest(grandeAreaSchema), async (req: Request, res: Response) => {
    const grandeArea = await CatalogService.updateGrandeArea(req.params.id, req.body);
    res.json(grandeArea);
  }];

  static deleteGrandeArea = async (req: Request, res: Response) => {
    await CatalogService.deleteGrandeArea(req.params.id);
    res.status(204).send();
  };

  static listSubareas = async (_req: Request, res: Response) => {
    res.json(await CatalogService.listSubareas());
  };

  static createSubarea = [validateRequest(subareaSchema), async (req: Request, res: Response) => {
    const subarea = await CatalogService.createSubarea(req.body);
    res.status(201).json(subarea);
  }];

  static updateSubarea = [validateRequest(subareaSchema), async (req: Request, res: Response) => {
    const subarea = await CatalogService.updateSubarea(req.params.id, req.body);
    res.json(subarea);
  }];

  static deleteSubarea = async (req: Request, res: Response) => {
    await CatalogService.deleteSubarea(req.params.id);
    res.status(204).send();
  };
}
