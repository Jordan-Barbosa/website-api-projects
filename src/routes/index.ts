import type { Router, Request, Response } from 'express';

import { Project } from '../models';

export default function getRoute(router: Router) {
  router.get('/', async (_req: Request, res: Response) => {
    const projects = await Project.find().exec();

    return res.send({ data: projects, count: projects.length });
  });
}
